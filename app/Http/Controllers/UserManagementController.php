<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('company')
            ->when(request('search'), function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('lastname', 'like', "%{$search}%")
                      ->orWhereHas('company', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when(request('role'), function($query, $role) {
                $query->where('role', $role);
            })
            ->when(request('status'), function($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy(request('sort_by', 'created_at'), request('sort_order', 'desc'))
            ->paginate(request('per_page', 10));

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:super_admin,admin,user,evaluador',
            'company_id' => 'required|exists:companies,id',
            'status' => 'required|in:pending,approved,rejected',
            'password' => ['required', 'confirmed', Password::defaults()],
            'id_number' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        
        $user = User::create($validated);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user->load('company')
        ], 201);
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
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:super_admin,admin,user',
            'company_id' => 'required|exists:companies,id',
            'status' => 'required|in:pending,approved,rejected',
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'id_number' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => $user->load('company')
        ]);
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