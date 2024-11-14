<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'No tienes permisos para realizar esta acción.');
        }

        return $next($request);
    }
}