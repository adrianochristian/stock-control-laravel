<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Repositories\User\UserRepository;

class UserController extends Controller
{
    public function __construct(private readonly UserRepository $repository) {}

    public function show(User $user)
    {
        $this->authorize('view', $user);

        return UserResource::make($user);
    }
}
