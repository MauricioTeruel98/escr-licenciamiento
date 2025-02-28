<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCompanyIsAuthorized
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Si el usuario es evaluador o tiene otro rol con empresa asignada
        if ($user->company_id) {
            $company = $user->company;
            
            // Si la empresa no está autorizada
            if (!$company || !$company->authorized) {
                if ($request->wantsJson()) {
                    return response()->json(['message' => 'No autorizado. La empresa debe estar autorizada para acceder.'], 403);
                }
                
                // Si es evaluador, redirigir al dashboard con mensaje
                if ($user->role === 'evaluador') {
                    return redirect()->route('evaluador.dashboard')->with('error', 'No autorizado. La empresa debe estar autorizada para realizar evaluaciones.');
                }
                
                // Para otros roles
                return redirect()->route('dashboard')->with('error', 'No autorizado. La empresa debe estar autorizada para acceder.');
            }
        }

        return $next($request);
    }
} 