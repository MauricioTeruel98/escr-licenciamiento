<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'userName' => $user->name,
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'lastname' => $user->lastname,
                    'id_number' => $user->id_number,
                    'phone' => $user->phone,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        \Log::info('Datos validados:', $validated);  // Log para depuración

        // Remover email si no ha cambiado
        if ($request->user()->email === $validated['email']) {
            unset($validated['email']);
        }

        // Verificar la contraseña actual antes de permitir el cambio
        if (isset($validated['password']) && !empty($validated['password'])) {
            if (!isset($validated['current_password']) || 
                !\Hash::check($validated['current_password'], $request->user()->password)) {
                return back()
                    ->withErrors(['current_password' => 'La contraseña actual no es correcta.'])
                    ->withInput();
            }
            
            $validated['password'] = \Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Remover campos que no pertenecen al modelo
        unset($validated['current_password']);
        unset($validated['password_confirmation']);

        \Log::info('Datos a guardar:', $validated);  // Log para depuración

        $request->user()->fill($validated);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')
            ->with('success', isset($validated['password']) 
                ? 'Perfil y contraseña actualizados exitosamente.' 
                : 'Perfil actualizado exitosamente.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
