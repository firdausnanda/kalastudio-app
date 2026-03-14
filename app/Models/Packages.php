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
        'is_active',
    ];

    protected $table = "packages";

    public function prices()
    {
        return $this->hasMany(PackagesPrices::class, 'package_id', 'id');
    }
}
