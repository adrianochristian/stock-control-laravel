<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\LoginResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    /**
     * Handle a user login request.
     *
     * @param LoginRequest $request The validated login request with authentication logic
     * @return LoginResource|JsonResponse User resource with token or error response
     */
    public function __invoke(LoginRequest $request): LoginResource|JsonResponse
    {
        $request->authenticate();

        try {            
            $user = Auth::user();

            $token = $user->createToken(config('app.name'));
            
            return LoginResource::make($user)->additional([
                'meta' => [
                    'token' => $token->accessToken,
                    'token_type' => 'Bearer',
                    'expires_at' => $token->token->expires_at,
                ],
            ]);
        } catch (\Exception $e) {

            Log::error('Login failed: ' . $e->getMessage(), [
                'exception' => $e,
                'email' => $request->email,
            ]);
            
            return response()->json([
                'message' => 'Authentication failed due to a system error.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
