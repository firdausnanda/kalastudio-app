<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Packages extends Model
{
    protected $fillable = [
        'name',
        'type',
        'description',
        'token_amount',
        'features',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
    ];

    protected $table = "packages";

    public function prices()
    {
        return $this->hasMany(PackagesPrices::class, 'package_id', 'id');
    }
}
