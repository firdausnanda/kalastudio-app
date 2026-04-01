<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Pool;

class ApiService
{
  protected $baseUrl;
  protected $token; // Tambahkan properti token

  public function __construct()
  {
    $this->baseUrl = config('services.external_api.base_url');
  }

  /**
   * Setter untuk token
   */
  public function setToken(string $token)
  {
    $this->token = $token;
    return $this;
  }

  /**
   * Autentikasi ke API Eksternal
   */
  public function authenticate(string $email, string $password): ?string
  {
    $response = Http::post("{$this->baseUrl}/api/auth/login", [
      'email' => $email,
      'password' => $password,
    ]);

    if ($response->successful()) {
      return $response->json('token');
    }

    return null;
  }

  /**
   * Check Account Whatsapp
   */
  public function checkAccountWhatsapp()
  {
    $response = Http::withToken($this->token)->get("{$this->baseUrl}/api/accounts/my-list");

    if ($response->successful()) {
      return $response->json();
    }

    return null;
  }

  /**
   * Connect Whatsapp
   */
  public function connectWhatsapp($id)
  {
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/accounts/{$id}/connect");
    return $response->json();
  }

  /**
   * Update Account Tenant
   */
  public function updateAccountTenant($id, $data)
  {
    $response = Http::withToken($this->token)->patch("{$this->baseUrl}/api/accounts/{$id}", $data);
    return $response->json();
  }

  /**
   * Store Account Tenant
   */
  public function storeAccountTenant($data)
  {
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/accounts", $data);
    return $response->json();
  }

  /**
   * Check Status Whatsapp
   */
  public function checkStatusWhatsapp($id)
  {
    $response = Http::withToken($this->token)->get("{$this->baseUrl}/api/accounts/{$id}/status");

    if ($response->successful()) {
      return $response->json();
    }

    return null;
  }

  /**
   * Show Qrcode Whatsapp
   */
  public function showQrcodeWhatsapp($id)
  {
    $response = Http::withToken($this->token)->get("{$this->baseUrl}/api/accounts/{$id}/qr");
    if ($response->successful()) {
      return $response->json();
    }

    return null;
  }

  /**
   * Disconnect Whatsapp
   */
  public function disconnectWhatsapp($id)
  {
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/accounts/{$id}/disconnect");
    return $response->json();
  }

  /**
   * Reconnect Whatsapp
   */
  public function reconnectWhatsapp($id)
  {
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/accounts/{$id}/reconnect");
    return $response->json();
  }

  /**
   * Register ke API Eksternal
   */
  public function register(string $email, string $password, string $phone, string $businessName, string $businessType, string $address, string $name)
  {
    $response = Http::post("{$this->baseUrl}/api/auth/register", [
      'nomor_wa' => $phone,
      'nama_bisnis' => $businessName,
      'kategori_bisnis' => $businessType,
      'email' => $email,
      'password' => $password,
      'nama' => $name,
      'alamat' => $address,
    ]);

    return $response->json();
  }

  /**
   * Fetch dashboard data from API Eksternal
   */
  public function fetchDashboardData(string $phone)
  {
    $responses = Http::pool(fn(Pool $pool) => [
      $pool->withToken($this->token)->get($this->baseUrl . "/api/laporan/{$phone}/chart/mingguan"),
      $pool->withToken($this->token)->get($this->baseUrl . "/api/transaksi/{$phone}/summary"),
      $pool->withToken($this->token)->get($this->baseUrl . "/api/transaksi/{$phone}/full"),
    ]);

    return [
      'weekly_report' => $responses[0]->successful() ? $responses[0]->json() : null,
      'summary' => $responses[1]->successful() ? $responses[1]->json() : null,
      'transactions' => $responses[2]->successful() ? $responses[2]->json() : null,
    ];
  }

  /**
   * Fetch user data from API Eksternal
   */
  public function fetchUser(string $phone): ?array
  {
    $response = Http::withToken($this->token)->get("{$this->baseUrl}/api/users/{$phone}");

    if ($response->successful()) {
      return $response->json();
    }

    return null;
  }

  /**
   * Fetch transaksi data from API Eksternal
   */
  public function fetchTransaksi(string $phone)
  {
    $response = Http::withToken($this->token)->get("{$this->baseUrl}/api/transaksi/{$phone}/full");

    if ($response->successful()) {
      return $response->json();
    }

    return null;
  }

  /**
   * Store transaksi data to API Eksternal
   */
  public function storeTransaksi(string $phone, array $data)
  {
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/transaksi/{$phone}", $data);

    return $response->json();
  }

