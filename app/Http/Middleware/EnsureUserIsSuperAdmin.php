<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsSuperAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || $request->user()->role !== 'super_admin') {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'No autorizado'], 403);
            }
            
            return redirect()->route('login')
                ->with('error', 'No tienes permisos para acceder al panel de administración.');
        }

        return $next($request);
    }
} 