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

        // Filter insights data to show based on selected month
        $insightsProp = null;
        if (isset($laporanData['insights']['minggu']) && is_array($laporanData['insights']['minggu'])) {
            $anomaliResult = [];
            $insightResult = [];
            $foundMatch = false;

            foreach ($laporanData['insights']['minggu'] as $week) {
                $dari = $week['periode']['dari'] ?? '';
                $sampai = $week['periode']['sampai'] ?? '';

                // Cek apakah minggu ini masuk ke dalam bulan yang dipilih (format $month = Y-m)
                if (str_starts_with($dari, $month) || str_starts_with($sampai, $month)) {
                    if (!empty($week['anomali'])) {
                        foreach ($week['anomali'] as $anomali) {
                            if (stripos($anomali['pesan'] ?? '', 'tidak ada transaksi') === false) {
                                $anomaliResult[] = $anomali;
                            }
                        }
                    }
                    if (!empty($week['insight'])) {
                        foreach ($week['insight'] as $ins) {
                            if (stripos($ins, 'tidak ada transaksi') === false) {
                                $insightResult[] = $ins;
                            }
                        }
                    }
                    $foundMatch = true;
                }
            }

            if ($foundMatch) {
                $insightsProp = [
                    'anomali' => $anomaliResult,
                    'insight' => array_values(array_unique($insightResult))
                ];
            } else {
                // Fallback: use last week if no match
                if (!empty($laporanData['insights']['minggu'])) {
                    $lastWeek = end($laporanData['insights']['minggu']);
                    $insightsProp = [
                        'anomali' => $lastWeek['anomali'] ?? [],
                        'insight' => $lastWeek['insight'] ?? []
                    ];
                }
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
