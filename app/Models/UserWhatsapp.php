<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserWhatsapp extends Model
{
    protected $fillable = [
        'user_id',
        'business_id',
        'phone_number',
        'label',
        'is_primary',
        'receive_notifications',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function business()
    {
        return $this->belongsTo(Businesses::class);
    }
}
