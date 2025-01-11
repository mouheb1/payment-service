<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'service_id' => Service::factory(),
            'transaction_id' => $this->faker->uuid,
            'amount' => $this->faker->randomFloat(2, 10, 500),
            'status' => ['completed', 'pending', 'failed'][rand(0, 2)],
        ];
    }
}
