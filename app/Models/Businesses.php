<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Businesses extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'address'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function userWhatsapp()
    {
        return $this->hasMany(UserWhatsapp::class);
    }
}
