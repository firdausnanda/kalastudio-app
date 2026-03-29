<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CareerApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'career_id',
        'name',
        'email',
        'phone',
        'resume_path',
        'cover_letter',
        'status',
    ];

    public function career()
    {
        return $this->belongsTo(Career::class);
    }
}
