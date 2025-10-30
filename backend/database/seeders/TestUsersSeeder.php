<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    public function run()
    {
        // Administrator
        User::updateOrCreate([
            'email' => 'jefersonugas@gmail.com'
        ], [
            'name' => 'Jefferson Torres',
            'password' => Hash::make('password123'),
            'role' => 'administrador',
            'email_verified_at' => now(),
        ]);
    }
}
