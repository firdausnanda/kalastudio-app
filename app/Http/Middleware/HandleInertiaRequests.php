<?php

namespace App\Http\Middleware;

use App\Services\ApiService;
use Cache;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $phone = $user ? ($user->UserWhatsapp()->first()->phone_number ?? '') : '';
        $userDataExternal = null;

        if ($user && $phone && $user->external_api_token) {
            $userDataExternal = Cache::remember("external_user_{$phone}", now()->addMinutes(60), function () use ($phone, $user) {
                return app(ApiService::class)->setToken($user->external_api_token)->fetchUser($phone);
            });
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'userDataExternal' => $userDataExternal,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
