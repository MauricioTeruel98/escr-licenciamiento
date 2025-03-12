<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\Certification;
use App\Models\Homologation;
use App\Models\Indicator;
use App\Models\Value;
use App\Models\Subcategory;
use App\Models\AvailableCertification;
use App\Models\Requisitos;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('SuperAdmin/Dashboard', [
            'title' => 'Dashboard Super Admin'
        ]);
    }

    public function companies()
    {
        $companies = Company::with(['users' => function ($query) {
            $query->where('role', 'admin');
        }])
            ->withCount('users')
            ->latest()
            ->paginate(10);

        return Inertia::render('SuperAdmin/Companies/Index', [
            'companies' => $companies
        ]);
    }

    public function users()
    {
        $users = User::with('company')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('SuperAdmin/Users/Index', [
            'users' => $users
        ]);
    }

    public function certifications()
    {
        $certifications = Certification::with('company')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('SuperAdmin/Certifications/Index', [
            'certifications' => $certifications
        ]);
    }

    public function settings()
    {
        $settings = [
            'system_email' => config('mail.from.address'),
            'company_types' => config('constants.company_types'),
            // Otros ajustes del sistema
        ];

        return Inertia::render('SuperAdmin/Settings', [
            'settings' => $settings
        ]);
    }

    // Métodos para acciones CRUD

    public function updateCompanyStatus(Request $request, Company $company)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive,suspended'
        ]);

        $company->update($validated);

        return back()->with('success', 'Estado de la empresa actualizado correctamente');
    }

    public function updateUserStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,suspended'
        ]);

        $user->update($validated);

        return back()->with('success', 'Estado del usuario actualizado correctamente');
    }

    public function updateCertification(Request $request, Certification $certification)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $certification->update($validated);

        return back()->with('success', 'Certificación actualizada correctamente');
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'system_email' => 'required|email',
            'company_types' => 'required|array'
        ]);

        // Actualizar configuraciones del sistema
        // Esto dependerá de cómo manejes la configuración en tu aplicación

        return back()->with('success', 'Configuración actualizada correctamente');
    }

    public function exportCompaniesReport()
    {
        // Lógica para exportar reporte de empresas
        $companies = Company::with(['users', 'certifications'])->get();

        // Implementar la lógica de exportación según tus necesidades
        // Podrías usar Laravel Excel u otra biblioteca

        return response()->download('path/to/generated/report');
    }

    public function exportUsersReport()
    {
        // Lógica para exportar reporte de usuarios
        $users = User::with('company')->get();

        // Implementar la lógica de exportación

        return response()->download('path/to/generated/report');
    }

    public function values()
    {
        $values = Value::orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('SuperAdmin/Values/Index', [
            'initialValues' => $values
        ]);
    }

    public function homologations()
    {
        $homologations = AvailableCertification::orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('SuperAdmin/Homologations/Index', [
            'initialHomologations' => $homologations,
            'tipos' => AvailableCertification::TIPOS,
            'categorias' => AvailableCertification::CATEGORIAS
        ]);
    }

    public function indicators()
    {
        $indicators = Indicator::with(['homologation', 'value', 'subcategory'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        // Obtenemos los datos relacionados para el selector inicial
        $relatedData = [
            'values' => Value::where('is_active', true)->get(['id', 'name']),
            'subcategories' => Subcategory::where('is_active', true)->get(['id', 'name']),
            'homologations' => AvailableCertification::where('activo', true)->get(['id', 'nombre'])
        ];
        
        return Inertia::render('SuperAdmin/Indicators/Index', [
            'initialIndicators' => $indicators,
            'initialRelatedData' => $relatedData
        ]);
    }

    public function subcategories()
    {
        $subcategories = Subcategory::with('value')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('SuperAdmin/Subcategories/Index', [
            'initialSubcategories' => $subcategories
        ]);
    }

    public function requisitos()
    {
        $requisitos = Requisitos::with('value')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('SuperAdmin/Requisitos/Index', [
            'initialRequisitos' => $requisitos
        ]);
    }

    public function getDashboardStats()
    {
        $stats = [
            'companies' => Company::count(),
            'users' => User::count(),
            'certifications' => Certification::count()
        ];

        return response()->json($stats);
    }

    /**
     * Muestra la página para importaciones de archivos SQL o CSV.
     */
    public function importaciones()
    {
        $companiesColumns = [
            'legal_id', 'name', 'website', 'sector', 'provincia', 'commercial_activity', 
            'phone', 'mobile', 'is_exporter', 'created_at', 'updated_at', 'status', 
            'authorized', 'autoeval_ended', 'estado_eval', 'canton', 'distrito', 
            'authorized_by_super_admin', 'old_id'
        ];

        $usersColumns = [
            'name', 'lastname', 'id_number', 'phone', 'email', 'email_verified_at', 
            'password', 'role', 'status', 'form_sended', 'terms_accepted', 'puesto', 
            'from_migration', 'old_company_id', 'cedula'
        ];

        $usersRequiredColumns = [
            'name', 'email'
        ];

        $usersOptionalDefaultValues = [
            'password' => 'Se generará automáticamente si no se proporciona',
            'role' => 'user (valores permitidos: user, admin, super_admin, evaluador)',
            'status' => 'pending (valores permitidos: pending, approved, rejected)',
            'terms_accepted' => '0',
            'from_migration' => '1'
        ];

        return Inertia::render('SuperAdmin/Importaciones/Index', [
            'title' => 'Importación de Archivos',
            'companiesColumns' => $companiesColumns,
            'usersColumns' => $usersColumns,
            'usersRequiredColumns' => $usersRequiredColumns,
            'usersOptionalDefaultValues' => $usersOptionalDefaultValues
        ]);
    }
} 