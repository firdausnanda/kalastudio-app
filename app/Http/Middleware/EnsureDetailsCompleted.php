<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureDetailsCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Jika user login TAPI detail bisnis atau whatsapp belum lengkap
        if ($user && ($user->business()->doesntExist() || $user->UserWhatsapp()->doesntExist())) {
            // Kecuali jika sedang di halaman lengkapi-profil atau logout
            if (!$request->is('lengkapi-profil*') && !$request->routeIs('logout')) {
                return redirect()->route('lengkapi-profil');
            }
        }

        return $next($request);
    }
}
