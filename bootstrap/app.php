<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Configurar para que use nuestras vistas personalizadas para los errores HTTP
        $exceptions->dontReport(\Inertia\Ssr\SsrException::class);
        
        // Manejar error 404 - Página no encontrada
        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e) {
            if (request()->is('api/*') || request()->wantsJson()) {
                return response()->json(['message' => 'Recurso no encontrado'], 404);
            }
            return response()->view('errors.404', [], 404);
        });
        
        // Manejar error 403 - Acceso prohibido
        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e) {
            if (request()->is('api/*') || request()->wantsJson()) {
                return response()->json(['message' => 'Acceso prohibido'], 403);
            }
            return response()->view('errors.403', [], 403);
        });
        
        // Manejar error 500 - Error del servidor
        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            if ($e->getStatusCode() === 500) {
                if (request()->is('api/*') || request()->wantsJson()) {
                    return response()->json(['message' => 'Error interno del servidor'], 500);
                }
                return response()->view('errors.500', [], 500);
            }
            return null;
        });
        
        // Manejar error 419 - Página expirada (CSRF token expirado)
        $exceptions->renderable(function (\Illuminate\Session\TokenMismatchException $e) {
            if (request()->is('api/*') || request()->wantsJson()) {
                return response()->json(['message' => 'Token de sesión expirado'], 419);
            }
            return response()->view('errors.419', [], 419);
        });
        
        // Manejar cualquier otro error HTTP con un fallback genérico
        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            if (request()->is('api/*') || request()->wantsJson()) {
                return response()->json(['message' => $e->getMessage()], $e->getStatusCode());
            }
            return response()->view('errors.fallback', ['exception' => $e], $e->getStatusCode());
        });
    })->create();
