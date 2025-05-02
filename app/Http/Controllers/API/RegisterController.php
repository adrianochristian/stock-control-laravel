<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\User\UserResource;
use App\Repositories\User\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RegisterController extends Controller
{
    /**
     * Handle user registration request.
     * 
     * @param RegisterRequest $request The validated registration request
     * @param UserRepository $repository Repository to handle user creation
     * @return UserResource|JsonResponse User resource with token or error response
     */
    public function __invoke(RegisterRequest $request, UserRepository $repository): UserResource|JsonResponse
    {   
        try {
            $user = $repository->create($request->validated());
            
            $token = $user->createToken(config('app.name'));
            
            return UserResource::make($user)->additional([
                'meta' => [
                    'token' => $token->accessToken,
                    'token_type' => 'Bearer',
                    'expires_at' => $token->token->expires_at,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('User registration failed: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->safe()->except(['password']),
            ]);
            
            return response()->json([
                'message' => 'Registration failed. Please try again later.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
