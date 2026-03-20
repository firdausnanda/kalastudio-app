<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalBusinesses = DB::table('businesses')->count();
        $totalWhatsapps = DB::table('user_whatsapps')->count();
        $recentUsers = User::latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_businesses' => $totalBusinesses,
                'total_whatsapps' => $totalWhatsapps,
            ],
            'recent_users' => $recentUsers,
        ]);
    }
}
