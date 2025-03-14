<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     *
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function create(Request $request)
    {
        $token = $request->route('token');
        
        // Primero intenta obtener el email de la sesión, si no está disponible, usa el del request
        $email = session('password_reset_email', $request->email);
        
        // Si no hay un email en la sesión ni en el request, redirigir a la página de solicitud de restablecimiento
        if (!$email) {
            return redirect()->route('password.request')
                ->with('error', 'Por razones de seguridad, debe iniciar el proceso de restablecimiento de contraseña desde el principio.');
        }
        
        // Verificar si el token existe y no ha expirado
        $tokenRecord = DB::table(config('auth.passwords.users.table'))
            ->where('email', $email)
            ->first();
            
        $tokenExpired = false;
        
        // Si no se encuentra el token o ha expirado
        if (!$tokenRecord || (now()->subMinutes(config('auth.passwords.users.expire'))->isAfter($tokenRecord->created_at))) {
            $tokenExpired = true;
        }
        
        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
            'token' => $token,
            'tokenExpired' => $tokenExpired,
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'password.confirmed' => 'La confirmación de la contraseña no coincide.',
            'password.min' => 'La contraseña debe tener al menos :min caracteres.',
            'password.mixed' => 'La contraseña debe contener al menos una letra mayúscula.',
            'password.numbers' => 'La contraseña debe contener al menos un número.',
        ]);

        // Obtener el email de la sesión para mayor seguridad
        $email = session('password_reset_email');
        
        // Si no hay un email en la sesión, devolver un error
        if (!$email) {
            throw ValidationException::withMessages([
                'email' => ['Por razones de seguridad, debe iniciar el proceso de restablecimiento de contraseña desde el principio.'],
            ]);
        }

        // Verificar si el token existe y no ha expirado
        $tokenRecord = DB::table(config('auth.passwords.users.table'))
            ->where('email', $email)
            ->first();
            
        // Si no se encuentra el token o ha expirado
        if (!$tokenRecord || (now()->subMinutes(config('auth.passwords.users.expire'))->isAfter($tokenRecord->created_at))) {
            throw ValidationException::withMessages([
                'email' => ['El enlace para restablecer la contraseña ha expirado o no es válido.'],
            ]);
        }

        // Reemplazar el email del request con el de la sesión para mayor seguridad
        $resetData = [
            'email' => $email,
            'password' => $request->password,
            'password_confirmation' => $request->password_confirmation,
            'token' => $request->token,
        ];

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $resetData,
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
                
                // Limpiar la sesión después de un restablecimiento exitoso
                session()->forget('password_reset_email');
                
                // Marcar al usuario como migrado si corresponde
                if ($user->from_migration) {
                    $user->from_migration = 0;
                    $user->save();
                }
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        if ($status == Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
