<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->check()) {
            Log::error('Usuario no autenticado intentando acceder a UserController@index');
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $users = User::where('company_id', auth()->user()->company_id)
                        ->where('role', 'user')
                        ->paginate(3);

            Log::info('Users retrieved:', ['count' => $users->count()]);
            
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error in UserController@index: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener usuarios'], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombreCompleto' => 'required|string',
            'correo' => 'required|email|unique:users,email',
            'puesto' => 'required|string',
            'telefono' => 'required|string',
        ]);

        // Separar nombre y apellido
        $nombreCompleto = explode(' ', $request->nombreCompleto);
        $name = $nombreCompleto[0];
        $lastname = count($nombreCompleto) > 1 ? implode(' ', array_slice($nombreCompleto, 1)) : '';

        // Generar contraseña aleatoria
        $password = Str::random(10);

        try {
            $user = User::create([
                'name' => $name,
                'lastname' => $lastname,
                'email' => $request->correo,
                'phone' => $request->telefono,
                'position' => $request->puesto,
                'password' => Hash::make($password),
                'role' => 'user',
                'status' => 'approved',
                'company_id' => auth()->user()->company_id,
            ]);

            return response()->json([
                'message' => 'Usuario creado exitosamente',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating user: ' . $e->getMessage());
            return response()->json(['error' => 'Error al crear usuario'], 500);
        }
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'nombreCompleto' => 'required|string',
            'correo' => 'required|email|unique:users,email,' . $user->id,
            'puesto' => 'required|string',
            'telefono' => 'required|string',
        ]);

        $nombreCompleto = explode(' ', $request->nombreCompleto);
        $name = $nombreCompleto[0];
        $lastname = count($nombreCompleto) > 1 ? implode(' ', array_slice($nombreCompleto, 1)) : '';

        try {
            $user->update([
                'name' => $name,
                'lastname' => $lastname,
                'email' => $request->correo,
                'phone' => $request->telefono,
                'position' => $request->puesto,
            ]);

            return response()->json([
                'message' => 'Usuario actualizado exitosamente',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar usuario'], 500);
        }
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado exitosamente']);
    }
} 