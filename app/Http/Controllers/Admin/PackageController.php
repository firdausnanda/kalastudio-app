<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Packages;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $packages = Packages::with('prices')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Package/Index', [
            'packages' => $packages,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in(['subscription', 'booster'])],
            'token_amount' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'prices' => 'array',
            'prices.*.billing_cycle' => ['required', Rule::in(['monthly', 'annually', 'one_time'])],
            'prices.*.price' => 'required|integer|min:0',
            'prices.*.original_price' => 'nullable|integer|min:0',
        ]);

        $package = Packages::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'token_amount' => $validated['token_amount'],
            'description' => $validated['description'],
            'features' => $validated['features'] ?? [],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if (isset($validated['prices']) && is_array($validated['prices'])) {
            $package->prices()->createMany($validated['prices']);
        }

        return redirect()->back()->with('success', 'Package berhasil ditambahkan.');
    }

    public function update(Request $request, Packages $package)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in(['subscription', 'booster'])],
            'token_amount' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'prices' => 'array',
            'prices.*.billing_cycle' => ['required', Rule::in(['monthly', 'annually', 'one_time'])],
            'prices.*.price' => 'required|integer|min:0',
            'prices.*.original_price' => 'nullable|integer|min:0',
        ]);

        $package->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'token_amount' => $validated['token_amount'],
            'description' => $validated['description'],
            'features' => $validated['features'] ?? [],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if (isset($validated['prices']) && is_array($validated['prices'])) {
            // Recreate prices to ensure sync
            $package->prices()->delete();
            $package->prices()->createMany($validated['prices']);
        } else {
            $package->prices()->delete();
        }

        return redirect()->back()->with('success', 'Package berhasil diperbarui.');
    }

    public function destroy(Packages $package)
    {
        $package->delete();

        return redirect()->back()->with('success', 'Package berhasil dihapus.');
    }
}
