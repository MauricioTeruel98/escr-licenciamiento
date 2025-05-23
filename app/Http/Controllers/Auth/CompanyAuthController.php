<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NewAccessRequest;
use App\Notifications\AccessRequestApproved;
use App\Notifications\AccessRequestRejected;
use App\Notifications\AccessRequestPendingNotification;
use App\Notifications\NewAccessRequestNotification;
use App\Services\MailService;

class CompanyAuthController extends Controller
{
    protected $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    public function showRegard()
    {
        return Inertia::render('Auth/Regard');
    }

    public function showCompanyRegister()
    {
        // Verificar si el usuario ya tiene una empresa asignada
        if (Auth::user()->company_id) {
            return redirect()->route('dashboard')
                ->with('error', 'No puede registrar otra empresa porque ya tiene una empresa registrada.');
        }

        // Obtener la cédula jurídica de la sesión
        $legalId = session('legal_id', '');

        // Cargar las provincias desde el archivo lugares.json
        $lugaresJson = file_get_contents(storage_path('app/public/lugares.json'));
        $lugares = json_decode($lugaresJson, true);

        // Extraer solo las provincias
        $provincias = [];
        if (isset($lugares[0]['provincias'])) {
            foreach ($lugares[0]['provincias'] as $provincia) {
                $provincias[] = [
                    'id' => $provincia['id'],
                    'name' => $provincia['name']
                ];
            }
        }

        return Inertia::render('Auth/CompanyRegister', [
            'legalId' => $legalId,
            'provincias' => $provincias,
            'hasCompany' => Auth::user()->company_id !== null
        ]);
    }

    public function showLegalId()
    {
        return Inertia::render('Auth/LegalId');
    }

    public function showCompanyExists()
    {
        return Inertia::render('Auth/CompanyExists');
    }

    public function verifyLegalId(Request $request)
    {
        // Limpiar los datos de entrada
        if (is_string($request->legal_id)) {
            // Eliminar espacios en blanco al inicio, comillas, barras y barras invertidas
            $cleanedValue = preg_replace('/[\'"\\\\\\/]/', '', ltrim($request->legal_id));
            $request->merge(['legal_id' => $cleanedValue]);
        }

        $request->validate([
            'legal_id' => [
                'required',
                'string',
                'regex:/^[a-zA-Z0-9]+$/'
            ]
        ], [
            'legal_id.regex' => 'La cédula jurídica solo puede contener letras y números, sin espacios ni caracteres especiales.'
        ]);

        try {
            DB::beginTransaction();
            $company = Company::where('legal_id', $request->legal_id)->first();

            if ($company) {
                // Si la empresa existe, guardamos el ID en sesión y redirigimos a CompanyExists
                session(['pending_company_id' => $company->id]);
                DB::commit();
                return redirect()->route('company.exists');
            }

            // Si la empresa no existe, guardamos el legal_id en la sesión y redirigimos al registro
            session(['legal_id' => $request->legal_id]);

            DB::commit();
            return redirect()->route('company.register');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al verificar cédula jurídica:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return back()
                ->withInput()
                ->with('error', 'Hubo un error al procesar la solicitud. Por favor, intente nuevamente.');
        }
    }

    public function requestAccess()
    {
        try {
            DB::beginTransaction();

            $companyId = session('pending_company_id');
            if (!$companyId) {
                throw new \Exception('No hay una empresa pendiente de asignación');
            }

            $user = Auth::user();
            $company = \App\Models\Company::findOrFail($companyId);

            $user->company_id = $companyId;
            $user->role = 'user';
            $user->status = 'pending';
            $user->save();

            // Enviar notificación al usuario solicitante
            try {
                $notification = new AccessRequestPendingNotification($company);
                $this->mailService->send($user->email, $notification);
            } catch (\Exception $e) {
                Log::error('Error al enviar la notificación de solicitud de acceso pendiente: ' . $e->getMessage());
            }

            // Enviar notificación al administrador de la empresa
            $adminUser = \App\Models\User::where('company_id', $companyId)
                ->where('role', 'admin')
                ->first();

            if ($adminUser) {
                try {
                    $notification = new NewAccessRequestNotification($user);
                    $this->mailService->send($adminUser->email, $notification);
                } catch (\Exception $e) {
                    Log::error('Error al enviar la notificación de solicitud de acceso pendiente al administrador: ' . $e->getMessage());
                }
            }

            session()->forget('pending_company_id');

            DB::commit();

            return redirect()->route('approval.pending')
                ->with('success', 'Solicitud de acceso enviada. Espere la aprobación del administrador.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al solicitar acceso:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Hubo un error al procesar la solicitud. Por favor, intente nuevamente.');
        }
    }

