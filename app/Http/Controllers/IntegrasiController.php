<?php

namespace App\Http\Controllers;

use App\Models\Businesses;
use App\Models\UserWhatsapp;
use App\Services\ApiService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class IntegrasiController extends Controller
{
    /**
     * Display a listing of connected WhatsApp accounts.
     */
    public function index(ApiService $apiService)
    {
        $user = Auth::user();

        $apiResponse = $apiService->setToken($user->external_api_token)->checkAccountWhatsapp();

        $apiAccounts = $apiResponse['data'] ?? $apiResponse['businesses'] ?? (is_array($apiResponse) && array_is_list($apiResponse) ? $apiResponse : []);

        // Get local data
        $localAccounts = UserWhatsapp::where('user_id', $user->id)->get()->keyBy('phone_number');

        foreach ($apiAccounts as $key => $value) {
            $accountId = $value['account_id'];
            $phone = $value['accounts']['nomor_bot'];

            // Get status
            $statusWhatsapp = $apiService->setToken($user->external_api_token)->checkStatusWhatsapp($accountId);
            $apiAccounts[$key]['accounts']['wa_status'] = $statusWhatsapp['wa_status'] ?? 'disconnected';

            // Attach local data
            if ($localAccounts->has($phone)) {
                $local = $localAccounts->get($phone);
                $apiAccounts[$key]['local_data'] = [
                    'id' => $local->id,
                    'label' => $local->label,
                    'is_primary' => $local->is_primary,
                    'receive_notifications' => $local->receive_notifications,
                    'business_id' => $local->business_id,
                ];
            } else {
                $apiAccounts[$key]['local_data'] = null;
            }
        }

        $businesses = $user->business()->get();
        return Inertia::render('Integrasi/Index', [
            'accounts' => $apiAccounts,
            'businesses' => $businesses
        ]);
    }

    /**
     * Store a newly created WhatsApp integration.
     */
    public function store(Request $request, ApiService $apiService)
    {
        $request->validate([
            'phone_number' => 'required|string',
            'label' => 'required|string|max:50',
            'business_id' => 'required|string',
            'new_business_name' => 'nullable|required_if:business_id,new|string|max:100',
        ]);

        $user = Auth::user();

        // Check if phone number already exists for this user
        $exists = UserWhatsapp::where('user_id', $user->id)
            ->where('phone_number', $request->phone_number)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'phone_number' => ['Nomor WhatsApp ini sudah terdaftar.']
            ]);
        }

        $apiResponse = $apiService->setToken($user->external_api_token)->storeAccountTenant([
            'nama_tenant' => $request->label
        ]);

        if (!$apiResponse || !($apiResponse['success'] ?? false)) {
            $errorMessage = $apiResponse['message'] ?? 'Gagal mendaftarkan akun di server pusat.';
            return redirect()->back()->with('error', $errorMessage);
        }

        // Handle Business Creation if needed
        $businessId = $request->business_id;
        if ($businessId === 'new') {
            $newBusiness = Businesses::create([
                'user_id' => $user->id,
                'name' => $request->new_business_name,
                'type' => 'Other', // Default type
                'address' => '-'     // Default address
            ]);
            $businessId = $newBusiness->id;
        }

        // If this is the first account, make it primary
        $isFirst = UserWhatsapp::where('user_id', $user->id)->count() === 0;

        UserWhatsapp::create([
            'user_id' => $user->id,
            'business_id' => $businessId,
            'phone_number' => $request->phone_number,
            'label' => $request->label,
            'is_primary' => $isFirst,
            'receive_notifications' => true,
        ]);

        return redirect()->back()->with('success', 'Akun WhatsApp berhasil ditambahkan!');
    }

    /**
     * Update the specified integration settings.
     */
    public function update(Request $request, ApiService $apiService, $id)
    {
        $account = UserWhatsapp::where('user_id', Auth::id())->findOrFail($id);
        $user = Auth::user();

        if ($request->has('is_primary') && $request->is_primary) {
            // Unset other primary accounts for this user
            UserWhatsapp::where('user_id', Auth::id())->update(['is_primary' => false]);
            $account->is_primary = true;
        }

        if ($request->has('receive_notifications')) {
            $account->receive_notifications = $request->receive_notifications;
        }

        if ($request->has('label')) {
            $account->label = $request->label;

            // Sync with external API if external account ID is provided in request or we can find it
            if ($request->has('external_account_id')) {
                $syncResponse = $apiService->setToken($user->external_api_token)->updateAccountTenant($request->external_account_id, [
                    'nama_tenant' => $request->label
                ]);

                if (!$syncResponse || !($syncResponse['success'] ?? false)) {
                    \Log::warning("Failed to sync label to external API for {$request->external_account_id}", ['response' => $syncResponse]);
                }
            }
        }

        $account->save();

        return redirect()->back()->with('success', 'Pengaturan akun berhasil diperbarui.');
    }

    /**
     * Remove the specified integration.
     */
    public function destroy($id)
    {
        $account = UserWhatsapp::where('user_id', Auth::id())->findOrFail($id);

        $wasPrimary = $account->is_primary;
        $account->delete();

        // If we deleted the primary account, try to set a new one
        if ($wasPrimary) {
            $newPrimary = UserWhatsapp::where('user_id', Auth::id())->first();
            if ($newPrimary) {
                $newPrimary->update(['is_primary' => true]);
            }
        }

        return redirect()->back()->with('success', 'Integrasi WhatsApp berhasil dihapus.');
    }

    /**
     * Connect WhatsApp account.
     */
    public function connect(Request $request, ApiService $apiService, $id)
    {
        $user = Auth::user();
        $response = $apiService->setToken($user->external_api_token)->connectWhatsapp($id);

        \Log::info("Connect Request for {$id}:", ['response' => $response]);

        if (!$response || !($response['success'] ?? false)) {
            $message = $response['message'] ?? 'Gagal menghubungkan WhatsApp.';
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => $message], 400);
            }
            return redirect()->back()->with('error', $message);
        }

        $message = $response['message'] ?? 'Permintaan penyambungan berhasil dikirim.';
        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => $message, 'data' => $response]);
        }
        return redirect()->back()->with('success', $message);
    }

    /**
     * Reconnect WhatsApp account.
     */
    public function reconnect(ApiService $apiService, $id)
    {
        $user = Auth::user();
        $response = $apiService->setToken($user->external_api_token)->reconnectWhatsapp($id);

        if (!$response || !($response['success'] ?? false)) {
            $errorMessage = $response['message'] ?? 'Gagal menyambungkan ulang WhatsApp.';
            return redirect()->back()->with('error', $errorMessage);
        }

        return redirect()->back()->with('success', 'WhatsApp berhasil disambungkan ulang.');
    }

    /**
     * Disconnect WhatsApp account.
     */
    public function disconnect(ApiService $apiService, $id)
    {
        $user = Auth::user();
        $response = $apiService->setToken($user->external_api_token)->disconnectWhatsapp($id);

        if (!$response || !($response['success'] ?? false)) {
            $errorMessage = $response['message'] ?? 'Gagal memutuskan WhatsApp.';
            return redirect()->back()->with('error', $errorMessage);
        }

        return redirect()->back()->with('success', 'WhatsApp berhasil diputuskan.');
    }

    /**
     * Show QR Code for WhatsApp account.
     */
    public function qrcode(ApiService $apiService, $id)
    {
        $user = Auth::user();
        $response = $apiService->setToken($user->external_api_token)->showQrcodeWhatsapp($id);

        // Logging for debugging empty response issues
        \Log::info("QR Code API Response for ID {$id}: ", [
            'response' => $response,
        ]);

        return response()->json($response);
    }

    /**
     * Get status of WhatsApp account.
     */
    public function status(ApiService $apiService, $id)
    {
        $user = Auth::user();
        $response = $apiService->setToken($user->external_api_token)->checkStatusWhatsapp($id);

        \Log::info("WhatsApp Status Response for {$id}:", ['response' => $response]);

        return response()->json($response);
    }
}
