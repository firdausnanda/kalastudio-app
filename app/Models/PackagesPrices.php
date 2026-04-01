<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PackagesPrices extends Model
{
    use SoftDeletes;

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