    public function approveAccess(Request $request, User $user)
    {
        try {
            if (!Auth::user()->role === 'admin' && !Auth::user()->role === 'super_admin') {
                throw new \Exception('No tiene permisos para realizar esta acción');
            }

            $user->status = 'approved';
            $user->save();

            return back()->with('success', 'Usuario aprobado exitosamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al aprobar el usuario');
        }
    }

    public function rejectAccess(Request $request, User $user)
    {
        try {
            if (!Auth::user()->role === 'admin' && !Auth::user()->role === 'super_admin') {
                throw new \Exception('No tiene permisos para realizar esta acción');
            }

            $user->status = 'rejected';
            $user->save();

            return back()->with('success', 'Usuario rechazado');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al rechazar el usuario');
        }
    }

    public function storeCompany(Request $request)
    {
        // Verificar si el usuario ya tiene una empresa asignada
        if (Auth::user()->company_id) {
            return redirect()->route('dashboard')->with('error', 'No puede registrar otra empresa porque ya tiene una empresa registrada.');
        }

        try {
            // Limpiar los datos de entrada
            $cleanedData = [];
            foreach ($request->all() as $key => $value) {
                if (is_string($value)) {
                    if ($key === 'website') {
                        // Para URLs solo eliminamos espacios al inicio y comillas
                        $cleanedValue = preg_replace('/[\'"]/', '', ltrim($value));
                    } else {
                        // Para otros campos eliminamos espacios al inicio, comillas, barras y barras invertidas
                        $cleanedValue = preg_replace('/[\'"\\\\\\/]/', '', ltrim($value));
                    }
                    $request->merge([$key => $cleanedValue]);
                    $cleanedData[$key] = $cleanedValue;
                }
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'website' => 'required|url',
                'sector' => 'required|string',
                'provincia' => ['required', 'string', 'regex:/^[a-zA-Z0-9\s\-áéíóúÁÉÍÓÚñÑ]+$/'],
                'legal_id' => ['required', 'string', 'regex:/^[a-zA-Z0-9]+$/'],
                'commercial_activity' => 'required|string',
                'phone' => ['required', 'string', 'regex:/^[0-9\-\(\)]+$/'],
                'mobile' => ['required', 'string', 'regex:/^[0-9\-\(\)]+$/'],
                'is_exporter' => 'required|boolean',
            ], [
                'legal_id.regex' => 'La cédula jurídica solo puede contener letras y números, sin espacios ni caracteres especiales.',
                'phone.regex' => 'El teléfono solo puede contener números, guiones y paréntesis.',
                'mobile.regex' => 'El teléfono celular solo puede contener números, guiones y paréntesis.',
                'provincia.regex' => 'La provincia solo puede contener letras, números, espacios y guiones.',
                'website.url' => 'El formato del sitio web no es válido. Debe incluir "https://" o "http://" al inicio (ejemplo: https://www.miempresa.com)'
            ]);

            DB::beginTransaction();

            $user = Auth::user();

            if (!$user->company_id) {
                $company = Company::create($validated);
                $company->fecha_inicio_auto_evaluacion = now();
                $company->save();
            }

            // Vincular la empresa al usuario actual y establecerlo como admin
            $user->company_id = $company->id;
            $user->role = 'admin';
            $user->status = 'approved';
            $user->save();

            // Limpiar la sesión
            session()->forget('legal_id');

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Empresa registrada exitosamente');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Error de validación:', [
                'errors' => $e->errors(),
                'request' => $request->all()
            ]);
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear empresa:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return back()
                ->withInput()
                ->with('error', 'Hubo un error al registrar la empresa. Por favor, intente nuevamente.');
        }
    }
}
