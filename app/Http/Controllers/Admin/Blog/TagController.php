<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index()
    {
        $tags = BlogTag::latest()->paginate(10);
        return Inertia::render('Admin/Blog/Tag/Index', [
            'tags' => $tags
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $slug = Str::slug($request->name);
        $originalSlug = $slug;
        $counter = 1;
        while (BlogTag::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        BlogTag::create([
            'name' => $request->name,
            'slug' => $slug,
        ]);

        return back()->with('success', 'Tag blog berhasil ditambahkan.');
    }

    public function update(Request $request, BlogTag $blog_tag)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $data = ['name' => $request->name];

        if ($request->name !== $blog_tag->name) {
            $slug = Str::slug($request->name);
            $originalSlug = $slug;
            $counter = 1;
            while (BlogTag::where('slug', $slug)->where('id', '!=', $blog_tag->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $data['slug'] = $slug;
        }

        $blog_tag->update($data);

        return back()->with('success', 'Tag blog berhasil diperbarui.');
    }

    public function destroy(BlogTag $blog_tag)
    {
        $blog_tag->delete();
        return back()->with('success', 'Tag blog berhasil dihapus.');
    }
}
