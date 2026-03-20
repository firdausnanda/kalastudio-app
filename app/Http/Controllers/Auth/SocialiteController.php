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
        return Socialite::driver('google')->redirect();
    }


    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Gagal masuk dengan Google.');
        }

        $user = User::updateOrCreate([
            'google_id' => $googleUser->getId(),
        ], [
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'avatar' => $googleUser->getAvatar(),
            'password' => Hash::make(Str::random(24)),
        ]);

        if ($user->roles()->count() === 0) {
            $user->assignRole('user');
        }

        Auth::login($user);

        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
