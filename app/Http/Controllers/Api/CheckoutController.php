<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PackagesPrices;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Xendit\Configuration;
use Xendit\Api\InvoiceApi;
use Xendit\Model\CreateInvoiceRequest;
use Illuminate\Support\Str;
class CheckoutController extends Controller
{
    public function __construct()
    {
        // Inisialisasi API Key Xendit
        Configuration::setXenditKey(env('XENDIT_SECRET_KEY'));
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
        $amount = $packagePrice->price;

        // 2. Siapkan request ke Xendit (Menggunakan SDK v3 terbaru)
        $apiInstance = new \Xendit\Invoice\InvoiceApi();
        $createInvoiceRequest = new \Xendit\Invoice\CreateInvoiceRequest([
            'external_id' => $referenceId,
            'amount' => $amount,
            'payer_email' => $user->email,
            'description' => 'Pembelian ' . $packagePrice->package->name,
            'success_redirect_url' => 'http://localhost:3000/payment-success',
            'failure_redirect_url' => 'http://localhost:3000/payment-failed',
        ]);

        try {
            // 3. Tembak API Xendit
            $result = $apiInstance->createInvoice($createInvoiceRequest);

            // 4. Simpan ke database
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'package_price_id' => $packagePrice->id,
                'reference_id' => $referenceId,
                'subtotal' => $amount,
                'grand_total' => $amount,
                'status' => 'PENDING',
                'checkout_url' => $result['invoice_url']
            ]);

            // 5. Kembalikan Response JSON ke React
            return response()->json([
                'status' => 'success',
                'message' => 'Invoice berhasil dibuat',
                'data' => [
                    'checkout_url' => $result['invoice_url']
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat invoice',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
