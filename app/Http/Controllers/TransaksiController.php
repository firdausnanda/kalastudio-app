<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    public function index(Request $request, ApiService $apiService)
    {
        $user = $request->user();
        $phone = $user->UserWhatsapp()->first()->phone_number ?? '';
        
        $transaksi = $apiService
            ->setToken($user->external_api_token)
            ->fetchTransaksi($phone);

        return Inertia::render('Transaksi/Index', [
            'transaksi' => $transaksi,
        ]);
    }
}
