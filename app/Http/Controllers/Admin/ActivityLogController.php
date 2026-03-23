<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with(['causer', 'subject'])
            ->latest();

        if ($request->search) {
            $query->where('description', 'like', '%' . $request->search . '%')
                ->orWhere('subject_type', 'like', '%' . $request->search . '%')
                ->orWhereHas('causer', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                });
        }

        $logs = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/ActivityLog/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search']),
        ]);
    }
}
