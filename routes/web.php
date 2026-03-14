<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProfileController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
