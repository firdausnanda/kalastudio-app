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

    public function create(Request $request, ApiService $apiService)
    {
        $user = $request->user();
        $phone = $user->UserWhatsapp()->first()->phone_number ?? '';

        $transaksi = $apiService
            ->setToken($user->external_api_token)
            ->fetchTransaksi($phone);

        return Inertia::render('Transaksi/Create', [
            'transaksi' => $transaksi,
        ]);
    }

    public function store(Request $request, ApiService $apiService)
    {
        $user = $request->user();
        $phone = $user->UserWhatsapp()->first()->phone_number ?? '';

        $request->validate([
            'nominal' => 'required',
            'tipe' => 'required|in:in,out',
            'deskripsi' => 'nullable|string',
            'transaksi_at' => 'required|date',
        ]);

        $apiService
            ->setToken($user->external_api_token)
            ->storeTransaksi($phone, [
                'nominal' => (int) str_replace('.', '', $request->nominal),
                'tipe' => $request->tipe === 'out' ? 'pengeluaran' : 'pemasukan',
                'deskripsi' => $request->deskripsi,
                'transaksi_at' => $request->transaksi_at,
            ]);

        return redirect()->route('transaksi.index')->with('success', 'Transaksi berhasil disimpan!');
    }
}
