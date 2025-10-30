<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Middleware to enforce that users with role 'desarrollador' have restricted permissions:
 * - Cannot perform DELETE requests anywhere
 * - Cannot access the /api/users endpoints except via GET
 */
class RestrictDeveloperActions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $role = $user->role ?? null;

        // If the user is a developer we restrict certain actions
        if ($role === 'desarrollador') {
            // Developers may not delete resources
            if (strtoupper($request->method()) === 'DELETE') {
                return response()->json(['message' => 'Acción no permitida: desarrollador no puede eliminar recursos.'], 403);
            }

            // Developers may only access the users API via GET (list/view)
            $path = ltrim($request->path(), '/'); // e.g. api/users or api/users/1
            if (preg_match('#^api/users($|/)#', $path)) {
                if (strtoupper($request->method()) !== 'GET') {
                    return response()->json(['message' => 'Acción no permitida: desarrollador sólo puede consultar usuarios (GET).'], 403);
                }
            }
        }

        return $next($request);
    }
}
