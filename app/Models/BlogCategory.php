<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Mattiverse\Userstamps\Traits\Userstamps;

class BlogCategory extends Model
{
    use HasFactory, SoftDeletes, Userstamps;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function posts()
    {
        return $this->belongsToMany(BlogPost::class, 'blog_category_post', 'blog_category_id', 'blog_post_id');
    }
}
