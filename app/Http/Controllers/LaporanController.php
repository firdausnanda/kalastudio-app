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

        // Filter insights data to show only current week
        $insightsProp = null;
        if (isset($laporanData['insights']['minggu']) && is_array($laporanData['insights']['minggu'])) {
            $today = date('Y-m-d');
            foreach ($laporanData['insights']['minggu'] as $week) {
                if ($today >= ($week['periode']['dari'] ?? '') && $today <= ($week['periode']['sampai'] ?? '')) {
                    $insightsProp = [
                        'anomali' => $week['anomali'] ?? [],
                        'insight' => $week['insight'] ?? []
                    ];
                    break;
                }
            }

            // Fallback: use last week if no match (e.g. viewing past month)
            if (!$insightsProp && !empty($laporanData['insights']['minggu'])) {
                $lastWeek = end($laporanData['insights']['minggu']);
                $insightsProp = [
                    'anomali' => $lastWeek['anomali'] ?? [],
                    'insight' => $lastWeek['insight'] ?? []
                ];
            }
        }

        return Inertia::render('Laporan/Index', [
            'summaryProp' => $laporanData['summary'] ?? null,
            'insightsProp' => $insightsProp,
            'monthlyReportProp' => $laporanData['monthlyReport']['data'] ?? [],
            'currentMonth' => $month,
        ]);
    }
}
