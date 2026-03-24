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
        $featuredPost = \App\Models\BlogPost::with('categories')
            ->where('status', 'published')
            ->latest('published_at')
            ->first();

        $posts = \App\Models\BlogPost::with('categories')
            ->where('status', 'published')
            ->when($featuredPost, function ($query, $featured) {
                return $query->where('id', '!=', $featured->id);
            })
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('Landing/Blog', [
            'featuredPost' => $featuredPost,
            'posts' => $posts
        ]);
    }

    public function showPost($slug)
    {
        $post = \App\Models\BlogPost::with(['categories', 'author', 'tags'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return Inertia::render('Landing/BlogPost', [
            'post' => $post
        ]);
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

    public function syaratKetentuan()
    {
        return Inertia::render('Landing/Syarat-Ketentuan');
    }

    public function kebijakanPrivasi()
    {
        return Inertia::render('Landing/Kebijakan-Privasi');
    }
}
