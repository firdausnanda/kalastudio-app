<?php

namespace App\Jobs;

use App\Models\Broadcast;
use App\Models\User;
use App\Services\ApiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendBroadcastJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Broadcast $broadcast)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(ApiService $apiService): void
    {
        try {
            $this->broadcast->update(['status' => 'sending']);

            $query = User::query();

            if ($this->broadcast->target_role) {
                $query->role($this->broadcast->target_role);
            }

            $users = $query->get();
            $this->broadcast->update(['total_count' => $users->count()]);

            $sentCount = 0;

            foreach ($users as $user) {
                try {
                    if ($this->broadcast->type === 'whatsapp' || $this->broadcast->type === 'all') {
                        $whatsapp = $user->UserWhatsapp()->where('receive_notifications', true)->first();
                        if ($whatsapp && $whatsapp->phone_number) {
                            $apiService->setToken($user->external_api_token)->sendData($whatsapp->phone_number, $this->broadcast->message);
                        }
                    }

                    if ($this->broadcast->type === 'email' || $this->broadcast->type === 'all') {
                        // Placeholder for Email Sending logic
                        // Mail::to($user->email)->send(new \App\Mail\BroadcastMail($this->broadcast));
                    }

                    $sentCount++;
                    $this->broadcast->update(['sent_count' => $sentCount]);
                } catch (\Exception $e) {
                    Log::error("Failed to send broadcast to user {$user->id}: " . $e->getMessage());
                }
            }

            $this->broadcast->update(['status' => 'completed']);
        } catch (\Exception $e) {
            $this->broadcast->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
            Log::error("Broadcast Job Failed: " . $e->getMessage());
        }
    }
}
