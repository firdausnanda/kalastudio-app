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
        $transactions = Transaction::with(['packagePrice.package'])
            ->where('user_id', Auth::user()->id)
            ->latest()
            ->get();
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

    public function invoice(Transaction $transaction)
    {
        // 1. Authorization
        if ($transaction->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to invoice.');
        }

        // 2. Only allowed for PAID or SETTLED status
        $status = strtoupper($transaction->status);
        if ($status !== 'PAID' && $status !== 'SETTLED') {
             return redirect()->route('langganan.index')->with('error', 'Invoice hanya tersedia untuk transaksi yang sudah lunas.');
        }

        // 3. Load relations
        $transaction->load(['packagePrice.package', 'user']);

        return Inertia::render('Langganan/Invoice', [
            'transaction' => $transaction,
        ]);
    }
}
