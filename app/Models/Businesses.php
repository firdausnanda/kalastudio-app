<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Businesses extends Model
{
    use LogsActivity;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'address'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'type', 'address']);
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function userWhatsapp()
    {
        return $this->hasMany(UserWhatsapp::class);
    }
}
