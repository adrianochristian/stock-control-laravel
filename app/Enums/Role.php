<?php

namespace App\Enums;

enum Role: string
{
    case ADMIN = 'admin';
    case OPERATOR = 'operator';
    case USER = 'user';

    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }
    
    public function isOperator(): bool
    {
        return $this === self::OPERATOR;
    }

    public function isUser(): bool
    {
        return $this === self::USER;
    }
}
