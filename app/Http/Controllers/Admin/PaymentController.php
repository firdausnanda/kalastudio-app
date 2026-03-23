<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'packagePrice.package'])
            ->latest();

        if ($request->has('status') && $request->status !== 'ALL') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('xendit_invoice_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function($qu) use ($search) {
                      $qu->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $transactions = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Payments/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['status', 'search']),
        ]);
    }
}
