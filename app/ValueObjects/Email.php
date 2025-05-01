<?php

namespace App\ValueObjects;

use App\Casts\EmailCast;
use Illuminate\Contracts\Database\Eloquent\Castable;
use InvalidArgumentException;
use JsonSerializable;
use Stringable;

final readonly class Email implements Castable, Stringable, JsonSerializable
{
    private string $email;

    public function __construct(string $email)
    {
        $email = trim($email);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException(sprintf('The provided email "%s" is not valid.', $email));
        }

        $this->email = $email;
    }

    public function __toString(): string
    {
        return $this->email;
    }

    public function jsonSerialize(): string
    {
        return $this->email;
    }

    public function equals(self $other): bool
    {
        return strtolower($this->email) === strtolower($other->email);
    }

    public static function castUsing(array $arguments): EmailCast
    {
        return new EmailCast();
    }
}