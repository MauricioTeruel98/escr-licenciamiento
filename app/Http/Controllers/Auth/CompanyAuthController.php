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
                // Si la empresa existe, asociamos el usuario actual a ella
                $user = Auth::user();
                $user->company_id = $company->id;
                $user->save();

                DB::commit();
                return redirect()->route('dashboard')->with('success', 'Has sido asociado a la empresa exitosamente.');
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

            Log::info('Datos validados:', $validated);
            
            DB::beginTransaction();
            
            $company = Company::create([
                'legal_id' => session('legal_id'),
                ...$validated
            ]);

            Log::info('Empresa creada:', ['company' => $company]);

            // Vincular la empresa al usuario actual
            $user = Auth::user();
            $user->company_id = $company->id;
            $user->save();

            Log::info('Usuario actualizado:', ['user' => $user]);

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