<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\CompanyEvaluator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UsersManagementSuperAdminController extends Controller
{
    public function index(Request $request)
    {
        // Determinar si la solicitud viene de la ruta de superadmin o de admin de empresa
        $isSuperAdminRoute = $request->route()->uri == 'api/users';
        
        // Iniciar la consulta base
        $query = User::query()
            ->with(['company', 'evaluatedCompanies'])
            ->orderBy('created_at', 'desc');
            
        // Si es la ruta de superadmin, mostrar todos los usuarios
        if ($isSuperAdminRoute) {
            // No aplicar filtro de company_id para superadmin
        } else {
            // Para admin de empresa, filtrar por la empresa del usuario autenticado
            $companyId = Auth::user()->company_id;
            $query->where('company_id', $companyId)
                  ->where('role', '!=', 'super_admin');
        }

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
        try {
            // Obtener el ID de la empresa del usuario autenticado
            $companyId = Auth::user()->company_id;
            
            // Limpiar espacios al inicio y final
            $request->merge([
                'name' => trim($request->name),
                'lastname' => trim($request->lastname),
                'email' => trim($request->email),
                'puesto' => trim($request->puesto),
                'phone' => trim($request->phone),
            ]);

            $validated = $request->validate([
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
            ], [
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
            ]);

            // Eliminar espacios al final
            $validated['name'] = rtrim($validated['name']);
            $validated['lastname'] = rtrim($validated['lastname']);
            $validated['puesto'] = rtrim($validated['puesto']);
            $validated['phone'] = rtrim($validated['phone']);

            // Generar una contraseña aleatoria
            $password = Str::random(10);

            $user = User::create([
                'name' => $validated['name'],
                'lastname' => $validated['lastname'],
                'email' => $validated['email'],
                'password' => Hash::make($password),
                'role' => 'user', // Por defecto, asignar rol de usuario
                'puesto' => $validated['puesto'],
                'phone' => $validated['phone'],
                'company_id' => $companyId, // Asignar la empresa del usuario autenticado
                'status' => 'approved'
            ]);

            return response()->json([
                'message' => 'Usuario creado exitosamente',
                'user' => $user,
                'password' => $password // Devolver la contraseña generada para que pueda ser comunicada al usuario
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'messages' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(User $user)
    {
        // Obtener el ID de la empresa del usuario autenticado
        $companyId = Auth::user()->company_id;
        
        // Verificar que el usuario a mostrar pertenece a la misma empresa
        if ($user->company_id !== $companyId) {
            return response()->json([
                'message' => 'No tienes permiso para ver este usuario'
            ], 403);
        }
        
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
        try {
            // Obtener el ID de la empresa del usuario autenticado
            $companyId = Auth::user()->company_id;
            
            // Verificar que el usuario a actualizar pertenece a la misma empresa
            if ($user->company_id !== $companyId) {
                return response()->json([
                    'message' => 'No tienes permiso para actualizar este usuario'
                ], 403);
            }
            
            // Limpiar espacios al inicio y final
            $request->merge([
                'name' => trim($request->name),
                'lastname' => trim($request->lastname),
                'email' => trim($request->email),
                'puesto' => trim($request->puesto),
                'phone' => trim($request->phone),
            ]);

            $validated = $request->validate([
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
                'email' => 'required|email|unique:users,email,' . $user->id,
            ], [
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
            ]);

            // Eliminar espacios al final
            $validated['name'] = rtrim($validated['name']);
            $validated['lastname'] = rtrim($validated['lastname']);
            $validated['puesto'] = rtrim($validated['puesto']);
            $validated['phone'] = rtrim($validated['phone']);

            $user->update($validated);

            return response()->json([
                'message' => 'Usuario actualizado exitosamente',
                'user' => $user->load('company')
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'messages' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        // Obtener el ID de la empresa del usuario autenticado
        $companyId = Auth::user()->company_id;
        
        // Verificar que el usuario a eliminar pertenece a la misma empresa
        if ($user->company_id !== $companyId) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar este usuario'
            ], 403);
        }
        
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

    public function getPendingUsers()
    {
        $companyId = Auth::user()->company_id;
        
        $pendingUsers = User::where('company_id', $companyId)
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($pendingUsers);
    }
}