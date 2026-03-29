<?php

namespace App\Http\Controllers\Admin\Career;

use App\Http\Controllers\Controller;
use App\Models\Career;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Career/Job/Index', [
            'jobs' => Career::latest()->paginate(10)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Career/Job/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $slug = Str::slug($request->title);
        $originalSlug = $slug;
        $counter = 1;
        while (Career::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $data = $request->all();
        $data['slug'] = $slug;

        Career::create($data);

        return redirect()->route('admin.career-jobs.index')->with('success', 'Lowongan pekerjaan berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Career $career_job)
    {
        return Inertia::render('Admin/Career/Job/Edit', [
            'job' => $career_job
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Career $career_job)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $data = $request->all();

        if ($request->title !== $career_job->title) {
            $slug = Str::slug($request->title);
            $originalSlug = $slug;
            $counter = 1;
            while (Career::where('slug', $slug)->where('id', '!=', $career_job->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $data['slug'] = $slug;
        }

        $career_job->update($data);

        return redirect()->route('admin.career-jobs.index')->with('success', 'Lowongan pekerjaan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Career $career_job)
    {
        $career_job->delete();
        return back()->with('success', 'Lowongan pekerjaan berhasil dihapus.');
    }
}
