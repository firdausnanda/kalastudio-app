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
            $userDataExternal = Cache::remember("external_user_{$phone}", now()->addMinutes(2), function () use ($phone, $user) {
                return app(ApiService::class)->setToken($user->external_api_token)->fetchUser($phone);
            });
        }

        $pendingTransaction = null;
        if ($user) {
            $pendingTransaction = \App\Models\Transaction::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'PENDING'])
                ->with(['packagePrice.package'])
                ->latest()
                ->first();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? $user->load('roles') : null,
                'is_impersonating' => $user ? $user->isImpersonated() : false,
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'userDataExternal' => $userDataExternal,
            'pendingTransaction' => $pendingTransaction,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
        ];
    }
}
