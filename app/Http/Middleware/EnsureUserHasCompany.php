<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasCompany
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user->company_id) {
            return redirect()->route('legal.id');
        }

        // Si el usuario está aprobado y trata de acceder a la página de aprobación pendiente
        if ($user->status === 'approved' && $request->routeIs('approval.pending')) {
            return redirect()->route('dashboard');
        }

        // Si el usuario está pendiente y no está en la página de aprobación pendiente
        if ($user->status === 'pending' && !$request->routeIs('approval.pending')) {
            return redirect()->route('approval.pending');
        }

        // Verificar si el usuario fue rechazado
        if ($user->status === 'rejected') {
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'Su solicitud de acceso ha sido rechazada.');
        }

        // Solo permitir acceso si está aprobado
        if ($user->status !== 'approved' && !$user->isAdmin()) {
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'No tiene acceso a la plataforma.');
        }

        return $next($request);
    }
} 