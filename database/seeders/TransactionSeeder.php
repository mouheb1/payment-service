<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Service;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();
        $services = Service::all();

        foreach ($users as $user) {
            foreach ($services->random(3) as $service) {
                Transaction::factory()->create([
                    'user_id' => $user->id,
                    'service_id' => $service->id,
                    'amount' => $service->price,
                    // Use only allowed statuses
                    'status' => ['pending', 'failed'][rand(0, 1)],
                ]);
            }
        }
    }
}
