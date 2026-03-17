<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\ApiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class IntegrasiPageErrorTest extends TestCase
{
    use RefreshDatabase;

    public function test_integrasi_page_renders_with_empty_accounts_when_api_fails()
    {
        $user = User::factory()->create();

        $this->mock(ApiService::class, function (MockInterface $mock) {
            $mock->shouldReceive('setToken')->andReturnSelf();
            $mock->shouldReceive('checkAccountWhatsapp')->andReturn(null);
        });

        $response = $this->actingAs($user)->get(route('integrasi.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Integrasi/Index')
            ->has('accounts', 0)
        );
    }
}
