<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\MailService;
use Illuminate\Support\Facades\Log;

class PasswordResetLinkController extends Controller
{
    protected $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

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
            // Usar el broker de contraseñas pero con nuestro servicio de correo
            $status = Password::broker()->sendResetLink(
                $request->only('email'),
                function($user, $token) {
                    $notification = new \App\Notifications\CustomResetPasswordNotification($token);
                    $this->mailService->handlePasswordReset($user->email, $notification);
                }
            );

            if ($status == Password::RESET_LINK_SENT) {
                return back()->with('status', 'Hemos enviado por correo electrónico el enlace para restablecer tu contraseña.');
            }

            return back()->withInput($request->only('email'))
                ->withErrors(['email' => __($status)]);
        } catch (\Exception $e) {
            Log::error('Error al enviar el correo de restablecimiento de contraseña:', [
                'error' => $e->getMessage(),
                'email' => $request->email,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withInput($request->only('email'))
                ->with('status', 'Se ha producido un error al enviar el correo. Por favor, inténtelo de nuevo más tarde.');
        }
    }
}
