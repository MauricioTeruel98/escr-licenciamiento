<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CompanyAuthController extends Controller
{
    public function showRegard()
    {
        return Inertia::render('Auth/Regard');
    }

    public function showCompanyRegister()
    {
        return Inertia::render('Auth/CompanyRegister');
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
        $request->validate([
            'legal_id' => 'required|string'
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
            $user->company_id = $companyId;
            $user->role = 'user'; // Asignar rol de usuario común
            $user->save();
    
            session()->forget('pending_company_id');
    
            DB::commit();
            return redirect()->route('dashboard')
                ->with('success', 'Has sido asociado a la empresa exitosamente.');
    

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al solicitar acceso:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'Hubo un error al procesar la solicitud. Por favor, intente nuevamente.');
        }
    }

    public function storeCompany(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'website' => 'required|url',
                'sector' => 'required|string',
                'city' => 'required|string',
                'commercial_activity' => 'required|string',
                'phone' => 'required|string',
                'mobile' => 'required|string',
                'is_exporter' => 'required|boolean',
            ]);
    
            DB::beginTransaction();
            
            $company = Company::create([
                'legal_id' => session('legal_id'),
                ...$validated
            ]);
    
            // Vincular la empresa al usuario actual y establecerlo como admin
            $user = Auth::user();
            $user->company_id = $company->id;
            $user->role = 'admin';
            $user->save();
    
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