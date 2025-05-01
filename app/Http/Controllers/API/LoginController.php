<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoginResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    public function __invoke(Request $request): LoginResource|Response
    {
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($validatedData)) {
            return response()->json([
                'message' => 'Invalid credentials',
                'errors' => [
                    'credentials' => ['The provided credentials are incorrect.']
                ]
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = Auth::user();

        $data = $user->createToken('Personal Access Token');

        return LoginResource::make($user)->additional([
            'meta' => [
                'token' => $data->accessToken,
                'token_type' => 'Bearer',
                'expires_at' => $data->token->expires_at,
            ],
        ]);
    }
}
