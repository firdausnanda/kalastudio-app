<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckExternalApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Jika user login TAPI tidak punya token API
        if ($user && !$user->hasRole('admin') && empty($user->external_api_token) && !$request->routeIs('dashboard')) {
            // 2. Putus sesi login lokal Laravel
            Auth::logout();

            // 3. Hapus session dan regenerasi token CSRF untuk keamanan (Best Practice)
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // 4. Baru arahkan ke halaman login
            return redirect()->route('login')
                ->with('error', 'Sesi API Anda tidak valid atau telah berakhir. Silakan login kembali.');
        }

        return $next($request);
    }
}