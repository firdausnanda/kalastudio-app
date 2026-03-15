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
}