<?php

namespace App\Http\Controllers;

use App\Models\Packages;
use App\Models\Transaction;
use App\Services\ApiService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class LanggananController extends Controller
{
    public function index(ApiService $apiService)
    {
        $transactions = Transaction::where('user_id', Auth::user()->id)->latest()->get();
        $fetchUser = $apiService->setToken(Auth::user()->external_api_token)->fetchUser(Auth::user()->userWhatsapp()->first()->phone_number);

        if ($fetchUser == null) {
            return redirect()->route('dashboard');
        }

        if ($fetchUser['plan'] == 'professional') {
            $currentPackage = [
                'name' => 'Professional',
                'price' => 100000,
                'features' => [
                    'Custom Dashboard & Branding',
                    'Integrasi API',
                    'Dedicated Account Manager',
                    'Audit Trail Keuangan',
                    'SLA 99.9% Uptime',
                ],
            ];
        } else if ($fetchUser['plan'] == 'trial') {
            $currentPackage = [
                'name' => 'Trial',
                'price' => 0,
                'features' => [
                    '15 Token',
                    'Laporan Laba Rugi Dasar',
                    'Dukungan Whatsapp'
                ],
            ];
        } else {
            $currentPackage = Packages::where('name', 'LIKE', '%' . $fetchUser['plan'] . '%')->first();
        }

        return Inertia::render('Langganan/Index', [
            'transactions' => $transactions,
            'currentPackage' => $currentPackage
        ]);
    }
}
