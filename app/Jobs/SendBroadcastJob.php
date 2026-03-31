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
            $this->broadcast->load('creator');
            $creatorToken = $this->broadcast->creator?->external_api_token;

            if (!$creatorToken) {
                Log::error("Broadcast ID {$this->broadcast->id} failed: Creator does not have an API token.");
                throw new \Exception("Broadcast creator does not have an external API token.");
            }

            $this->broadcast->update(['status' => 'sending']);

            $query = User::query();

            if ($this->broadcast->target_role) {
                $query->role($this->broadcast->target_role);
            }

            $users = $query->get();
            $this->broadcast->update(['total_count' => $users->count()]);

            $sentCount = 0;

            /** @var User $user */
            foreach ($users as $user) {
                try {
                    $isSent = false;

                    if ($this->broadcast->type === 'whatsapp' || $this->broadcast->type === 'all') {
                        $whatsapp = $user->UserWhatsapp()->where('receive_notifications', true)->first();
                        if ($whatsapp && $whatsapp->phone_number) {
                            $response = $apiService->setToken($creatorToken)->sendData($whatsapp->phone_number, $this->broadcast->message);
                            if ($response && $response->successful()) {
                                $isSent = true;
                            } else {
                                Log::warning("Broadcast ID {$this->broadcast->id}: Failed to send WhatsApp to user {$user->id} ({$whatsapp->phone_number}). Status: " . ($response ? $response->status() : 'Unknown'));
                            }
                        }
                    }

                    if ($this->broadcast->type === 'email' || $this->broadcast->type === 'all') {
                        // Placeholder for Email Sending logic
                        // Mail::to($user->email)->send(new \App\Mail\BroadcastMail($this->broadcast));
                        // If email succeeds, set $isSent = true;
                    }

                    if ($isSent) {
                        $sentCount++;
                        $this->broadcast->update(['sent_count' => $sentCount]);
                    }
                } catch (\Exception $e) {
                    Log::error("Failed to process broadcast to user {$user->id}: " . $e->getMessage());
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
