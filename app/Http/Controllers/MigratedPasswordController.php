<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class MigratedPasswordController extends Controller
{
    public function checkMigration(Request $request)
    {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();

        if ($user && $user->from_migration) {
            try {
                // Enviar automáticamente el enlace de restablecimiento de contraseña
                $status = $this->sendResetLinkEmail($email);
                
                // Responder con el resultado
                return response()->json([
                    'from_migration' => true,
                    'status' => $status,
                    'message' => __($status)
                ]);
            } catch (\Exception $e) {
                // Registrar el error en el log
                \Illuminate\Support\Facades\Log::error('Error en el proceso de migración de contraseña:', [
                    'error' => $e->getMessage(),
                    'email' => $email,
                    'trace' => $e->getTraceAsString()
                ]);

                // Devolver una respuesta de error controlada
                return response()->json([
                    'from_migration' => true,
                    'status' => 'error',
                    'message' => 'Ha ocurrido un error al procesar la solicitud. Por favor, inténtelo más tarde.'
                ], 200); // Usamos 200 para mantener la consistencia de la respuesta
            }
        }

        return response()->json(['from_migration' => false]);
    }

    /**
     * Envía un enlace de restablecimiento de contraseña al usuario migrado
     */
    protected function sendResetLinkEmail($email)
    {
        // Verificar que el usuario existe y está marcado como migrado
        $user = User::where('email', $email)->where('from_migration', 1)->first();
        
        if (!$user) {
            return Password::INVALID_USER;
        }

        // Guardar el email en la sesión antes de enviar el enlace
        session(['password_reset_email' => $email]);

        try {
            // Enviar el enlace de restablecimiento utilizando el broker de contraseñas integrado de Laravel
            return Password::sendResetLink(['email' => $email]);
        } catch (\Exception $e) {
            // Registrar el error en el log
            \Illuminate\Support\Facades\Log::error('Error al enviar el correo de restablecimiento de contraseña para usuario migrado:', [
                'error' => $e->getMessage(),
                'email' => $email,
                'trace' => $e->getTraceAsString()
            ]);

            // Devolver un estado de error genérico
            return Password::RESET_THROTTLED;
        }
    }

    /**
     * Marcamos al usuario como migrado cuando cambie su contraseña a través del sistema normal de reset
     */
    public function markUserAsMigrated(Request $request)
    {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();

        $company = Company::where('id', $user->company_id)->first();

        if ($user && $user->from_migration) {
            $user->from_migration = 0;
            $user->save();

            if($company->fecha_inicio_auto_evaluacion == null) {
                $company->fecha_inicio_auto_evaluacion = now();
                $company->save();
            }

            return response()->json(['success' => true]);
        }
        
        return response()->json(['success' => false]);
    }
}
