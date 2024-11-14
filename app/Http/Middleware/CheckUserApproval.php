<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserApproval
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->isPending()) {
            return redirect()->route('approval.pending');
        }

        if ($request->user() && !$request->user()->isApproved() && !$request->user()->isPending()) {
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'Su acceso ha sido denegado.');
        }

        return $next($request);
    }
}