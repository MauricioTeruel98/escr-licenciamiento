<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class EnsureApplicationSended
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        if (!$user || !$user->company_id) {
            return redirect()->route('dashboard')->with('error', 'No tienes una empresa asociada.');
        }

        // Verificar si application_sended = 1 en auto_evaluation_result
        $applicationSended = DB::table('auto_evaluation_result')
            ->where('company_id', $user->company_id)
            ->value('application_sended');

        if ($applicationSended != 1) {
            return redirect()->route('dashboard')
                ->with('error', 'Debes completar y enviar la auto-evaluación antes de acceder a esta página.');
        }

        if(($user->role == 'admin' || $user->role == 'user') && $user->company->estado_eval == 'evaluado') {
            return redirect()->route('dashboard')
                ->with('error', 'Ya completaste el proceso, no puedes enviar de nuevo la información de la empresa.');
        }

        return $next($request);
    }
}
