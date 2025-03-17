<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\CompanyEvaluator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UsersManagementSuperAdminController extends Controller
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
        // Limpiar espacios al inicio y final
        $request->merge([
            'name' => trim($request->name),
            'lastname' => trim($request->lastname),
            'email' => trim($request->email),
            'puesto' => trim($request->puesto),
            'phone' => trim($request->phone),
        ]);

        $validationRules = [
            'name' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],
            'lastname' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'puesto' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^[0-9+\-\s]+$/'
            ],
            'role' => 'required|in:user,admin,evaluador',
        ];

        // Agregar validaciones específicas según el rol
        if ($request->input('role') === 'evaluador') {
            $validationRules['assigned_companies'] = 'required|array';
            $validationRules['assigned_companies.*'] = 'exists:companies,id';
            $validationRules['organismo'] = 'required|string|max:100';
        } else {
            $validationRules['company_id'] = 'required|exists:companies,id';
        }

        $validated = $request->validate($validationRules, [
            'email.unique' => 'El correo electrónico ya está en uso por otro usuario.',
            'name.regex' => 'El nombre solo debe contener letras y espacios',
            'name.max' => 'El nombre no debe exceder los 50 caracteres',
            'lastname.regex' => 'Los apellidos solo deben contener letras y espacios',
            'lastname.max' => 'Los apellidos no deben exceder los 50 caracteres',
            'puesto.required' => 'El puesto es requerido',
            'puesto.regex' => 'El puesto solo debe contener letras y espacios',
            'puesto.max' => 'El puesto no debe exceder los 50 caracteres',
            'phone.regex' => 'El teléfono solo debe contener números, +, - y espacios',
            'phone.max' => 'El teléfono no debe exceder los 20 caracteres',
            'organismo.required_if' => 'El organismo es requerido para evaluadores',
            'organismo.max' => 'El organismo no debe exceder los 100 caracteres'
        ]);

        // Eliminar espacios al final
        $validated['name'] = rtrim($validated['name']);
        $validated['lastname'] = rtrim($validated['lastname']);
        $validated['puesto'] = rtrim($validated['puesto']);
        $validated['phone'] = rtrim($validated['phone']);

        // Preparar los datos del usuario
        $userData = [
            'name' => $validated['name'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'puesto' => $validated['puesto'],
            'phone' => $validated['phone'],
            'company_id' => $validated['role'] === 'evaluador' ? 1 : $validated['company_id'],
            'status' => $validated['role'] === 'evaluador' ? 'approved' : ($validated['status'] ?? 'pending'),
        ];

        // Agregar organismo si es evaluador
        if ($validated['role'] === 'evaluador') {
            $userData['organismo'] = $validated['organismo'];
        }

        $user = User::create($userData);

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
        $userData = $user->load('company');
        if ($user->role === 'evaluador') {
            $userData->load('evaluatedCompanies');
        }
        return response()->json([
            'user' => $userData
        ]);
    }

    public function update(Request $request, User $user)
    {
        // Limpiar espacios al inicio y final
        $request->merge([
            'name' => trim($request->name),
            'lastname' => trim($request->lastname),
            'email' => trim($request->email),
            'puesto' => trim($request->puesto),
            'phone' => trim($request->phone),
        ]);

        $validationRules = [
            'name' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],
            'lastname' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],
            'email' => 'required|email|unique:users,email,' . $user->id,
            'puesto' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^[0-9+\-\s]+$/'
            ],
            'role' => 'required|in:user,admin,evaluador',
        ];

        // Modificar las validaciones según el rol
        if ($request->input('role') === 'evaluador') {
            $validationRules['assigned_companies'] = 'required|array';
            $validationRules['assigned_companies.*'] = 'exists:companies,id';
            $validationRules['organismo'] = 'required|string|max:100';
        } else {
            $validationRules['company_id'] = 'required|exists:companies,id';
        }

        // Agregar validación de contraseña solo si se proporciona
        if ($request->filled('password')) {
            $validationRules['password'] = 'min:8';
        }

        $validated = $request->validate($validationRules, [
            'email.unique' => 'El correo electrónico ya está en uso por otro usuario.',
            'name.regex' => 'El nombre solo debe contener letras y espacios',
            'name.max' => 'El nombre no debe exceder los 50 caracteres',
            'lastname.regex' => 'Los apellidos solo deben contener letras y espacios',
            'lastname.max' => 'Los apellidos no deben exceder los 50 caracteres',
            'puesto.required' => 'El puesto es requerido',
            'puesto.regex' => 'El puesto solo debe contener letras y espacios',
            'puesto.max' => 'El puesto no debe exceder los 50 caracteres',
            'phone.regex' => 'El teléfono solo debe contener números, +, - y espacios',
            'phone.max' => 'El teléfono no debe exceder los 20 caracteres',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'organismo.required_if' => 'El organismo es requerido para evaluadores',
            'organismo.max' => 'El organismo no debe exceder los 100 caracteres'
        ]);

        // Eliminar espacios al final
        $validated['name'] = rtrim($validated['name']);
        $validated['lastname'] = rtrim($validated['lastname']);
        $validated['puesto'] = rtrim($validated['puesto']);
        $validated['phone'] = rtrim($validated['phone']);

        // Preparar datos para actualizar
        $userData = $validated;
        
        // Establecer valores por defecto para evaluadores
        if ($validated['role'] === 'evaluador') {
            $userData['company_id'] = 1;
            $userData['status'] = 'approved';
        }

        // Si se proporcionó una nueva contraseña, hashearla
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        if ($validated['role'] === 'evaluador') {
            // Eliminar asignaciones anteriores
            CompanyEvaluator::where('user_id', $user->id)->delete();
            
            // Crear nuevas asignaciones
            if (!empty($validated['assigned_companies'])) {
                foreach ($validated['assigned_companies'] as $companyId) {
                    CompanyEvaluator::create([
                        'user_id' => $user->id,
                        'company_id' => $companyId
                    ]);
                }
            }
        }

        return response()->json($user->load(['company', 'evaluatedCompanies']));
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
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
        $ids = array_diff($request->ids, [Auth::id()]);
        
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

        if ($user->id === Auth::id() && $validated['role'] !== 'super_admin') {
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