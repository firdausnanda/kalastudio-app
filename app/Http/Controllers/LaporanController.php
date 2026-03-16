<?php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index(Request $request, ApiService $apiService)
    {
        $user = $request->user();
        $phone = $user->UserWhatsapp()->first()->phone_number ?? '';
        $month = $request->input('bulan', date('Y-m'));

        $apiService->setToken($user->external_api_token);

        $laporanData = $apiService->fetchLaporanData($phone, $month);
        // dd($laporanData);
        return Inertia::render('Laporan/Index', [
            'summaryProp' => $laporanData['summary'] ?? null,
            'insightsProp' => $laporanData['insights'] ?? null,
            'monthlyReportProp' => $laporanData['monthlyReport']['data'] ?? [],
            'currentMonth' => $month,
        ]);
    }
}
