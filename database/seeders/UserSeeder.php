<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
        ]);

        UserDetail::create([
            'user_id' => $user->id,
            'phone' => '6281234567890',
            'address' => 'Jl. Merdeka No. 1, Jakarta',
            'business_name' => json_encode(['Admin Business']),
            'business_type' => json_encode(['Admin']),
        ]);

        $user2 = User::create([
            'name' => 'John Doe',
            'email' => 'john@gmail.com',
            'password' => Hash::make('password'),
        ]);

        UserDetail::create([
            'user_id' => $user2->id,
            'phone' => '6289876543210',
            'address' => 'Jl. Sudirman No. 10, Bandung',
            'business_name' => json_encode(['John Business']),
            'business_type' => json_encode(['John']),
        ]);
    }
}
