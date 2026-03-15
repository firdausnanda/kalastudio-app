<?php

use App\Http\Controllers\ApiAccountController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransaksiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/fitur', [LandingController::class, 'fitur'])->name('fitur');
Route::get('/harga', [LandingController::class, 'harga'])->name('harga');
Route::get('/partnership', [LandingController::class, 'partnership'])->name('partnership');
Route::get('/tentang', [LandingController::class, 'tentang'])->name('tentang');
Route::get('/blog', [LandingController::class, 'blog'])->name('blog');
Route::get('/panduan', [LandingController::class, 'panduan'])->name('panduan');
Route::get('/laporan-ai', [LandingController::class, 'laporanAI'])->name('laporan-ai');
Route::get('/integrasi-wa', [LandingController::class, 'integrasiWA'])->name('integrasi-wa');
Route::get('/tentang-kami', [LandingController::class, 'tentangKami'])->name('tentang-kami');
Route::get('/karier', [LandingController::class, 'karier'])->name('karier');
Route::get('/kontak', [LandingController::class, 'kontak'])->name('kontak');
Route::get('/syarat-ketentuan', [LandingController::class, 'syaratKetentuan'])->name('syarat-ketentuan');
Route::get('/kebijakan-privasi', [LandingController::class, 'kebijakanPrivasi'])->name('kebijakan-privasi');

Route::middleware(['auth'])->group(function () {
    Route::get('/lengkapi-profil', [DashboardController::class, 'lengkapiProfil'])->name('lengkapi-profil');
    Route::post('/lengkapi-profil', [DashboardController::class, 'storeProfil'])->name('lengkapi-profil.store');
});

Route::middleware(['auth', 'EnsureDetailsCompleted', 'CheckExternalApiToken'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/transaksi', [TransaksiController::class, 'index'])->name('transaksi.index');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
