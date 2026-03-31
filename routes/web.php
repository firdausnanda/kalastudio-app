<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\Blog\CategoryController;
use App\Http\Controllers\Admin\Blog\PostController;
use App\Http\Controllers\Admin\Blog\TagController;
use App\Http\Controllers\Admin\BroadcastController;
use App\Http\Controllers\Admin\Career\ApplicationController;
use App\Http\Controllers\Admin\Career\JobController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IntegrasiController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\LanggananController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\BoosterController;
use Illuminate\Support\Facades\Route;


Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/fitur', [LandingController::class, 'fitur'])->name('fitur');
Route::get('/harga', [LandingController::class, 'harga'])->name('harga');

Route::get('/checkout', [PaymentController::class, 'checkout'])->name('payment.checkout');
Route::post('/payment/create-invoice', [PaymentController::class, 'createInvoice'])->name('payment.invoice');

Route::get('/partnership', [LandingController::class, 'partnership'])->name('partnership');
Route::get('/tentang', [LandingController::class, 'tentang'])->name('tentang');
Route::get('/blog', [LandingController::class, 'blog'])->name('blog');
Route::get('/blog/{slug}', [LandingController::class, 'showPost'])->name('blog.show');
Route::get('/panduan', [LandingController::class, 'panduan'])->name('panduan');
Route::get('/laporan-ai', [LandingController::class, 'laporanAI'])->name('laporan-ai');
Route::get('/integrasi-wa', [LandingController::class, 'integrasiWA'])->name('integrasi-wa');
Route::get('/tentang-kami', [LandingController::class, 'tentangKami'])->name('tentang-kami');
Route::get('/karier', [LandingController::class, 'karier'])->name('karier');
Route::get('/karier/{slug}', [LandingController::class, 'karierDetail'])->name('karier.show');
Route::post('/karier/{career}/apply', [LandingController::class, 'storeKarierApplication'])->name('karier.apply');
Route::get('/kontak', [LandingController::class, 'kontak'])->name('kontak');
Route::post('/kontak', [LandingController::class, 'storeKontak'])->name('kontak.store');
Route::get('/syarat-ketentuan', [LandingController::class, 'syaratKetentuan'])->name('syarat-ketentuan');
Route::get('/kebijakan-privasi', [LandingController::class, 'kebijakanPrivasi'])->name('kebijakan-privasi');

Route::middleware(['auth'])->group(function () {
    Route::get('/lengkapi-profil', [DashboardController::class, 'lengkapiProfil'])->name('lengkapi-profil');
    Route::post('/lengkapi-profil', [DashboardController::class, 'storeProfil'])->name('lengkapi-profil.store');
    Route::impersonate();
});

Route::middleware(['auth', 'EnsureDetailsCompleted', 'CheckExternalApiToken'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/transaksi', [TransaksiController::class, 'index'])->name('transaksi.index');
    Route::get('/transaksi/create', [TransaksiController::class, 'create'])->name('transaksi.create');
    Route::post('/transaksi', [TransaksiController::class, 'store'])->name('transaksi.store');

    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Langganan
    Route::get('/langganan', [LanggananController::class, 'index'])->name('langganan.index');
    Route::get('/langganan/booster', [BoosterController::class, 'index'])->name('langganan.booster');


    // Integrasi
    Route::get('/integrasi', [IntegrasiController::class, 'index'])->name('integrasi.index');
    Route::post('/integrasi', [IntegrasiController::class, 'store'])->name('integrasi.store');
    Route::patch('/integrasi/{id}', [IntegrasiController::class, 'update'])->name('integrasi.update');
    Route::delete('/integrasi/{id}', [IntegrasiController::class, 'destroy'])->name('integrasi.destroy');
    Route::post('/integrasi/{id}/connect', [IntegrasiController::class, 'connect'])->name('integrasi.connect');
    Route::post('/integrasi/{id}/reconnect', [IntegrasiController::class, 'reconnect'])->name('integrasi.reconnect');
    Route::post('/integrasi/{id}/disconnect', [IntegrasiController::class, 'disconnect'])->name('integrasi.disconnect');
    Route::get('/integrasi/{id}/qrcode', [IntegrasiController::class, 'qrcode'])->name('integrasi.qrcode');
    Route::get('/integrasi/{id}/status', [IntegrasiController::class, 'status'])->name('integrasi.status');
});

// Admin
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/password', [UserController::class, 'updatePassword'])->name('users.password');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');

    // Blog
    Route::resource('blog-categories', CategoryController::class)->except(['create', 'show', 'edit']);
    Route::resource('blog-tags', TagController::class)->except(['create', 'show', 'edit']);
    Route::resource('blog-posts', PostController::class)->except(['show']);

    // Broadcast
    Route::resource('broadcasts', BroadcastController::class)->except(['edit', 'update']);

    // Contact
    Route::resource('contacts', ContactController::class)->only(['index', 'show', 'destroy']);

    // Careers
    Route::resource('career-jobs', JobController::class)->except(['show']);
    Route::resource('career-applications', ApplicationController::class)->only(['index', 'show', 'update', 'destroy']);

    // Cache
    Route::get('cache', function () {
        Artisan::call('optimize:clear');
        Artisan::call('optimize');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        Artisan::call('event:clear');
        return redirect()->back()->with('success', 'Cache cleared successfully!');
    })->name('cache');
});

require __DIR__ . '/auth.php';
