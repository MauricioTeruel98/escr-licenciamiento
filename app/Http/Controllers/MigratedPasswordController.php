<?php

namespace App\Http\Controllers;

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
            // Enviar automáticamente el enlace de restablecimiento de contraseña
            $status = $this->sendResetLinkEmail($email);
            
            // Responder con el resultado
            return response()->json([
                'from_migration' => true,
                'status' => $status,
                'message' => __($status)
            ]);
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

        // Enviar el enlace de restablecimiento utilizando el broker de contraseñas integrado de Laravel
        return Password::sendResetLink(['email' => $email]);
    }

    /**
     * Marcamos al usuario como migrado cuando cambie su contraseña a través del sistema normal de reset
     */
    public function markUserAsMigrated(Request $request)
    {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();
        
        if ($user && $user->from_migration) {
            $user->from_migration = 0;
            $user->save();
            return response()->json(['success' => true]);
        }
        
        return response()->json(['success' => false]);
    }
}
