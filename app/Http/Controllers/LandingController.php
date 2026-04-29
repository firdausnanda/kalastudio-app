<?php

namespace App\Http\Controllers;

use App\Models\Career;
use App\Models\CareerApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Storage;

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

    public function panduanHapusAkun()
    {
        return Inertia::render('Landing/PanduanHapusAkun');
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
        $jobs = Career::where('is_active', true)
            ->where('is_expired', false)
            ->latest()
            ->get();

        return Inertia::render('Landing/Karier', [
            'jobs' => $jobs
        ]);
    }

    public function karierDetail($slug)
    {
        $job = Career::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('Landing/Career/Show', [
            'job' => $job
        ]);
    }

    public function storeKarierApplication(Request $request, Career $career)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|min:10|max:20',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'cover_letter' => 'nullable|string',
        ]);

        $resumePath = $request->file('resume')->store('careers/resumes', 'public');

        CareerApplication::create([
            'career_id' => $career->id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'resume_path' => $resumePath,
            'cover_letter' => $request->cover_letter,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Aplikasi Anda telah berhasil dikirim. Tim kami akan segera meninjau profil Anda.');
    }

    public function kontak()
    {
        return Inertia::render('Landing/Kontak');
    }

    public function storeKontak(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|min:10|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
            'type' => 'nullable|string|in:contact,partnership',
        ]);

        $type = $request->input('type', 'contact');

        \App\Models\Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'unread',
            'type' => $type,
        ]);

        return back()->with('success', 'Terima kasih! Pesan Anda telah kami terima dan akan segera kami tindak lanjuti.');
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
