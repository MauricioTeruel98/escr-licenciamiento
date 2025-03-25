<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'regex:/^[a-zA-Z0-9._@-]+$/'],
        ], [
            'email.regex' => 'El correo no puede contener espacios ni caracteres especiales excepto guiones, arroba y punto.'
        ]);

        // Guardar el email en la sesión para usarlo en el proceso de restablecimiento
        $request->session()->put('password_reset_email', $request->email);

        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status == Password::RESET_LINK_SENT) {
                return back()->with('status', 'Hemos enviado por correo electrónico el enlace para restablecer tu contraseña.');
            }
        } catch (\Exception $e) {
            // Registrar el error en el log
            \Illuminate\Support\Facades\Log::error('Error al enviar el correo de restablecimiento de contraseña:', [
                'error' => $e->getMessage(),
                'email' => $request->email,
                'trace' => $e->getTraceAsString()
            ]);

            // Continuar la ejecución y mostrar un mensaje genérico al usuario
            return back()->withInput($request->only('email'))
                ->with('status', 'Se ha producido un error al enviar el correo. Por favor, inténtelo de nuevo más tarde.');
        }

        return back()->withInput($request->only('email'))
            ->withErrors(['email' => 'Credenciales inválidas']);
    }
}
