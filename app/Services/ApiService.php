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
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/transaksi/{$phone}/store", $data);

    return $response->json();
  }

  /**
   * Fetch laporan data from API Eksternal
   */
  public function fetchLaporanData(string $phone, string $month)
  {
    $responses = Http::pool(fn(Pool $pool) => [
      $pool->withToken($this->token)->get($this->baseUrl . "/api/transaksi/{$phone}/summary"),
      $pool->withToken($this->token)->get($this->baseUrl . "/api/laporan/{$phone}/chart/bulanan?bulan={$month}"),
      $pool->withToken($this->token)->get($this->baseUrl . "/api/anomali/{$phone}/insight"),
    ]);

    return [
      'summary' => $responses[0]->successful() ? $responses[0]->json() : null,
      'monthlyReport' => $responses[1]->successful() ? $responses[1]->json() : null,
      'insights' => $responses[2]->successful() ? $responses[2]->json() : null,
    ];
  }

  /**
   * Update User Package in API Eksternal
   */
  public function updateUserPackage(string $phone, string $plan)
  {
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/users/{$phone}/update-plan", [
      'plan' => $plan,
    ]);

    return $response->json();
  }

  /**
   * Add Booster Tokens in API Eksternal
   */
  public function addBoosterTokens(string $phone, int $tokens)
  {
    $response = Http::withToken($this->token)->post("{$this->baseUrl}/api/users/{$phone}/add-tokens", [
      'tokens' => $tokens,
    ]);

    return $response->json();
  }
}