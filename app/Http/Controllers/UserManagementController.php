<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\CompanyEvaluator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->with(['company', 'evaluatedCompanies'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role') && $request->input('role') !== 'todos') {
            $query->where('role', $request->input('role'));
        }

        $users = $query->paginate($request->input('per_page', 10));

        // Transformar los datos para incluir las empresas evaluadas
        $users->getCollection()->transform(function ($user) {
            if ($user->role === 'evaluador') {
                $user->evaluated_companies = $user->evaluatedCompanies;
            }
            return $user;
        });

        return $users;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required|in:user,admin,evaluador',
            'company_id' => 'required|exists:companies,id',
            'assigned_companies' => 'required_if:role,evaluador|array',
            'assigned_companies.*' => 'exists:companies,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'company_id' => $validated['company_id'],
            'status' => 'approved'
        ]);

        if ($validated['role'] === 'evaluador' && isset($validated['assigned_companies'])) {
            foreach ($validated['assigned_companies'] as $companyId) {
                CompanyEvaluator::create([
                    'user_id' => $user->id,
                    'company_id' => $companyId
                ]);
            }
        }

        return response()->json($user);
    }

    public function show(User $user)
    {
        return response()->json([
            'user' => $user->load('company')
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:user,admin,evaluador',
            'company_id' => 'required|exists:companies,id',
            'assigned_companies' => 'required_if:role,evaluador|array',
            'assigned_companies.*' => 'exists:companies,id'
        ]);

        $user->update($validated);

        if ($validated['role'] === 'evaluador') {
            // Eliminar asignaciones anteriores
            CompanyEvaluator::where('user_id', $user->id)->delete();
            
            // Crear nuevas asignaciones
            foreach ($validated['assigned_companies'] as $companyId) {
                CompanyEvaluator::create([
                    'user_id' => $user->id,
                    'company_id' => $companyId
                ]);
            }
        }

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'No puedes eliminar tu propio usuario'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id'
        ]);

        // Evitar eliminar al usuario actual
        $ids = array_diff($request->ids, [auth()->id()]);
        
        $count = User::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => "{$count} usuarios eliminados exitosamente"
        ]);
    }

    public function getActiveCompanies()
    {
        $companies = Company::where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json($companies);
    }

    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Estado del usuario actualizado exitosamente',
            'user' => $user->load('company')
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:super_admin,admin,user'
        ]);

        if ($user->id === auth()->id() && $validated['role'] !== 'super_admin') {
            return response()->json([
                'message' => 'No puedes cambiar tu propio rol de super admin'
            ], 403);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Rol del usuario actualizado exitosamente',
            'user' => $user->load('company')
        ]);
    }
}