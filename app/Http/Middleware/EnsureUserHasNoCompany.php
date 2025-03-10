<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasNoCompany
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Si el usuario ya tiene una empresa asignada, redirigir al dashboard
        if ($user && $user->company_id) {
            return redirect()->route('dashboard')
                ->with('info', 'Ya tienes una empresa registrada.');
        }

        return $next($request);
    }
} 