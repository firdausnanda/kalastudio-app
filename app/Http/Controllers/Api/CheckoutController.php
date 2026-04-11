<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PackagesPrices;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function __construct()
    {
        // Inisialisasi Midtrans
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
    }

    public function createInvoice(Request $request)
    {
        // 1. Validasi request dari React
        $request->validate([
            'package_price_id' => 'required|exists:package_prices,id',
        ]);

        $user = auth()->user();
        $packagePrice = PackagesPrices::with('package')->find($request->package_price_id);

        $referenceId = 'TRX-' . strtoupper(Str::random(10));
        $amount = (int) $packagePrice->price;

        // 2. Siapkan request ke Midtrans
        $params = [
            'transaction_details' => [
                'order_id' => $referenceId,
                'gross_amount' => $amount,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
            ],
            'item_details' => [
                [
                    'id' => $packagePrice->package->id,
                    'price' => $amount,
                    'quantity' => 1,
                    'name' => 'Pembelian ' . $packagePrice->package->name,
                ]
            ],
        ];

        try {
            // 3. Tembak API Midtrans
            $snapToken = Snap::getSnapToken($params);

            // 4. Simpan ke database (Create or Reuse)
            $transaction = Transaction::where('user_id', $user->id)
                ->where('package_price_id', $packagePrice->id)
                ->where('status', 'PENDING')
                ->first();

            if ($transaction) {
                $transaction->update([
                    'reference_id' => $referenceId,
                    'subtotal' => $amount,
                    'grand_total' => $amount,
                    'checkout_url' => $snapToken
                ]);
            } else {
                $transaction = Transaction::create([
                    'user_id' => $user->id,
                    'package_price_id' => $packagePrice->id,
                    'reference_id' => $referenceId,
                    'subtotal' => $amount,
                    'grand_total' => $amount,
                    'status' => 'PENDING',
                    'checkout_url' => $snapToken // Reusing field for snap token
                ]);
            }

            // 5. Kembalikan Response JSON ke React
            return response()->json([
                'status' => 'success',
                'message' => 'Token pembayaran berhasil dibuat',
                'data' => [
                    'snap_token' => $snapToken
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat token pembayaran',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
