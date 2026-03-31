<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::latest()->paginate(10);
        return Inertia::render('Admin/Contact/Index', [
            'contacts' => $contacts
        ]);
    }

    public function show(Contact $contact)
    {
        if ($contact->status === 'unread') {
            $contact->update([
                'status' => 'read',
                'read_at' => Carbon::now(),
            ]);
        }

        return Inertia::render('Admin/Contact/Show', [
            'contact' => $contact
        ]);
    }

    public function markAsRead(Contact $contact)
    {
        if ($contact->status === 'unread') {
            $contact->update([
                'status' => 'read',
                'read_at' => Carbon::now(),
            ]);
        }

        return back()->with('success', 'Pesan ditandai sebagai dibaca.');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return back()->with('success', 'Pesan berhasil dihapus.');
    }
}
