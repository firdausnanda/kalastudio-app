<?php

namespace Database\Seeders;

use App\Models\Packages;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Packages::create([
            'name' => 'Starter',
            'type' => 'subscription',
            'token_amount' => 300,
            'description' => 'Cocok untuk UMKM baru yang ingin mulai digitalisasi keuangan.',
            'features' => json_encode([
                '300 Token',
                'Hingga 300 Transaksi / Bulan',
                'Laporan Laba Rugi Dasar',
                'Penyimpanan Data 1 Tahun',
                'Dukungan Whatsapp',
            ]),
            'is_active' => true,
        ]);

        Packages::create([
            'name' => 'Business',
            'type' => 'subscription',
            'token_amount' => 1000,
            'description' => 'Pilihan terbaik untuk bisnis yang sedang berkembang pesat.',
            'features' => json_encode([
                '1000 Token',
                'Hingga 1000 Transaksi / Bulan',
                'Laporan Laba Rugi Lanjutan',
                'Manajemen Stok Produk',
                'Prioritas',
            ]),
            'is_active' => true,
        ]);

        Packages::create([
            'name' => 'Booster S',
            'type' => 'booster',
            'token_amount' => 25,
            'description' => '25 AI Tokens untuk kebutuhan ekstra.',
            'features' => json_encode([
                '25 AI Tokens',
            ]),
            'is_active' => true,
        ]);

        Packages::create([
            'name' => 'Booster M',
            'type' => 'booster',
            'token_amount' => 100,
            'description' => '100 AI Tokens untuk kebutuhan ekstra.',
            'features' => json_encode([
                '100 AI Tokens',
            ]),
            'is_active' => true,
        ]);

        Packages::create([
            'name' => 'Booster L',
            'type' => 'booster',
            'token_amount' => 500,
            'description' => '500 AI Tokens untuk kebutuhan ekstra.',
            'features' => json_encode([
                '500 AI Tokens',
            ]),
            'is_active' => true,
        ]);
    }
}
