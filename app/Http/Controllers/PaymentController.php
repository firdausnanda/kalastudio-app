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



class PaymentController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function checkout(Request $request)
    {
        $planName = $request->query('plan', 'Starter');
        $billingCycle = $request->query('billing', 'monthly');

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
     * Create Xendit Invoice.
     */
    public function createInvoice(Request $request)
    {
        $validationRules = [
            'plan_name' => 'required|string',
            'amount' => 'required|numeric',
            'email' => 'required|email',
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


        // Create Transaction Record
        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'package_price_id' => $packagePrice ? $packagePrice->id : null,
            'subtotal' => $request->amount,
            'grand_total' => $request->amount,
            'status' => 'PENDING',
        ]);

        $xenditSecretKey = config('services.xendit.secret_key');

        $response = Http::withBasicAuth($xenditSecretKey, '')
            ->post('https://api.xendit.co/v2/invoices', [
                'external_id' => 'INV-' . $transaction->id . '-' . time(),
                'amount' => $request->amount,
                'payer_email' => $request->email,
                'description' => 'Pembayaran Paket ' . $request->plan_name,
                'success_redirect_url' => route('langganan'),
                'failure_redirect_url' => route('langganan'),
            ]);

        if ($response->successful()) {
            $invoiceData = $response->json();
            $transaction->update([
                'xendit_invoice_id' => $invoiceData['id'],
                'xendit_invoice_url' => $invoiceData['invoice_url'],
            ]);

            return response()->json([
                'invoice_url' => $invoiceData['invoice_url']
            ]);
        }

        $transaction->update(['status' => 'EXPIRED']);

        return response()->json(['error' => 'Gagal membuat invoice'], 500);
    }



    /**
     * Xendit Webhook Callback.
     */
    public function callback(Request $request, ApiService $apiService)
    {
        $xenditCallbackToken = config('services.xendit.webhook_token');

        if ($request->header('x-callback-token') !== $xenditCallbackToken) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->all();
        $externalId = $data['external_id'] ?? '';

        // Extract transaction ID from external_id (INV-{id}-{timestamp})
        if (preg_match('/INV-(\d+)-/', $externalId, $matches)) {
            $transactionId = $matches[1];
            $transaction = Transaction::with(['user.UserWhatsapp', 'packagePrice.package'])->find($transactionId);

            if ($transaction && $transaction->status === 'PENDING') {
                if ($data['status'] === 'SETTLED' || $data['status'] === 'PAID') {
                    $transaction->update(['status' => 'PAID']);

                    $user = $transaction->user;
                    $phone = $user->UserWhatsapp->first()->phone_number ?? null;
                    $package = $transaction->packagePrice->package ?? null;

                    if ($phone && $package) {
                        $apiService->setToken($user->external_api_token);

                        if ($package->type === 'booster') {
                            $apiService->addBoosterTokens($phone, $package->token_amount);
                        } else {
                            $apiService->updateUserPackage($phone, strtolower($package->name));
                        }
                    }
                } elseif ($data['status'] === 'EXPIRED') {
                    $transaction->update(['status' => 'EXPIRED']);
                }
            }

            Log::info('Transaction updated: ' . $transactionId . ' ' . $data['status']);
        } else {
            Log::error('Transaction unsuccessful: ' . $data);
        }

        return response()->json(['status' => 'success']);
    }
}
