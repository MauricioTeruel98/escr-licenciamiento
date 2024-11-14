<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasCompany
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()->company_id) {
            return redirect()->route('legal.id');
        }

        return $next($request);
    }
} 