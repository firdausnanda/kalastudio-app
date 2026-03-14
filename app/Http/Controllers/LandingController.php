<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

class LandingController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function harga()
    {
        return Inertia::render('Landing/Harga');
    }

    public function partnership()
    {
        return Inertia::render('Landing/Partnership');
    }

    public function tentang()
    {
        return Inertia::render('Landing/Tentang');
    }

    public function fitur()
    {
        return Inertia::render('Landing/Fitur');
    }

    public function blog()
    {
        return Inertia::render('Landing/Blog');
    }

    public function panduan()
    {
        return Inertia::render('Landing/Panduan');
    }

    public function laporanAI()
    {
        return Inertia::render('Landing/Laporan-AI');
    }

    public function integrasiWA()
    {
        return Inertia::render('Landing/Integrasi-WA');
    }

    public function tentangKami()
    {
        return Inertia::render('Landing/Tentang-Kami');
    }

    public function karier()
    {
        return Inertia::render('Landing/Karier');
    }

    public function kontak()
    {
        return Inertia::render('Landing/Kontak');
    }
}