  /**
   * Edit transaksi data to API Eksternal
   */
  public function editTransaksi(string $phone, string $id)
  {
    $response = Http::withToken($this->token)->get("{$this->baseUrl}/api/transaksi/{$phone}/{$id}");

    return $response->json();
  }

  /**
   * Update transaksi data to API Eksternal
   */
  public function updateTransaksi(string $phone, string $id, array $data)
  {
    $response = Http::withToken($this->token)->patch("{$this->baseUrl}/api/transaksi/{$phone}/{$id}", $data);

    return $response->json();
  }

  /**
   * Delete transaksi data to API Eksternal
   */
  public function deleteTransaksi(string $phone, string $id)
  {
    $response = Http::withToken($this->token)->delete("{$this->baseUrl}/api/transaksi/{$phone}/{$id}");

    return $response->json();
  }

  /**
   * Fetch laporan data from API Eksternal
   */
  public function fetchLaporanData(string $phone, string $month)
  {
    // Hitung bulan sebelumnya
    $previousMonthTimestamp = strtotime($month . '-01 -1 month');
    $previousMonth = date('Y-m', $previousMonthTimestamp);

    $responses = Http::pool(fn(Pool $pool) => [
      $pool->withToken($this->token)->get($this->baseUrl . "/api/transaksi/{$phone}/summary"), // As fallback
      $pool->withToken($this->token)->get($this->baseUrl . "/api/laporan/{$phone}/chart/bulanan?bulan={$month}"),
      $pool->withToken($this->token)->get($this->baseUrl . "/api/anomali/{$phone}/insight?bulan={$month}"),
      // Ganti request summary prev month menjadi request chart prev month
      $pool->withToken($this->token)->get($this->baseUrl . "/api/laporan/{$phone}/chart/bulanan?bulan={$previousMonth}"),
    ]);

    $summary = $responses[0]->successful() ? $responses[0]->json() : [];
    $monthlyReport = $responses[1]->successful() ? $responses[1]->json() : null;
    $insights = $responses[2]->successful() ? $responses[2]->json() : null;
    $prevMonthlyReport = $responses[3]->successful() ? $responses[3]->json() : null;

    // Hitung total manual karena API /summary murni selalu mengembalikan bulan ini secara global
    $currentPemasukan = 0;
    $currentPengeluaran = 0;
    if (isset($monthlyReport['data']) && is_array($monthlyReport['data'])) {
      foreach ($monthlyReport['data'] as $day) {
        $currentPemasukan += $day['pemasukan'] ?? 0;
        $currentPengeluaran += $day['pengeluaran'] ?? 0;
      }
      $summary['total_pemasukan'] = $currentPemasukan;
      $summary['total_pengeluaran'] = $currentPengeluaran;
      $summary['laba_bersih'] = $currentPemasukan - $currentPengeluaran;
    }

    $prevPemasukan = 0;
    $prevPengeluaran = 0;
    if (isset($prevMonthlyReport['data']) && is_array($prevMonthlyReport['data'])) {
      foreach ($prevMonthlyReport['data'] as $day) {
        $prevPemasukan += $day['pemasukan'] ?? 0;
        $prevPengeluaran += $day['pengeluaran'] ?? 0;
      }
    }

    $summary['total_pemasukan_bulan_lalu'] = $prevPemasukan;
    $summary['total_pengeluaran_bulan_lalu'] = $prevPengeluaran;

    return [
      'summary' => $summary,
      'monthlyReport' => $monthlyReport,
      'insights' => $insights,
    ];
  }

  /**
   * Update User Package in API Eksternal
   */
  public function updateUserPackage(string $phone, string $plan)
  {
    $response = Http::withToken($this->token)->patch("{$this->baseUrl}/api/users/{$phone}/plan", [
      'plan' => $plan,
    ]);

    return $response->json();
  }

  /**
   * Add Booster Tokens in API Eksternal
   */
  public function addBoosterTokens(string $phone, int $jumlah)
  {
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/admin/token/topup", [
      'nomor_wa' => $phone,
      'jumlah' => $jumlah,
    ]);

    return $response->json();
  }

  /**
   * Send data to API Eksternal
   */
  public function sendData($phone, $text)
  {
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/wa/send", [
      'to' => $phone,
      'text' => $text,
      'type' => 'text',
    ]);

    //example body
    /*
     {
     "to": "628123456789",
     "text": "Halo, ini pesan dari Kalastudio!",
     "type": "text"     
     }
     */

    return $response;
  }
}