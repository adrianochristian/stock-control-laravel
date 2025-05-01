<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'role' => Role::ADMIN->value
        ]);

        User::factory()->create([
            'name' => 'User',
            'email' => 'user@example.com',
            'role' => Role::USER->value
        ]);

        User::factory()->create([
            'name' => 'Operator',
            'email' => 'operator@example.com',
            'role' => Role::OPERATOR->value
        ]);

        Product::factory(100)->create();
    }
}
