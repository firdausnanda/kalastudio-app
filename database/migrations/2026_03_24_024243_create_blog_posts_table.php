<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete(); // Relasi ke penulis/user

            $table->string('title');
            $table->string('slug');
            $table->text('excerpt')->nullable(); // Ringkasan singkat untuk list artikel
            $table->longText('content'); // Isi lengkap artikel (bisa format HTML/Markdown dari WYSIWYG)
            $table->string('featured_image')->nullable(); // URL gambar cover artikel

            // Status publikasi
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable(); // Untuk fitur schedule post

            // Meta SEO
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();

            $table->softDeletes();
            $table->userstamps();
            $table->userstampSoftDeletes();
            $table->timestamps();

            $table->unique(['slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
