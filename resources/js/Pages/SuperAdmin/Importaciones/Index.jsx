import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { AlertCircle, CheckCircle, X, Upload, AlertTriangle, FileText, RefreshCcw } from 'lucide-react';
import axios from 'axios';

const ImportacionesPage = ({ auth, title, companiesColumns, usersColumns, usersRequiredColumns, usersOptionalDefaultValues, companiesAdditionalInfoColumns }) => {
    const [files, setFiles] = useState({
        file1: null,
        file2: null,
        file3: null
    });
    
    const [fileNames, setFileNames] = useState({
        file1: '',
        file2: '',
        file3: ''
    });

    const [isLoading, setIsLoading] = useState({
        file1: false,
        file2: false,
        file3: false
    });

    const [results, setResults] = useState({
        file1: null,
        file2: null,
        file3: null
    });

    const [errors, setErrors] = useState({
        file1: null,
        file2: null,
        file3: null
    });

    const [importProgress, setImportProgress] = useState({
        importing: false,
        token: null,
        nextBatch: 1,
        percentage: 0,
        isComplete: false
    });

    // Efecto para continuar procesamiento por lotes
    useEffect(() => {
        if (importProgress.importing && importProgress.token && !importProgress.isComplete) {
            processNextBatch();
        }
    }, [importProgress]);

    const handleFileChange = (e, fileKey) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Verificar que el archivo es SQL o CSV
            const extension = selectedFile.name.split('.').pop().toLowerCase();
            if (extension !== 'sql' && extension !== 'csv') {
                alert('Solo se permiten archivos .sql o .csv');
                e.target.value = null;
                return;
            }
            
            setFiles(prev => ({
                ...prev,
                [fileKey]: selectedFile
            }));
            
            setFileNames(prev => ({
                ...prev,
                [fileKey]: selectedFile.name
            }));

            // Limpiar resultados y errores anteriores
            setResults(prev => ({
                ...prev,
                [fileKey]: null
            }));
            
            setErrors(prev => ({
                ...prev,
                [fileKey]: null
            }));

            // Reiniciar el progreso de importación
            setImportProgress({
                importing: false,
                token: null,
                nextBatch: 1,
                percentage: 0,
                isComplete: false
            });
        }
    };

    const importCompanies = async (fileKey) => {
        if (!files[fileKey]) {
            setErrors(prev => ({
                ...prev,
                [fileKey]: 'No se ha seleccionado ningún archivo'
            }));
            return;
        }

        setIsLoading(prev => ({
            ...prev,
            [fileKey]: true
        }));

        const formData = new FormData();
        formData.append('file', files[fileKey]);

        try {
            const response = await axios.post(route('import.companies'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResults(prev => ({
                ...prev,
                [fileKey]: response.data
            }));
        } catch (error) {
            console.error('Error al importar empresas:', error);
            
            setErrors(prev => ({
                ...prev,
                [fileKey]: error.response?.data?.error || 'Error al procesar el archivo'
            }));
        } finally {
            setIsLoading(prev => ({
                ...prev,
                [fileKey]: false
            }));
        }
    };

    const processNextBatch = async () => {
        if (!importProgress.token || importProgress.isComplete) return;
        
        try {
            const params = {
                import_token: importProgress.token,
                batch_number: importProgress.nextBatch
            };
            
            const response = await axios.post(route('import.users'), params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const responseData = response.data;
            
            // Actualizar resultados
            setResults(prev => ({
                ...prev,
                file2: responseData
            }));
            
            // Actualizar progreso
            if (responseData.is_complete) {
                setImportProgress(prev => ({
                    ...prev,
                    importing: false,
                    isComplete: true,
                    percentage: 100
                }));
                
                setIsLoading(prev => ({
                    ...prev,
                    file2: false
                }));
            } else {
                setImportProgress({
                    importing: true,
                    token: responseData.import_token,
                    nextBatch: responseData.next_batch,
                    percentage: responseData.progress.percentage,
                    isComplete: false
                });
            }
        } catch (error) {
            console.error('Error al procesar lote:', error);
            
            setErrors(prev => ({
                ...prev,
                file2: error.response?.data?.error || 'Error al procesar el lote'
            }));
            
            setImportProgress(prev => ({
                ...prev,
                importing: false
            }));
            
            setIsLoading(prev => ({
                ...prev,
                file2: false
            }));
        }
    };

    const importUsers = async (fileKey) => {
        if (!files[fileKey]) {
            setErrors(prev => ({
                ...prev,
                [fileKey]: 'No se ha seleccionado ningún archivo'
            }));
            return;
        }

        setIsLoading(prev => ({
            ...prev,
            [fileKey]: true
        }));

        const formData = new FormData();
        formData.append('file', files[fileKey]);

        try {
            const response = await axios.post(route('import.users'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Si la respuesta indica que hay que continuar con más lotes
            if (!response.data.is_complete) {
                setImportProgress({
                    importing: true,
                    token: response.data.import_token,
                    nextBatch: response.data.next_batch,
                    percentage: response.data.progress.percentage,
                    isComplete: false
                });
                
                setResults(prev => ({
                    ...prev,
                    [fileKey]: response.data
                }));
            } else {
                // La importación se completó en un solo lote
                setResults(prev => ({
                    ...prev,
                    [fileKey]: response.data
                }));
                
                setImportProgress({
                    importing: false,
                    token: null,
                    nextBatch: 1,
                    percentage: 100,
                    isComplete: true
                });
                
                setIsLoading(prev => ({
                    ...prev,
                    [fileKey]: false
                }));
            }
        } catch (error) {
            console.error('Error al importar usuarios:', error);
            
            setErrors(prev => ({
                ...prev,
                [fileKey]: error.response?.data?.error || 'Error al procesar el archivo'
            }));
            
            setImportProgress({
                importing: false,
                token: null,
                nextBatch: 1,
                percentage: 0,
                isComplete: false
            });
            
            setIsLoading(prev => ({
                ...prev,
                [fileKey]: false
            }));
        }
    };

    const importCompaniesAdditionalInfo = async (fileKey) => {
        if (!files[fileKey]) {
            setErrors(prev => ({
                ...prev,
                [fileKey]: 'No se ha seleccionado ningún archivo'
            }));
            return;
        }

        setIsLoading(prev => ({
            ...prev,
            [fileKey]: true
        }));

        const formData = new FormData();
        formData.append('file', files[fileKey]);

        try {
            const response = await axios.post(route('import.companies-additional-info'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResults(prev => ({
                ...prev,
                [fileKey]: response.data
            }));
        } catch (error) {
            console.error('Error al importar información adicional de empresas:', error);
            
            setErrors(prev => ({
                ...prev,
                [fileKey]: error.response?.data?.error || 'Error al procesar el archivo'
            }));
        } finally {
            setIsLoading(prev => ({
                ...prev,
                [fileKey]: false
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleImport = (fileKey, type) => {
        switch (type) {
            case 'companies':
                importCompanies(fileKey);
                break;
            case 'users':
                importUsers(fileKey);
                break;
            case 'companies-additional-info':
                importCompaniesAdditionalInfo(fileKey);
                break;
            default:
                console.error('Tipo de importación no válido');
        }
    };

    const clearResult = (fileKey) => {
        setResults(prev => ({
            ...prev,
            [fileKey]: null
        }));
        
        // Si estamos limpiando los resultados de usuarios, también reiniciar el progreso
        if (fileKey === 'file2') {
            setImportProgress({
                importing: false,
                token: null,
                nextBatch: 1,
                percentage: 0,
                isComplete: false
            });
        }
    };

    const clearError = (fileKey) => {
        setErrors(prev => ({
            ...prev,
            [fileKey]: null
        }));
    };

    const cancelImport = () => {
        setImportProgress({
            importing: false,
            token: null,
            nextBatch: 1,
            percentage: 0,
            isComplete: false
        });
        
        setIsLoading(prev => ({
            ...prev,
            file2: false
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{title}</h2>}
        >
            <Head title={title} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Importación de Archivos CSV
                            </h2>
                        
                            <div className="p-6 bg-white">
                                <div className="mb-6 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-2" />
                                        <h3 className="font-bold">Información</h3>
                                    </div>
                                    <p className="mt-2">
                                        Utilice esta página para importar archivos CSV a la base de datos. Solo el administrador del sistema tiene acceso a esta funcionalidad.
                                        El sistema aceptará archivos delimitados por comas (,), punto y coma (;) o tabuladores.
                                    </p>
                                </div>
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-8">
                                        {/* Campo de importación 1 - Empresas */}
                                        <div className="space-y-2 border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <InputLabel htmlFor="file1" className="text-lg font-medium">
                                                    Importación de Empresas (Companies)
                                                </InputLabel>
                                                <div className="flex items-center">
                                                    <span className="mr-2 text-sm text-gray-500">
                                                        Primero importar empresas
                                                    </span>
                                                    <FileText className="h-5 w-5 text-blue-500" />
                                                </div>
                                            </div>
                                            
                                            <p className="text-sm text-gray-500 mb-4">
                                                Seleccione un archivo CSV con los datos de empresas. Este archivo debe contener las siguientes columnas:
                                            </p>
                                            
                                            <div className="bg-gray-50 rounded-md p-2 mb-4 overflow-x-auto">
                                                <code className="text-xs text-gray-800 whitespace-nowrap">
                                                    {companiesColumns.join(', ')}
                                                </code>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <input
                                                    id="file1"
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={(e) => handleFileChange(e, 'file1')}
                                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full"
                                                />
                                            </div>
                                            
                                            {fileNames.file1 && (
                                                <div className="mt-2 flex items-center">
                                                    <span className="text-sm text-gray-500 mr-2">
                                                        Archivo seleccionado:
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {fileNames.file1}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-end mt-4">
                                                <PrimaryButton
                                                    type="button"
                                                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                                                    onClick={() => handleImport('file1', 'companies')}
                                                    //disabled={isLoading.file1 || !files.file1}
                                                >
                                                    {isLoading.file1 ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Importar Empresas
                                                        </>
                                                    )}
                                                </PrimaryButton>
                                            </div>

                                            {results.file1 && (
                                                <div className="mt-4 bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 relative">
                                                    <button
                                                        className="absolute top-2 right-2 text-green-500 hover:text-green-700"
                                                        onClick={() => clearResult('file1')}
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                    <div className="flex items-center mb-2">
                                                        <CheckCircle className="h-5 w-5 mr-2" />
                                                        <h3 className="font-bold">Importación completada</h3>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="text-sm">
                                                            <strong>Registros procesados:</strong> {results.file1.results.processed}
                                                        </p>
                                                        <p className="text-sm">
                                                            <strong>Registros exitosos:</strong> {results.file1.results.success}
                                                        </p>
                                                        <p className="text-sm">
                                                            <strong>Registros con errores:</strong> {results.file1.results.errors}
                                                        </p>
                                                        
                                                        {results.file1.results.errors > 0 && (
                                                            <div className="mt-2">
                                                                <p className="text-sm font-medium">Detalles de errores:</p>
                                                                <div className="max-h-40 overflow-y-auto mt-1 bg-white p-2 rounded">
                                                                    {results.file1.results.error_details.map((error, index) => (
                                                                        <div key={index} className="text-xs mb-1 pb-1 border-b border-green-100">
                                                                            <p><strong>Fila {error.row}:</strong></p>
                                                                            <ul className="list-disc list-inside">
                                                                                {error.errors.map((err, idx) => (
                                                                                    <li key={idx}>{err}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {errors.file1 && (
                                                <div className="mt-4 bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 relative">
                                                    <button
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                        onClick={() => clearError('file1')}
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="h-5 w-5 mr-2" />
                                                        <h3 className="font-bold">Error en la importación</h3>
                                                    </div>
                                                    <p className="mt-2 text-sm">{errors.file1}</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Campo de importación 2 - Usuarios */}
                                        <div className="space-y-2 border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <InputLabel htmlFor="file2" className="text-lg font-medium">
                                                    Importación de Usuarios (Users)
                                                </InputLabel>
                                                <div className="flex items-center">
                                                    <span className="mr-2 text-sm text-gray-500">
                                                        Importar después de empresas
                                                    </span>
                                                    <FileText className="h-5 w-5 text-blue-500" />
                                                </div>
                                            </div>
                                            
                                            <p className="text-sm text-gray-500 mb-2">
                                                Seleccione un archivo CSV con los datos de usuarios. El archivo debe contener las siguientes columnas:
                                            </p>
                                            
                                            <div className="bg-gray-50 rounded-md p-2 mb-2 overflow-x-auto">
                                                <code className="text-xs text-gray-800 whitespace-nowrap">
                                                    {usersColumns.join(', ')}
                                                </code>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-1">Columnas Obligatorias:</h4>
                                                <div className="bg-indigo-50 rounded-md p-2 overflow-x-auto">
                                                    <code className="text-xs text-indigo-800 whitespace-nowrap">
                                                        {usersRequiredColumns.join(', ')}
                                                    </code>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-emerald-700 mb-1">Valores por Defecto (para campos opcionales):</h4>
                                                <div className="bg-emerald-50 rounded-md p-2 overflow-x-auto">
                                                    <ul className="text-xs text-emerald-800">
                                                        {Object.entries(usersOptionalDefaultValues).map(([key, value]) => (
                                                            <li key={key} className="mb-1">
                                                                <strong>{key}:</strong> {value}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-yellow-700 mb-1">Importante:</h4>
                                                <div className="bg-yellow-50 rounded-md p-2">
                                                    <ul className="text-xs text-yellow-800 list-disc list-inside">
                                                        <li className="mb-1">El campo <strong>old_company_id</strong> debe contener el ID antiguo de la empresa, que debe coincidir con el <strong>old_id</strong> de alguna empresa importada previamente.</li>
                                                        <li className="mb-1">Si el <strong>old_company_id</strong> no se encuentra o no se proporciona, el usuario se creará sin asociación a empresa (company_id NULL).</li>
                                                        <li className="mb-1">Si el usuario ya existe (mismo email), se actualizará.</li>
                                                        <li className="mb-1">Se admiten archivos CSV separados por comas, punto y coma o tabuladores.</li>
                                                        <li className="mb-1">Archivos grandes (más de 1000 líneas) se procesarán por lotes automáticamente.</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <input
                                                    id="file2"
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={(e) => handleFileChange(e, 'file2')}
                                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full"
                                                    //disabled={importProgress.importing}
                                                />
                                            </div>
                                            
                                            {fileNames.file2 && (
                                                <div className="mt-2 flex items-center">
                                                    <span className="text-sm text-gray-500 mr-2">
                                                        Archivo seleccionado:
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {fileNames.file2}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Barra de progreso para importación por lotes */}
                                            {importProgress.importing && (
                                                <div className="mt-4">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium">Progreso: {importProgress.percentage}%</span>
                                                        <span className="text-sm font-medium">Lote {importProgress.nextBatch - 1} de {results.file2?.results?.total_batches || '?'}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div 
                                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                                                            style={{ width: `${importProgress.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="mt-2 flex items-center">
                                                        <RefreshCcw className="h-4 w-4 mr-1 text-blue-600 animate-spin" />
                                                        <span className="text-sm text-blue-700">Procesando lotes automáticamente... Por favor espere.</span>
                                                    </div>
                                                    <button
                                                        onClick={cancelImport}
                                                        className="mt-2 px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200"
                                                    >
                                                        Cancelar importación
                                                    </button>
                                                </div>
                                            )}

                                            <div className="flex justify-end mt-4">
                                                <PrimaryButton
                                                    type="button"
                                                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                                                    onClick={() => handleImport('file2', 'users')}
                                                    //disabled={isLoading.file2 || !files.file2 || importProgress.importing}
                                                >
                                                    {isLoading.file2 || importProgress.importing ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Importar Usuarios
                                                        </>
                                                    )}
                                                </PrimaryButton>
                                            </div>

                                            {results.file2 && importProgress.isComplete && (
                                                <div className="mt-4 bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 relative">
                                                    <button
                                                        className="absolute top-2 right-2 text-green-500 hover:text-green-700"
                                                        onClick={() => clearResult('file2')}
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                    <div className="flex items-center mb-2">
                                                        <CheckCircle className="h-5 w-5 mr-2" />
                                                        <h3 className="font-bold">Importación completada</h3>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="text-sm">
                                                            <strong>Registros procesados:</strong> {results.file2.results?.processed || 0}
                                                        </p>
                                                        <p className="text-sm">
                                                            <strong>Registros exitosos:</strong> {results.file2.results?.success || 0}
                                                        </p>
                                                        <p className="text-sm">
                                                            <strong>Registros con errores:</strong> {results.file2.results?.errors || 0}
                                                        </p>
                                                        
                                                        {results.file2.results?.errors > 0 && results.file2.results?.error_details && (
                                                            <div className="mt-2">
                                                                <p className="text-sm font-medium">Detalles de errores:</p>
                                                                <div className="max-h-40 overflow-y-auto mt-1 bg-white p-2 rounded">
                                                                    {results.file2.results.error_details.map((error, index) => (
                                                                        <div key={index} className="text-xs mb-1 pb-1 border-b border-green-100">
                                                                            <p><strong>Fila {error.row}:</strong></p>
                                                                            <ul className="list-disc list-inside">
                                                                                {error.errors.map((err, idx) => (
                                                                                    <li key={idx}>{err}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {errors.file2 && (
                                                <div className="mt-4 bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 relative">
                                                    <button
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                        onClick={() => clearError('file2')}
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="h-5 w-5 mr-2" />
                                                        <h3 className="font-bold">Error en la importación</h3>
                                                    </div>
                                                    <p className="mt-2 text-sm">{errors.file2}</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Campo de importación 3 - Información adicional de empresas */}
                                        <div className="space-y-2 border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <InputLabel htmlFor="file3" className="text-lg font-medium">
                                                    Importación de Información Adicional de Empresas
                                                </InputLabel>
                                                <div className="flex items-center">
                                                    <span className="mr-2 text-sm text-gray-500">
                                                        Importar después de empresas
                                                    </span>
                                                    <FileText className="h-5 w-5 text-blue-500" />
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">
                                                Seleccione un archivo CSV con información adicional de las empresas. El archivo debe contener las siguientes columnas:
                                            </p>
                                            
                                            <div className="bg-gray-50 rounded-md p-2 mb-4 overflow-x-auto">
                                                <code className="text-xs text-gray-800 whitespace-nowrap">
                                                    {companiesAdditionalInfoColumns.join(', ')}
                                                </code>
                                            </div>
                                            
                                            <div className="bg-yellow-50 rounded-md p-2 mb-4 text-yellow-800 border border-yellow-200">
                                                <div className="flex items-center">
                                                    <AlertTriangle className="h-5 w-5 mr-2" />
                                                    <span className="text-sm">
                                                        <strong>Importante:</strong> La empresa debe existir previamente con el mismo 'old_id' para poder vincular la información adicional.
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <input
                                                    id="file3"
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={(e) => handleFileChange(e, 'file3')}
                                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full"
                                                />
                                            </div>
                                            
                                            {fileNames.file3 && (
                                                <div className="mt-2 flex items-center">
                                                    <span className="text-sm text-gray-500 mr-2">
                                                        Archivo seleccionado:
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {fileNames.file3}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-end mt-4">
                                                <PrimaryButton
                                                    type="button"
                                                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                                                    onClick={() => handleImport('file3', 'companies-additional-info')}
                                                    //disabled={isLoading.file3 || !files.file3}
                                                >
                                                    {isLoading.file3 ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Importar Info Adicional
                                                        </>
                                                    )}
                                                </PrimaryButton>
                                            </div>
                                            
                                            {results.file3 && !errors.file3 && (
                                                <div className="mt-4 bg-green-50 text-green-800 border border-green-200 rounded-lg p-4">
                                                    <button 
                                                        className="float-right text-green-500 hover:text-green-700"
                                                        onClick={() => setResults(prev => ({ ...prev, file3: null }))}
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                    <div className="flex items-center">
                                                        <CheckCircle className="h-5 w-5 mr-2" />
                                                        <h3 className="font-bold">Importación completada</h3>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="text-sm">
                                                            <strong>Registros procesados:</strong> {results.file3.results?.processed || 0}
                                                        </p>
                                                        <p className="text-sm">
                                                            <strong>Registros exitosos:</strong> {results.file3.results?.success || 0}
                                                        </p>
                                                        <p className="text-sm">
                                                            <strong>Registros con errores:</strong> {results.file3.results?.errors || 0}
                                                        </p>
                                                        
                                                        {results.file3.results?.error_details && results.file3.results.error_details.length > 0 && (
                                                            <div className="mt-2">
                                                                <h4 className="font-semibold text-sm">Detalles de errores:</h4>
                                                                <div className="mt-1 max-h-40 overflow-y-auto text-xs">
                                                                    {results.file3.results.error_details.map((error, index) => (
                                                                        <div key={index} className="mb-2 p-1 border-b border-green-200">
                                                                            <p><strong>Fila:</strong> {error.row}</p>
                                                                            <p><strong>Errores:</strong> {error.errors.join(', ')}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {errors.file3 && (
                                                <div className="mt-4 bg-red-50 text-red-800 border border-red-200 rounded-lg p-4">
                                                    <button 
                                                        className="float-right text-red-500 hover:text-red-700"
                                                        onClick={() => setErrors(prev => ({ ...prev, file3: null }))}
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="h-5 w-5 mr-2" />
                                                        <h3 className="font-bold">Error en la importación</h3>
                                                    </div>
                                                    <p className="mt-2 text-sm">{errors.file3}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ImportacionesPage; 