<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    protected $table = 'users_detail';

    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'business_name',
        'business_type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
