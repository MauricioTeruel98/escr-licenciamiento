<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Company;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Validaciones adicionales
        $request->validate([
            'email' => ['required', 'string', 'email', 'regex:/^[a-zA-Z0-9._@+\-]+$/'],
            'password' => ['required', 'string', 'regex:/^[^\s\'"]+$/'],
        ], [
            'email.regex' => 'El correo no puede contener espacios ni caracteres especiales excepto guiones, arroba, punto y signo más.',
            'password.regex' => 'La contraseña no puede contener espacios, comillas simples o dobles.',
        ]);

        $request->authenticate();
        $request->session()->regenerate();
        $user = auth()->user();
        $company = Company::find($user->company_id);

        if($user->company_id && $user->role !== 'evaluador'){
            if($company->fecha_inicio_auto_evaluacion === null){
                $company->fecha_inicio_auto_evaluacion = $company->created_at;
                $company->save();
            }
        }


        // Si el usuario es super_admin y está intentando acceder a escr-admin
        if ($user->role === 'super_admin' && str_contains($request->path(), 'escr-admin')) {
            return redirect()->intended('/escr-admin');
        }

        // Si el usuario no tiene compañía asignada
        if (!$user->company_id) {
            return redirect()->route('legal.id');
        }

        // Si el usuario está pendiente de aprobación
        if ($user->status === 'pending') {
            return redirect()->route('approval.pending');
        }

        // Si el usuario fue rechazado
        if ($user->status === 'rejected') {
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'Su solicitud de acceso ha sido rechazada.');
        }

        // Solo permitir acceso si está aprobado o es admin
        if ($user->status !== 'approved' && !$user->isAdmin()) {
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'No tiene acceso a la plataforma.');
        }

        // Redirección específica para super_admin
        if ($user->role === 'super_admin') {
            return redirect()->route('super.dashboard');
        }

        // Redirección específica para evaluador
        if ($user->role === 'evaluador') {
            return redirect()->route('evaluador.dashboard');
        }

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
