<?php

namespace Database\Seeders;

use App\Models\PackagesPrices;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PackagePriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PackagesPrices::create([
            'package_id' => 1,
            'billing_cycle' => 'monthly',
            'price' => 99000,
            'original_price' => 99000,
        ]);

        PackagesPrices::create([
            'package_id' => 1,
            'billing_cycle' => 'annually',
            'price' => 79000,
            'original_price' => 79000,
        ]);

        PackagesPrices::create([
            'package_id' => 2,
            'billing_cycle' => 'monthly',
            'price' => 249000,
            'original_price' => 249000,
        ]);

        PackagesPrices::create([
            'package_id' => 2,
            'billing_cycle' => 'annually',
            'price' => 199000,
            'original_price' => 199000,
        ]);

        PackagesPrices::create([
            'package_id' => 3,
            'billing_cycle' => 'one_time',
            'price' => 29000,
            'original_price' => 29000,
        ]);

        PackagesPrices::create([
            'package_id' => 4,
            'billing_cycle' => 'one_time',
            'price' => 75000,
            'original_price' => 75000,
        ]);

        PackagesPrices::create([
            'package_id' => 5,
            'billing_cycle' => 'one_time',
            'price' => 199000,
            'original_price' => 199000,
        ]);
    }
}
