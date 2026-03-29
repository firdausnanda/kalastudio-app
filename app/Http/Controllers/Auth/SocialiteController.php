<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function redirectToGoogle(Request $request): RedirectResponse
    {
        if ($request->has('redirect')) {
            session(['url.intended' => $request->get('redirect')]);
        }
        return Socialite::driver('google')->stateless()->redirect();
    }


    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Gagal masuk dengan Google.');
        }

        // Cari user berdasarkan google_id terlebih dahulu
        $user = User::where('google_id', $googleUser->getId())->first();

        if (!$user) {
            // Jika tidak ada, cari berdasarkan email (untuk menyatukan akun yang sudah ada sebelumnya)
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // Link akun Google ke user yang sudah ada
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            } else {
                // Buat user baru jika benar-benar tidak ada
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => Hash::make(Str::random(24)),
                ]);
            }
        } else {
            // Update info terupdate dari Google (kecuali password)
            $user->update([
                'name' => $googleUser->getName(),
                'avatar' => $googleUser->getAvatar(),
            ]);
        }

        if ($user->roles()->count() === 0) {
            $user->assignRole('user');
        }

        Auth::login($user);

        // Jika admin, arahkan ke dashboard admin
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        // Default arahkan ke dashboard utama atau URL yang dituju sebelumnya
        return redirect()->intended(route('dashboard', absolute: false));
    }
}
