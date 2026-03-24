<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Mattiverse\Userstamps\Traits\Userstamps;

class BlogTag extends Model
{
    use HasFactory, SoftDeletes, Userstamps;

    protected $fillable = [
        'name',
        'slug',
    ];

    public function posts()
    {
        return $this->belongsToMany(BlogPost::class , 'blog_post_tag', 'blog_tag_id', 'blog_post_id');
    }
}
