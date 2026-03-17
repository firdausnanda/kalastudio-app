<?php

namespace App\Http\Controllers;

use App\Models\Packages;
use App\Models\Transaction;
use App\Services\ApiService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BoosterController extends Controller
{
    /**
     * Display the booster selection page.
     */
    public function index(ApiService $apiService)
    {
        $boosters = Packages::with([
            'prices' => function ($query) {
                $query->where('billing_cycle', 'one_time');
            }
        ])
            ->where('type', 'booster')
            ->where('is_active', true)
            ->get();

        // Fetch current user data for context (like current token balance)
        $user = Auth::user();
        $userData = null;

        try {
            $userData = $apiService->setToken($user->external_api_token)
                ->fetchUser($user->userWhatsapp()->first()->phone_number);
        } catch (\Exception $e) {
            // Error fetching external data, but we can still show the page
        }

        return Inertia::render('Langganan/Booster', [
            'boosters' => $boosters,
            'userData' => $userData,
        ]);
    }
}
