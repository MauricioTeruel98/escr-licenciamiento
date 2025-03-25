<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\WelcomeNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\MailService;

class RegisteredUserController extends Controller
{
    protected $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/', 'min:2'],
            'lastname' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/', 'min:2'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class, 'regex:/^[a-zA-Z0-9._@+\-]+$/', 'min:2'],
            'password' => ['required', 'confirmed', Rules\Password::defaults(), 'regex:/^[^\s\'"]+$/'],
            'terms_accepted' => ['required', 'accepted'],
        ], [
            'name.regex' => 'El nombre solo puede contener letras y espacios.',
            'lastname.regex' => 'El apellido solo puede contener letras y espacios.',
            'email.regex' => 'El correo no puede contener espacios ni caracteres especiales excepto guiones, arroba, punto y signo más.',
            'password.regex' => 'La contraseña no puede contener espacios, comillas simples o dobles.',
            'password.min' => 'La contraseña debe tener al menos :min caracteres, una letra mayúscula, una letra minúscula y un número.',
            'password.lowercase' => 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.',
            'password.mixed' => 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.',
            'password.numbers' => 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.',
            'terms_accepted.required' => 'Debe aceptar los términos y condiciones para registrarse.',
            'terms_accepted.accepted' => 'Debe aceptar los términos y condiciones para registrarse.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'terms_accepted' => true,
        ]);

        event(new Registered($user));

        // Enviar notificación de bienvenida usando el nuevo servicio
        try {
            $welcomeNotification = new WelcomeNotification();
            $this->mailService->send($user->email, $welcomeNotification);
        } catch (\Exception $e) {
            Log::error('Error al enviar la notificación de bienvenida: ' . $e->getMessage());
        }

        Auth::login($user);

        return redirect()->route('legal.id');
    }
}
