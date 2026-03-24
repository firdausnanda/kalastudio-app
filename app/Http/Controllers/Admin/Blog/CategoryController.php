<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = BlogCategory::latest()->paginate(10);
        return Inertia::render('Admin/Blog/Category/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $slug = Str::slug($request->name);
        // Ensure slug is unique
        $originalSlug = $slug;
        $counter = 1;
        while (BlogCategory::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        BlogCategory::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
        ]);

        return back()->with('success', 'Kategori blog berhasil ditambahkan.');
    }

    public function update(Request $request, BlogCategory $blog_category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description,
        ];

        if ($request->name !== $blog_category->name) {
            $slug = Str::slug($request->name);
            $originalSlug = $slug;
            $counter = 1;
            while (BlogCategory::where('slug', $slug)->where('id', '!=', $blog_category->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $data['slug'] = $slug;
        }

        $blog_category->update($data);

        return back()->with('success', 'Kategori blog berhasil diperbarui.');
    }

    public function destroy(BlogCategory $blog_category)
    {
        $blog_category->delete();
        return back()->with('success', 'Kategori blog berhasil dihapus.');
    }
}
