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
        // Current Stats
        $totalUsers = User::count();
        $totalBusinesses = DB::table('businesses')->count();
        $totalMonthlyPaid = DB::table('transactions')
            ->where('status', 'PAID')
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('grand_total');
        
        // Previous Month Stats for Growth Calculation
        $prevMonthUsers = User::where('created_at', '<', now()->startOfMonth())
            ->where('created_at', '>=', now()->subMonth()->startOfMonth())
            ->count();
        $prevMonthBusinesses = DB::table('businesses')
            ->where('created_at', '<', now()->startOfMonth())
            ->where('created_at', '>=', now()->subMonth()->startOfMonth())
            ->count();
        $prevMonthPaid = DB::table('transactions')
            ->where('status', 'PAID')
            ->where('created_at', '<', now()->startOfMonth())
            ->where('created_at', '>=', now()->subMonth()->startOfMonth())
            ->sum('grand_total');

        // Helper to calculate percentage growth
        $calcGrowth = function($current, $previous) {
            if ($previous == 0) return $current > 0 ? 100 : 0;
            return round((($current - $previous) / $previous) * 100, 1);
        };

        $recentUsers = User::latest()->take(5)->get();

        // Get monthly transactions for the last 6 months
        $monthlyTransactions = DB::table('transactions')
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%b") as month'),
                DB::raw('SUM(grand_total) as total'),
                DB::raw('MIN(created_at) as sort_date')
            )
            ->where('status', 'PAID')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('sort_date', 'asc')
            ->get();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'total_users' => $totalUsers,
                'users_growth' => $calcGrowth($totalUsers, $prevMonthUsers),
                'total_businesses' => $totalBusinesses,
                'businesses_growth' => $calcGrowth($totalBusinesses, $prevMonthBusinesses),
                'total_monthly_paid' => $totalMonthlyPaid,
                'paid_growth' => $calcGrowth($totalMonthlyPaid, $prevMonthPaid),
                'monthly_transactions' => $monthlyTransactions,
            ],
            'recent_users' => $recentUsers,
        ]);
    }
}
