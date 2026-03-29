<?php

namespace App\Http\Controllers\Admin\Career;

use App\Http\Controllers\Controller;
use App\Models\CareerApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Career/Application/Index', [
            'applications' => CareerApplication::with('career')->latest()->paginate(10)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(CareerApplication $career_application)
    {
        $career_application->load('career');
        return Inertia::render('Admin/Career/Application/Show', [
            'application' => $career_application
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CareerApplication $career_application)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewed,accepted,rejected',
        ]);

        $career_application->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Status aplikasi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CareerApplication $career_application)
    {
        $career_application->delete();
        return back()->with('success', 'Aplikasi berhasil dihapus.');
    }
}
