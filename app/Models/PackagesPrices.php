<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackagesPrices extends Model
{
    protected $fillable = [
        'package_id',
        'billing_cycle',
        'price',
        'original_price',
    ];

    protected $table = "package_prices";

    public function package()
    {
        return $this->belongsTo(Packages::class);
    }
}
