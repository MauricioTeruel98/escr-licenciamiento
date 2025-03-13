<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Models\InfoAdicionalEmpresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ImportController extends Controller
{
    /**
     * Importar compañías desde un archivo CSV
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function importCompanies(Request $request)
    {
        // Validar que se haya enviado un archivo
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // Máximo 10MB
        ]);

        // Obtener el archivo
        $file = $request->file('file');
        
        // Verificar si el archivo se puede abrir
        if (($handle = fopen($file->getPathname(), 'r')) === false) {
            return response()->json(['error' => 'No se pudo abrir el archivo'], 400);
        }

        // Leer la cabecera
        $header = fgetcsv($handle, 0, ',');
        
        // Convertir cabeceras a minúsculas para facilitar la comparación
        $header = array_map('strtolower', $header);
        
        // Verificar que las cabeceras esperadas estén presentes
        $requiredColumns = [
            'legal_id', 'name', 'website', 'sector', 'provincia', 'commercial_activity', 
            'phone', 'mobile', 'is_exporter'
        ];
        
        foreach ($requiredColumns as $column) {
            if (!in_array($column, $header)) {
                fclose($handle);
                return response()->json(['error' => "Columna requerida no encontrada: {$column}"], 400);
            }
        }

        // Preparar la estructura para el procesamiento en lotes
        $importResults = [
            'processed' => 0,
            'success' => 0,
            'errors' => 0,
            'error_details' => []
        ];

        // Iniciar transacción
        DB::beginTransaction();
        
        try {
            // Procesar los datos en lotes de 100
            $batch = [];
            $rowNumber = 1; // Comenzamos desde 1 porque la cabecera ya fue leída
            
            while (($row = fgetcsv($handle, 0, ',')) !== false) {
                $rowNumber++;
                
                // Si la fila está vacía, continuar con la siguiente
                if (empty(array_filter($row))) {
                    continue;
                }
                
                // Mapear los datos del CSV a las columnas de la base de datos
                $companyData = [];
                foreach ($header as $index => $column) {
                    if (isset($row[$index])) {
                        // Convertir valores específicos
                        if ($column === 'is_exporter' || $column === 'authorized' || 
                            $column === 'autoeval_ended' || $column === 'authorized_by_super_admin') {
                            // Convertir valores booleanos
                            $companyData[$column] = in_array(strtolower($row[$index]), ['1', 'true', 'yes', 'si', 's', 'y']) ? 1 : 0;
                        } else {
                            $companyData[$column] = $row[$index];
                        }
                    }
                }
                
                // Asegurarnos de que todos los campos obligatorios tengan valores por defecto
                $companyData = array_merge([
                    'status' => 'active',
                    'authorized' => 0,
                    'autoeval_ended' => 0,
                    'estado_eval' => 'auto-evaluacion',
                    'authorized_by_super_admin' => 0,
                    'created_at' => now(), // Establecer created_at por defecto
                    'updated_at' => now(),
                    'is_exporter' => 0,
                    'canton' => '',
                    'distrito' => '',
                ], $companyData);
                
                // Validar los datos
                $validator = Validator::make($companyData, [
                    'legal_id' => 'required|string|max:255',
                    'name' => 'nullable|string|max:255',
                    'website' => 'nullable|string|max:255',
                    'sector' => 'nullable|string|max:255',
                    'provincia' => 'nullable|string|max:255',
                    'commercial_activity' => 'nullable|string',
                    'phone' => 'nullable|string|max:255',
                    'mobile' => 'nullable|string|max:255',
                    'is_exporter' => 'nullable|boolean',
                    'status' => 'nullable|string|max:255',
                    'authorized' => 'nullable|boolean',
                    'autoeval_ended' => 'nullable|boolean',
                    'estado_eval' => 'nullable|string',
                    'authorized_by_super_admin' => 'nullable|boolean',
                    'canton' => 'nullable|string|max:255',
                    'distrito' => 'nullable|string|max:255',
                    'old_id' => 'nullable|integer',
                ]);
                
                // Si hay errores de validación, registrarlos y continuar
                if ($validator->fails()) {
                    $importResults['errors']++;
                    $importResults['error_details'][] = [
                        'row' => $rowNumber,
                        'errors' => $validator->errors()->all(),
                        'data' => $companyData
                    ];
                    Log::warning("Error de validación en fila $rowNumber: " . json_encode($validator->errors()->all()));
                    continue;
                }
                
                try {
                    // Verificar si la empresa ya existe (por cédula jurídica)
                    $existingCompany = Company::where('legal_id', $companyData['legal_id'])->first();
                    
                    if ($existingCompany) {
                        // Actualizar empresa existente
                        $existingCompany->update($companyData);
                        $importResults['success']++;
                    } else {
                        // Añadir nueva empresa al lote
                        $batch[] = $companyData;
                        
                        // Si hemos alcanzado el tamaño del lote, insertar y limpiar
                        if (count($batch) >= 100) {
                            try {
                                Company::insert($batch);
                                $importResults['success'] += count($batch);
                            } catch (\Exception $e) {
                                // Registrar el error específico de la inserción en lote
                                Log::error("Error al insertar lote de empresas: " . $e->getMessage());
                                foreach ($batch as $company) {
                                    // Intentar insertar uno por uno para identificar el registro problemático
                                    try {
                                        // Asegurarse de que las fechas son objetos Carbon
                                        if (!empty($company['created_at']) && !$company['created_at'] instanceof Carbon) {
                                            try {
                                                $company['created_at'] = Carbon::parse($company['created_at']);
                                            } catch (\Exception $dateException) {
                                                // Si hay un error con el formato de la fecha, usar la fecha actual
                                                $company['created_at'] = now();
                                                Log::warning("Formato de fecha inválido para created_at en empresa {$company['legal_id']}. Se usará la fecha actual.");
                                            }
                                        } else if (empty($company['created_at'])) {
                                            // Si no hay fecha, usar la actual
                                            $company['created_at'] = now();
                                        }
                                        
                                        if (!empty($company['updated_at']) && !$company['updated_at'] instanceof Carbon) {
                                            try {
                                                $company['updated_at'] = Carbon::parse($company['updated_at']);
                                            } catch (\Exception $dateException) {
                                                // Si hay un error con el formato de la fecha, usar la fecha actual
                                                $company['updated_at'] = now();
                                                Log::warning("Formato de fecha inválido para updated_at en empresa {$company['legal_id']}. Se usará la fecha actual.");
                                            }
                                        } else if (empty($company['updated_at'])) {
                                            // Si no hay fecha, usar la actual
                                            $company['updated_at'] = now();
                                        }
                                        
                                        Company::create($company);
                                        $importResults['success']++;
                                    } catch (\Exception $ex) {
                                        $importResults['errors']++;
                                        $importResults['error_details'][] = [
                                            'row' => 'desconocida',
                                            'errors' => [$ex->getMessage()],
                                            'data' => $company
                                        ];
                                        Log::error("Error al insertar empresa individual: " . $ex->getMessage() . " - Datos: " . json_encode($company));
                                    }
                                }
                            }
                            $batch = [];
                        }
                    }
                } catch (\Exception $e) {
                    // Registrar errores específicos por registro
                    $importResults['errors']++;
                    $importResults['error_details'][] = [
                        'row' => $rowNumber,
                        'errors' => [$e->getMessage()],
                        'data' => $companyData
                    ];
                    Log::error("Error procesando empresa en fila $rowNumber: " . $e->getMessage());
                }
                
                $importResults['processed']++;
            }
            
            // Insertar el lote final si hay datos pendientes
            if (!empty($batch)) {
                try {
                    Company::insert($batch);
                    $importResults['success'] += count($batch);
                } catch (\Exception $e) {
                    // Registrar el error específico de la inserción en lote
                    Log::error("Error al insertar lote final de empresas: " . $e->getMessage());
                    foreach ($batch as $company) {
                        // Intentar insertar uno por uno para identificar el registro problemático
                        try {
                            // Asegurarse de que las fechas son objetos Carbon
                            if (!empty($company['created_at']) && !$company['created_at'] instanceof Carbon) {
                                try {
                                    $company['created_at'] = Carbon::parse($company['created_at']);
                                } catch (\Exception $dateException) {
                                    // Si hay un error con el formato de la fecha, usar la fecha actual
                                    $company['created_at'] = now();
                                    Log::warning("Formato de fecha inválido para created_at en empresa {$company['legal_id']}. Se usará la fecha actual.");
                                }
                            } else if (empty($company['created_at'])) {
                                // Si no hay fecha, usar la actual
                                $company['created_at'] = now();
                            }
                            
                            if (!empty($company['updated_at']) && !$company['updated_at'] instanceof Carbon) {
                                try {
                                    $company['updated_at'] = Carbon::parse($company['updated_at']);
                                } catch (\Exception $dateException) {
                                    // Si hay un error con el formato de la fecha, usar la fecha actual
                                    $company['updated_at'] = now();
                                    Log::warning("Formato de fecha inválido para updated_at en empresa {$company['legal_id']}. Se usará la fecha actual.");
                                }
                            } else if (empty($company['updated_at'])) {
                                // Si no hay fecha, usar la actual
                                $company['updated_at'] = now();
                            }
                            
                            Company::create($company);
                            $importResults['success']++;
                        } catch (\Exception $ex) {
                            $importResults['errors']++;
                            $importResults['error_details'][] = [
                                'row' => 'desconocida',
                                'errors' => [$ex->getMessage()],
                                'data' => $company
                            ];
                            Log::error("Error al insertar empresa individual (lote final): " . $ex->getMessage() . " - Datos: " . json_encode($company));
                        }
                    }
                }
            }
            
            // Confirmar la transacción
            DB::commit();
            
            // Cerrar el archivo
            fclose($handle);
            
            return response()->json([
                'message' => 'Importación de empresas completada',
                'results' => $importResults
            ]);
            
        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            
            // Cerrar el archivo
            if (isset($handle) && $handle) {
                fclose($handle);
            }
            
            // Registrar el error
            Log::error("Error al importar empresas: " . $e->getMessage());
            
            return response()->json([
                'error' => 'Error al procesar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import users from a CSV file
     */
    public function importUsers(Request $request)
    {
        // Verificamos si es un procesamiento de lote continuo o un nuevo archivo
        if ($request->has('import_token') && $request->has('batch_number')) {
            return $this->processUserBatch($request->import_token, $request->batch_number);
        }

        // Si es un nuevo archivo, validamos
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Error de validación: ' . $validator->errors()->first()
            ], 400);
        }

        // Generar un token único para esta importación
        $importToken = md5(time() . rand(1000, 9999));
        
        // Guardar el archivo en una ubicación temporal
        $file = $request->file('file');
        $filePath = $file->storeAs('imports/temp', $importToken . '.csv');
        
        // Inicializar el archivo de resultados
        $importResults = [
            'processed' => 0,
            'success' => 0,
            'errors' => 0,
            'error_details' => [],
            'total_lines' => 0,
            'total_batches' => 0,
        ];
        
        // Estimar el número total de líneas y establecer el tamaño del lote
        $fileContent = Storage::get($filePath);
        $totalLines = substr_count($fileContent, "\n");
        $batchSize = 200; // Ajustar según necesidades
        $totalBatches = ceil($totalLines / $batchSize);
        
        $importResults['total_lines'] = $totalLines;
        $importResults['total_batches'] = $totalBatches;
        
        // Guardar los resultados iniciales
        Storage::put('imports/temp/' . $importToken . '_results.json', json_encode($importResults));
        
        // Procesar el primer lote
        $batchResponse = $this->processUserBatch($importToken, 1);
        
        return $batchResponse;
    }
    
    /**
     * Process a batch of users from a CSV file
     */
    protected function processUserBatch($importToken, $batchNumber)
    {
        // Establecer un límite de tiempo más largo pero no excesivo
        set_time_limit(120); // 2 minutos por lote
        
        // Cargar los resultados actuales
        $resultsPath = 'imports/temp/' . $importToken . '_results.json';
        $filePath = 'imports/temp/' . $importToken . '.csv';
        
        if (!Storage::exists($resultsPath) || !Storage::exists($filePath)) {
            return response()->json([
                'error' => 'No se encontraron los archivos de importación.'
            ], 400);
        }
        
        $importResults = json_decode(Storage::get($resultsPath), true);
        $batchSize = 200;
        $startLine = ($batchNumber - 1) * $batchSize + 1; // +1 para omitir el encabezado en el primer lote
        
        // Si es el primer lote, compensamos la línea de encabezado
        $offset = ($batchNumber == 1) ? 0 : ($batchNumber - 1) * $batchSize + 1;
        $limit = $batchSize;
        
        // Abrir el archivo y saltarse las líneas hasta llegar al offset
        $handle = fopen(Storage::path($filePath), 'r');
        $delimiter = $this->detectDelimiter($handle);
        
        // Leer el encabezado
        $header = fgetcsv($handle, 0, $delimiter);
        
        // Si no es el primer lote, saltamos las líneas hasta llegar al offset
        if ($batchNumber > 1) {
            $i = 1;
            while ($i < $offset && !feof($handle)) {
                fgetcsv($handle, 0, $delimiter);
                $i++;
            }
        }
        
        // Iniciar transacción
        DB::beginTransaction();
        
        try {
            $processedInBatch = 0;
            $successInBatch = 0;
            $errorsInBatch = 0;
            $rowNumber = $offset + 1;
            $users = [];
            
            // Leer las líneas del lote actual
            while ($processedInBatch < $limit && ($row = fgetcsv($handle, 0, $delimiter)) !== false) {
                $rowNumber++;
                $processedInBatch++;
                $importResults['processed']++;
                
                // Mapear las columnas CSV a columnas de la base de datos
                $data = [];
                foreach ($header as $i => $column) {
                    if (isset($row[$i])) {
                        $data[trim($column)] = trim($row[$i]);
                    }
                }
                
                // Manejar campos numéricos vacíos
                $camposNumericos = ['cedula', 'phone', 'mobile', 'form_sended', 'terms_accepted', 'from_migration'];
                foreach ($camposNumericos as $campo) {
                    if (isset($data[$campo]) && $data[$campo] === '') {
                        $data[$campo] = ($campo === 'form_sended' || $campo === 'terms_accepted' || $campo === 'from_migration') ? 0 : null;
                    }
                }
                
                // Aplicar validaciones
                $validator = Validator::make($data, [
                    'name' => 'nullable|string|max:255',
                    'email' => 'required|string|email|max:255',
                    'password' => 'nullable|string|min:6',
                    'cedula' => 'nullable|integer',
                ]);
                
                if ($validator->fails()) {
                    $importResults['errors']++;
                    $errorsInBatch++;
                    $importResults['error_details'][] = [
                        'row' => $rowNumber,
                        'errors' => $validator->errors()->all()
                    ];
                    continue;
                }
                
                // Generar una contraseña aleatoria si no se proporciona
                if (empty($data['password'])) {
                    $data['password'] = substr(md5(rand()), 0, 8);
                }
                
                // Asignar valores por defecto a campos obligatorios
                $defaults = [
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                // Fusionar datos con valores por defecto
                $userData = array_merge($defaults, $data);
                
                // Establecer campos por defecto para valores nulos o vacíos
                if (isset($userData['role']) && empty($userData['role'])) {
                    $userData['role'] = 'user';
                }
                
                // Asegurarnos que los campos booleanos sean 0 o 1
                $camposBooleanos = ['form_sended', 'terms_accepted', 'from_migration'];
                foreach ($camposBooleanos as $campo) {
                    if (isset($userData[$campo])) {
                        if (is_string($userData[$campo])) {
                            $userData[$campo] = in_array(strtolower($userData[$campo]), ['1', 'true', 'yes', 'si', 's', 'y']) ? 1 : 0;
                        }
                    } else {
                        $userData[$campo] = 0;
                    }
                }
                
                // Buscar la empresa por old_id si se proporciona old_company_id
                $userData['company_id'] = null;
                if (!empty($userData['old_company_id'])) {
                    $company = Company::where('old_id', $userData['old_company_id'])->first();
                    if ($company) {
                        $userData['company_id'] = $company->id;
                    } else {
                        Log::warning("Importación de usuarios: No se encontró la empresa con old_id {$userData['old_company_id']} para el usuario {$userData['email']}. Se asignará company_id = NULL.");
                    }
                }
                
                // Verificar si el usuario ya existe
                $user = User::where('email', $userData['email'])->first();
                
                if ($user) {
                    // Actualizar usuario existente
                    try {
                        // No actualizar la contraseña si no se proporciona
                        if (isset($userData['password'])) {
                            $userData['password'] = Hash::make($userData['password']);
                        } else {
                            unset($userData['password']);
                        }
                        
                        $user->update($userData);
                        $importResults['success']++;
                        $successInBatch++;
                    } catch (\Exception $e) {
                        $importResults['errors']++;
                        $errorsInBatch++;
                        $importResults['error_details'][] = [
                            'row' => $rowNumber,
                            'errors' => ['Error al actualizar el usuario: ' . $e->getMessage()]
                        ];
                    }
                } else {
                    // Cifrar la contraseña
                    $userData['password'] = Hash::make($userData['password']);
                    
                    // Añadir a la lista para inserción por lotes
                    $users[] = $userData;
                    
                    // Si alcanzamos 100 registros, insertarlos en lote
                    if (count($users) >= 100) {
                        try {
                            DB::table('users')->insert($users);
                            $importResults['success'] += count($users);
                            $successInBatch += count($users);
                            $users = []; // Vaciar el array para el siguiente lote
                        } catch (\Exception $e) {
                            // Si falla la inserción por lotes, intentar insertar uno por uno
                            foreach ($users as $userData) {
                                try {
                                    User::create($userData);
                                    $importResults['success']++;
                                    $successInBatch++;
                                } catch (\Exception $userEx) {
                                    $importResults['errors']++;
                                    $errorsInBatch++;
                                    $importResults['error_details'][] = [
                                        'row' => $rowNumber - (count($users) - array_search($userData, $users)),
                                        'errors' => ['Error al crear el usuario: ' . $userEx->getMessage()]
                                    ];
                                }
                            }
                            $users = []; // Vaciar el array después de procesar
                        }
                    }
                }
            }
            
            // Insertar los usuarios restantes
            if (!empty($users)) {
                try {
                    DB::table('users')->insert($users);
                    $importResults['success'] += count($users);
                    $successInBatch += count($users);
                } catch (\Exception $e) {
                    // Si falla la inserción por lotes, intentar insertar uno por uno
                    foreach ($users as $userData) {
                        try {
                            User::create($userData);
                            $importResults['success']++;
                            $successInBatch++;
                        } catch (\Exception $userEx) {
                            $importResults['errors']++;
                            $errorsInBatch++;
                            $importResults['error_details'][] = [
                                'row' => $rowNumber - (count($users) - array_search($userData, $users)),
                                'errors' => ['Error al crear el usuario: ' . $userEx->getMessage()]
                            ];
                        }
                    }
                }
            }
            
            DB::commit();
            
            // Actualizar y guardar los resultados
            Storage::put($resultsPath, json_encode($importResults));
            
            // Verificar si hemos terminado de procesar todo el archivo
            $isComplete = $importResults['processed'] >= $importResults['total_lines'] || feof($handle);
            
            // Cerrar el archivo
            fclose($handle);
            
            // Si hemos terminado, eliminar los archivos temporales
            if ($isComplete) {
                Storage::delete([$filePath, $resultsPath]);
            }
            
            // Calcular progreso
            $percentage = min(100, round(($importResults['processed'] / max(1, $importResults['total_lines'])) * 100));
            
            return response()->json([
                'message' => $isComplete ? 'Importación completada' : 'Lote procesado con éxito',
                'results' => $importResults,
                'is_complete' => $isComplete,
                'import_token' => $importToken,
                'next_batch' => $isComplete ? null : $batchNumber + 1,
                'progress' => [
                    'percentage' => $percentage,
                    'processed_in_batch' => $processedInBatch,
                    'success_in_batch' => $successInBatch,
                    'errors_in_batch' => $errorsInBatch
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            
            // Cerrar el archivo
            fclose($handle);
            
            Log::error('Error al procesar lote de usuarios: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Error al procesar el lote: ' . $e->getMessage(),
                'import_token' => $importToken,
                'batch_number' => $batchNumber
            ], 500);
        }
    }
    
    /**
     * Detecta el delimitador usado en un archivo CSV
     */
    protected function detectDelimiter($fileHandle) {
        $delimiters = [',', ';', "\t", '|'];
        $firstLine = fgets($fileHandle);
        rewind($fileHandle);
        
        $counts = [];
        foreach ($delimiters as $delimiter) {
            $counts[$delimiter] = substr_count($firstLine, $delimiter);
        }
        
        // Seleccionar el delimitador con mayor número de ocurrencias
        $maxDelimiter = ','; // delimitador por defecto
        $maxCount = 0;
        
        foreach ($counts as $delimiter => $count) {
            if ($count > $maxCount) {
                $maxCount = $count;
                $maxDelimiter = $delimiter;
            }
        }
        
        return $maxDelimiter;
    }

    /**
     * Importar información adicional de compañías desde un archivo CSV
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function importCompaniesAdditionalInfo(Request $request)
    {
        // Validar que se haya enviado un archivo
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // Máximo 10MB
        ]);

        // Obtener el archivo
        $file = $request->file('file');
        
        // Verificar si el archivo se puede abrir
        if (($handle = fopen($file->getPathname(), 'r')) === false) {
            return response()->json(['error' => 'No se pudo abrir el archivo'], 400);
        }

        // Leer la cabecera
        $header = fgetcsv($handle, 0, ',');
        
        // Convertir cabeceras a minúsculas para facilitar la comparación
        $header = array_map('strtolower', $header);
        
        // Verificar que las cabeceras esperadas estén presentes
        $requiredColumns = ['old_id', 'email_notifications', 'location_exact', 'general_manager', 'legal_representative'];
        
        foreach ($requiredColumns as $column) {
            if (!in_array($column, $header)) {
                fclose($handle);
                return response()->json(['error' => "Columna requerida no encontrada: {$column}"], 400);
            }
        }

        // Preparar la estructura para el procesamiento
        $importResults = [
            'processed' => 0,
            'success' => 0,
            'errors' => 0,
            'error_details' => []
        ];

        // Iniciar transacción
        DB::beginTransaction();
        
        try {
            // Procesar los datos
            $rowNumber = 1; // Comenzamos desde 1 porque la cabecera ya fue leída
            
            while (($row = fgetcsv($handle, 0, ',')) !== false) {
                $rowNumber++;
                
                // Si la fila está vacía, continuar con la siguiente
                if (empty(array_filter($row))) {
                    continue;
                }
                
                // Mapear los datos del CSV a las columnas de la base de datos
                $additionalData = [];
                foreach ($header as $index => $column) {
                    if (isset($row[$index])) {
                        $additionalData[$column] = $row[$index];
                    }
                }
                
                // Verificar si existe el old_id
                if (empty($additionalData['old_id'])) {
                    $importResults['errors']++;
                    $importResults['error_details'][] = [
                        'row' => $rowNumber,
                        'errors' => ['El campo old_id es obligatorio'],
                        'data' => $additionalData
                    ];
                    continue;
                }
                
                // Buscar la empresa por su old_id
                $company = Company::where('old_id', $additionalData['old_id'])->first();
                
                if (!$company) {
                    $importResults['errors']++;
                    $importResults['error_details'][] = [
                        'row' => $rowNumber,
                        'errors' => ["No se encontró ninguna empresa con old_id: {$additionalData['old_id']}"],
                        'data' => $additionalData
                    ];
                    Log::warning("Importación de info adicional: No se encontró empresa con old_id {$additionalData['old_id']} en la fila {$rowNumber}");
                    continue;
                }
                
                try {
                    // Mapear los campos del CSV a los campos de la tabla info_adicional_empresas
                    $infoAdicionalData = [
                        'company_id' => $company->id,
                        'contacto_notificacion_email' => $additionalData['email_notifications'] ?? null,
                        'direccion_empresa' => $additionalData['location_exact'] ?? null,
                        'asignado_proceso_nombre' => $additionalData['general_manager'] ?? null,
                        'representante_nombre' => $additionalData['legal_representative'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    
                    // Verificar si ya existe un registro para esta empresa
                    $infoAdicional = InfoAdicionalEmpresa::where('company_id', $company->id)->first();
                    
                    if ($infoAdicional) {
                        // Actualizar solo los campos proporcionados
                        foreach ($infoAdicionalData as $key => $value) {
                            if ($value !== null && $key !== 'company_id' && $key !== 'created_at') {
                                $infoAdicional->$key = $value;
                            }
                        }
                        $infoAdicional->save();
                    } else {
                        // Crear un nuevo registro
                        InfoAdicionalEmpresa::create($infoAdicionalData);
                    }
                    
                    $importResults['success']++;
                } catch (\Exception $e) {
                    $importResults['errors']++;
                    $importResults['error_details'][] = [
                        'row' => $rowNumber,
                        'errors' => [$e->getMessage()],
                        'data' => $additionalData
                    ];
                    Log::error("Error procesando información adicional para empresa con old_id {$additionalData['old_id']} en fila $rowNumber: " . $e->getMessage());
                }
                
                $importResults['processed']++;
            }
            
            // Confirmar la transacción
            DB::commit();
            
            // Cerrar el archivo
            fclose($handle);
            
            return response()->json([
                'message' => 'Importación de información adicional de empresas completada',
                'results' => $importResults
            ]);
            
        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            
            // Cerrar el archivo
            if (isset($handle) && $handle) {
                fclose($handle);
            }
            
            // Registrar el error
            Log::error("Error al importar información adicional de empresas: " . $e->getMessage());
            
            return response()->json([
                'error' => 'Error al procesar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Muestra la página de importaciones
     */
    public function index()
    {
        $companiesColumns = [
            'old_id', 'legal_id', 'name', 'address', 'website', 'phone', 'email',
            'canton', 'distrito', 'is_exporter'
        ];

        $usersColumns = [
            'name', 'email', 'password', 'role', 'old_company_id'
        ];

        $usersRequiredColumns = [
            'name', 'email'
        ];

        $usersOptionalDefaultValues = [
            'password' => 'Se generará automáticamente si no se proporciona',
            'role' => 'user',
            'status' => 'active',
            'company_id' => 'NULL si no se encuentra old_company_id',
            'created_at/updated_at' => 'Fecha y hora actual'
        ];
        
        $companiesAdditionalInfoColumns = [
            'old_id', 'email_notifications', 'location_exact', 'general_manager', 'legal_representative'
        ];

        return Inertia::render('SuperAdmin/Importaciones/Index', [
            'title' => 'Importación de Datos',
            'companiesColumns' => $companiesColumns,
            'usersColumns' => $usersColumns,
            'usersRequiredColumns' => $usersRequiredColumns,
            'usersOptionalDefaultValues' => $usersOptionalDefaultValues,
            'companiesAdditionalInfoColumns' => $companiesAdditionalInfoColumns,
        ]);
    }
} 