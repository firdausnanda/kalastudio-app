<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProfileRequest;
use App\Services\ApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $apiService;

    public function __construct(ApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $phone = $user->UserWhatsapp->first()->phone_number ?? '';

        $dashboardData = $this->apiService
            ->setToken($user->external_api_token)
            ->fetchDashboardData($phone);

        return Inertia::render('Dashboard/Index', [
            'chartDataProp' => $dashboardData['weekly_report']['data'] ?? [],
            'statsProp' => $dashboardData['summary']['data'] ?? [],
            'transactionsProp' => $dashboardData['transactions']['data']['data'] ?? [],
        ]);
    }

    public function lengkapiProfil(Request $request)
    {
        // Jika sudah punya detail, jangan boleh masuk sini
        if ($request->user()->business()->exists() && $request->user()->UserWhatsapp()->exists()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Lengkapi-Profil/Index');
    }

    public function storeProfil(StoreProfileRequest $request, ApiService $apiService)
    {
        $user = $request->user();

        try {
            DB::transaction(function () use ($request, $apiService, $user) {
                // 1. Simpan Data Bisnis
                $user->business()->create([
                    'name' => $request->businessName,
                    'type' => $request->businessType,
                    'address' => $request->address,
                ]);

                // 2. Simpan Data WhatsApp
                $user->UserWhatsapp()->create([
                    'phone_number' => $request->phone,
                ]);

                // 3. Register ke API Eksternal
                $token = $apiService->register(
                    $user->email,
                    $user->password,
                    $request->phone,
                    $request->businessName,
                    $request->businessType,
                    $request->address,
                    $user->name
                );

                if (!($token['success'] ?? false)) {
                    throw new \Exception($token['message'] ?? 'Gagal mendaftar ke layanan API.');
                }

                // 4. Update Token API Eksternal
                $user->update([
                    'external_api_token' => $token['token'] ?? '',
                ]);
            });

            return redirect()->route('dashboard')->with('success', 'Profil berhasil dilengkapi!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }
}
