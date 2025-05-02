<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct(private readonly UserRepository $repository) {}

    public function show(User $user): UserResource
    {
        $this->authorize('view', $user);

        return UserResource::make($user);
    }

    public function me(): UserResource
    {
        return UserResource::make(Auth::user());
    }
}
