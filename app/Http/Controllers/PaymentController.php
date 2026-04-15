<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use App\Models\Packages;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Auth\Events\Registered;
use App\Models\Transaction;
use App\Models\PackagesPrices;
use App\Services\ApiService;
use Log;
use Midtrans\Config;
use Midtrans\CoreApi;
use Midtrans\Notification;



class PaymentController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function checkout(Request $request)
    {
        $planName = $request->query('plan', 'Starter');
        $billingCycle = $request->query('billing', 'monthly');

        // Prevent checkout if user has pending transaction
        $pendingTransaction = Transaction::where('user_id', Auth::id())
            ->where('status', 'PENDING')
            ->first();

        if ($pendingTransaction) {
            return redirect()->route('langganan.index')->with('warning', 'Anda masih memiliki transaksi yang belum diselesaikan. Silakan selesaikan atau batalkan terlebih dahulu sebelum memesan paket baru.');
        }

        $package = Packages::with([
            'prices' => function ($query) {
                $query->whereIn('billing_cycle', ['monthly', 'annually', 'one_time']);
            }
        ])->where('name', $planName)->first();


        // Fallback or error if package doesn't exist
        if (!$package && $planName !== 'Professional') {
            return redirect()->route('landing')->with('error', 'Paket tidak ditemukan.');
        }

        return Inertia::render('Payment/Checkout', [
            'planName' => $planName,
            'billingCycle' => $billingCycle,
            'package' => $package,
        ]);
    }

    /**
     * Display the pending payment detail page.
     */
    public function pendingDetail(Transaction $transaction)
    {
        // Ensure the transaction belongs to the current user
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        // Only allow PENDING transactions
        if ($transaction->status !== 'PENDING') {
            return redirect()->route('dashboard')->with('error', 'Transaksi ini sudah tidak dalam status pending.');
        }

        $transaction->load(['packagePrice.package']);

        return Inertia::render('Payment/PendingDetail', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Create Midtrans Snap Token.
     */
    public function createInvoice(Request $request)
    {
        $validationRules = [
            'plan_name' => 'required|string',
            'amount' => 'required|numeric',
            'email' => 'required|email',
            'payment_method' => 'required|in:bank_transfer,qris,gopay',
            'bank' => 'required_if:payment_method,bank_transfer|in:bni,bsi,bri,mandiri',
        ];

        // If user is not logged in, require registration fields
        if (!Auth::check()) {
            $validationRules = array_merge($validationRules, [
                'name' => 'required|string|max:255',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);
        }

        $request->validate($validationRules);

        // Register user if not logged in
        if (!Auth::check()) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            event(new Registered($user));

            Auth::login($user);
        }

        // Find Package Price
        $package = Packages::where('name', $request->plan_name)->first();
        $packagePrice = null;
        if ($package) {
            $cycle = $request->billing_cycle;
            if ($cycle === 'annual')
                $cycle = 'annually';
            $packagePrice = $package->prices()->where('billing_cycle', $cycle)->first();
        }

        // Check for ANY pending transaction first
        $anyPending = Transaction::where('user_id', Auth::id())
            ->where('status', 'PENDING')
            ->first();

        if ($anyPending && (!$packagePrice || $anyPending->package_price_id !== $packagePrice->id)) {
            return response()->json(['error' => 'Selesaikan atau batalkan transaksi sebelumnya terlebih dahulu sebelum memesan paket baru.'], 422);
        }

        // Create or Reuse Transaction Record
        $transaction = $anyPending; // Fallback to reuse if it's the SAME package price or if we didn't find specific ones above
        
        if (!$transaction) {
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'package_price_id' => $packagePrice ? $packagePrice->id : null,
                'subtotal' => $request->amount,
                'grand_total' => $request->amount,
                'status' => 'PENDING',
            ]);
        } else {
            $transaction->update([
                'subtotal' => $request->amount,
                'grand_total' => $request->amount,
            ]);
        }

        // Midtrans Configuration
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');

        $externalId = 'INV-' . $transaction->id . '-' . time();

        $baseParams = [
            'transaction_details' => [
                'order_id' => $externalId,
                'gross_amount' => (int) $request->amount,
            ],
            'customer_details' => [
                'first_name' => Auth::user()->name,
                'email' => Auth::user()->email,
            ],
            'item_details' => [
                [
                    'id' => $package ? $package->id : 'booster',
                    'price' => (int) $request->amount,
                    'quantity' => 1,
                    'name' => 'Pembayaran Paket ' . $request->plan_name,
                ]
            ],
        ];

        $chargeParams = $baseParams;

        if ($request->payment_method === 'bank_transfer') {
            if ($request->bank === 'mandiri') {
                $chargeParams = array_merge($baseParams, [
                    'payment_type' => 'echannel',
                    'echannel' => [
                        'bill_info1' => 'Pembayaran:',
                        'bill_info2' => 'Paket ' . $request->plan_name,
                    ],
                ]);
            } else {
                $chargeParams = array_merge($baseParams, [
                    'payment_type' => 'bank_transfer',
                    'bank_transfer' => ['bank' => $request->bank],
                ]);
            }
        } elseif ($request->payment_method === 'qris') {
            $chargeParams = array_merge($baseParams, [
                'payment_type' => 'qris',
            ]);
        } elseif ($request->payment_method === 'gopay') {
            $chargeParams = array_merge($baseParams, [
                'payment_type' => 'gopay',
                'gopay' => [
                    'enable_callback' => true,
                    'callback_url' => route('payment.callback'),
                ],
            ]);
        }

        try {
            $response = CoreApi::charge($chargeParams);
            
            $paymentData = [];
            if ($response->payment_type === 'bank_transfer') {
                $vaData = $response->va_numbers[0];
                $paymentData = [
                    'payment_method' => 'bank_transfer',
                    'payment_bank' => $vaData->bank,
                    'va_number' => $vaData->va_number,
                    'payment_expired_at' => $response->expiry_time,
                ];
            } elseif ($response->payment_type === 'echannel') {
                $paymentData = [
                    'payment_method' => 'bank_transfer',
                    'payment_bank' => 'mandiri',
                    'va_number' => $response->bill_key, // For display: bill_key. Note: Mandiri also needs biller_code (response->biller_code)
                    'qr_code_url' => $response->biller_code, // Reusing qr_code_url field to store biller_code for Mandiri
                    'payment_expired_at' => $response->expiry_time,
                ];
            } elseif ($response->payment_type === 'qris') {
                $paymentData = [
                    'payment_method' => 'qris',
                    'qr_code_url' => $response->actions[0]->url ?? null,
                    'payment_expired_at' => $response->expiry_time,
                ];
            } elseif ($response->payment_type === 'gopay') {
                $deeplink = collect($response->actions)->firstWhere('name', 'deeplink-redirect');
                $qrCode = collect($response->actions)->firstWhere('name', 'generate-qr-code');
                $paymentData = [
                    'payment_method' => 'gopay',
                    'va_number' => $deeplink->url ?? null, // Store deeplink in va_number field
                    'qr_code_url' => $qrCode->url ?? null, // Store QR URL
                    'payment_expired_at' => $response->expiry_time,
                ];
            }

            $transaction->update(array_merge($paymentData, [
                'reference_id' => $externalId,
            ]));

            return response()->json(array_merge($paymentData, [
                'transaction_id' => $transaction->id,
                'amount' => $request->amount,
                'plan_name' => $request->plan_name,
            ]));
        } catch (\Exception $e) {
            Log::error('Midtrans Core API Error: ' . $e->getMessage());
            $transaction->update(['status' => 'EXPIRED']);
            return response()->json(['error' => 'Gagal membuat transaksi pembayaran'], 500);
        }
    }

    /**
     * Check transaction status for polling.
     */
    public function checkStatus(Request $request, $transactionId)
    {
        $transaction = Transaction::where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return response()->json([
            'status' => $transaction->status,
            'expired' => $transaction->payment_expired_at ? $transaction->payment_expired_at->isPast() : false,
        ]);
    }

    /**
     * Cancel a pending transaction.
     * Calls Midtrans Cancel API, then marks transaction as CANCELLED.
     */
    public function cancelTransaction(Transaction $transaction)
    {
        // 1. Authorization — hanya pemilik transaksi
        if ($transaction->user_id !== Auth::id()) {
            abort(403, 'Anda tidak berhak membatalkan transaksi ini.');
        }

        // 2. Guard — hanya transaksi PENDING yang bisa dibatalkan
        if ($transaction->status !== 'PENDING') {
            return redirect()->route('harga')->with('error', 'Transaksi tidak dapat dibatalkan karena sudah ' . strtolower($transaction->status) . '.');
        }

        // 3. Panggil Midtrans Cancel API (jika reference_id ada)
        if ($transaction->reference_id) {
            try {
                Config::$serverKey = config('services.midtrans.server_key');
                Config::$isProduction = config('services.midtrans.is_production');
                \Midtrans\Transaction::cancel($transaction->reference_id);
                Log::info('Midtrans Cancel Success: ' . $transaction->reference_id);
            } catch (\Exception $e) {
                // Tetap lanjutkan pembatalan di sisi kita meski Midtrans gagal
                Log::warning('Midtrans Cancel Failed: ' . $e->getMessage() . ' | ref: ' . $transaction->reference_id);
            }
        }

        // 4. Update status transaksi
        $transaction->update(['status' => 'CANCELLED']);

        return redirect()->route('harga')->with('success', 'Pesanan berhasil dibatalkan. Silakan pilih paket kembali.');
    }




    /**
     * Midtrans Notification Callback.
     */
    public function callback(Request $request, ApiService $apiService)
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');

        try {
            $notification = new Notification();
            $transactionStatus = $notification->transaction_status;
            $orderId = $notification->order_id;
            $fraudStatus = $notification->fraud_status;

            // Extract transaction ID from order_id (INV-{id}-{timestamp})
            if (preg_match('/INV-(\d+)-/', $orderId, $matches)) {
                $transactionId = $matches[1];
                $transaction = Transaction::with(['user.UserWhatsapp', 'packagePrice.package'])->find($transactionId);

                if (!$transaction) {
                    return response()->json(['message' => 'Transaction not found'], 404);
                }

                if ($transactionStatus == 'capture') {
                    if ($fraudStatus == 'challenge') {
                        $transaction->update(['status' => 'CHALLENGE']);
                    } else if ($fraudStatus == 'accept') {
                        $this->markAsPaid($transaction, $apiService);
                    }
                } else if ($transactionStatus == 'settlement') {
                    $this->markAsPaid($transaction, $apiService);
                } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
                    $transaction->update(['status' => 'EXPIRED']);
                } else if ($transactionStatus == 'pending') {
                    $transaction->update(['status' => 'PENDING']);
                }

                Log::info('Midtrans Callback: Order ID ' . $orderId . ' Status: ' . $transactionStatus);
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::error('Midtrans Callback Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    private function markAsPaid($transaction, ApiService $apiService)
    {
        if ($transaction->status !== 'PAID') {
            $transaction->update(['status' => 'PAID']);

            $user = $transaction->user;
            $phone = $user->UserWhatsapp->first()->phone_number ?? null;
            $package = $transaction->packagePrice->package ?? null;

            if ($phone && $package) {
                $apiService->setToken($user->external_api_token);

                if ($package->type === 'booster') {
                    $apiService->addBoosterTokens($phone, (int) $package->token_amount);
                } else {
                    $apiService->updateUserPackage($phone, strtolower($package->name));
                }
            }
        }
    }
}
