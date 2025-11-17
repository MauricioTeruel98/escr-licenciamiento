<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdminOrSuperAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || (!$request->user()->isAdmin() && $request->user()->role !== 'super_admin')) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'No autorizado'], 403);
            }
            
            return redirect()->route('dashboard')
                ->with('error', 'No tienes permisos para realizar esta acción.');
        }

        return $next($request);
    }
} 