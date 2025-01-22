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
        
        // Si el usuario no tiene empresa o la empresa no está autorizada
        if (!$user->company || !$user->company->authorized) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'No autorizado. La empresa debe estar autorizada para acceder.'], 403);
            }
            return redirect()->route('dashboard')->with('error', 'No autorizado. La empresa debe estar autorizada para acceder.');
        }

        return $next($request);
    }
} 