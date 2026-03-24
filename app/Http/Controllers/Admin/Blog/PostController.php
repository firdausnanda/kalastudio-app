<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $posts = BlogPost::with(['author', 'categories'])->latest()->paginate(10);
        return Inertia::render('Admin/Blog/Post/Index', [
            'posts' => $posts
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blog/Post/Create', [
            'categories' => BlogCategory::all(),
            'tags' => BlogTag::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:blog_categories,id',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'status' => 'required|in:draft,published,archived',
            'featured_image' => 'nullable|image|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:blog_tags,id',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $slug = Str::slug($request->title);
        $originalSlug = $slug;
        $counter = 1;
        while (BlogPost::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $data = $request->except(['featured_image', 'tags', 'categories']);
        $data['slug'] = $slug;
        $data['author_id'] = auth()->id();

        if ($request->status === 'published' && !$request->published_at) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('blog/images', 'public');
        }

        $post = BlogPost::create($data);

        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        if ($request->has('categories')) {
            $post->categories()->sync($request->categories);
        }

        return redirect()->route('admin.blog-posts.index')->with('success', 'Artikel berhasil ditambahkan.');
    }

    public function edit(BlogPost $blog_post)
    {
        $blog_post->load(['tags', 'categories']);
        return Inertia::render('Admin/Blog/Post/Edit', [
            'post' => $blog_post,
            'categories' => BlogCategory::all(),
            'tags' => BlogTag::all()
        ]);
    }

    public function update(Request $request, BlogPost $blog_post)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:blog_categories,id',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'status' => 'required|in:draft,published,archived',
            'featured_image' => 'nullable|image|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:blog_tags,id',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $data = $request->except(['featured_image', 'tags', 'categories']);

        if ($request->title !== $blog_post->title) {
            $slug = Str::slug($request->title);
            $originalSlug = $slug;
            $counter = 1;
            while (BlogPost::where('slug', $slug)->where('id', '!=', $blog_post->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $data['slug'] = $slug;
        }

        if ($request->status === 'published' && !$blog_post->published_at) {
            $data['published_at'] = now();
        } elseif ($request->status === 'draft') {
            $data['published_at'] = null;
        }

        if ($request->hasFile('featured_image')) {
            if ($blog_post->featured_image) {
                Storage::disk('public')->delete($blog_post->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('blog/images', 'public');
        }

        $blog_post->update($data);

        if ($request->has('tags')) {
            $blog_post->tags()->sync($request->tags);
        } else {
            $blog_post->tags()->sync([]);
        }

        if ($request->has('categories')) {
            $blog_post->categories()->sync($request->categories);
        } else {
            $blog_post->categories()->sync([]);
        }

        return redirect()->route('admin.blog-posts.index')->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(BlogPost $blog_post)
    {
        if ($blog_post->featured_image) {
            Storage::disk('public')->delete($blog_post->featured_image);
        }
        $blog_post->tags()->detach();
        $blog_post->categories()->detach();
        $blog_post->delete();

        return back()->with('success', 'Artikel berhasil dihapus.');
    }
}
