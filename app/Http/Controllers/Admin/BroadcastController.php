<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Broadcast;
use App\Jobs\SendBroadcastJob;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;

class BroadcastController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $broadcasts = Broadcast::with('creator:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Broadcast/Index', [
            'broadcasts' => $broadcasts,
            'roles' => Role::all(['id', 'name'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all(['id', 'name']);

        return Inertia::render('Admin/Broadcast/Create', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'type' => 'required|in:whatsapp,email,all',
            'target_role' => 'nullable|exists:roles,name',
            'subject' => 'nullable|required_if:type,email,all|string|max:255',
        ]);

        $broadcast = Broadcast::create([
            'subject' => $request->subject,
            'message' => $request->message,
            'type' => $request->type,
            'target_role' => $request->target_role,
            'status' => 'pending',
            'created_by' => Auth::id(),
            'total_count' => 0,
            'sent_count' => 0,
        ]);

        // Dispatch the job
        SendBroadcastJob::dispatch($broadcast);

        return redirect()->route('admin.broadcasts.index')
            ->with('success', 'Broadcast sedang diproses dan dikirim di latar belakang.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Broadcast $broadcast)
    {
        $broadcast->load('creator:id,name');
        return Inertia::render('Admin/Broadcast/Show', [
            'broadcast' => $broadcast
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Broadcast $broadcast)
    {
        $broadcast->delete();
        return redirect()->route('admin.broadcasts.index')
            ->with('success', 'Riwayat broadcast berhasil dihapus.');
    }
}
