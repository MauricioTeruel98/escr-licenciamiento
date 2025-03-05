<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsEvaluador
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || $request->user()->role !== 'evaluador') {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'No autorizado'], 403);
            }
            
            return redirect()->route('evaluador.dashboard')
                ->with('error', 'No tienes permisos para acceder al panel de evaluador.');
        }

        return $next($request);
    }
} 