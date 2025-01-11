<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create a specific user with the provided email and password
        User::create([
            'name' => 'Mouheb Bouazra', // Replace with the desired name
            'email' => 'mouheb.bouazra@ticketchainer.com',
            'password' => Hash::make('fQYY#_F8BVdxi7x'),
        ]);

        // Create additional random users
        User::factory()->count(5)->create();
    }
}
