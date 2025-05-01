<?php

namespace App\Casts;

use App\ValueObjects\Email;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class EmailCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if ($value === null) {
            return null;
        }

        return new Email($value);
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof Email) {
            return (string) $value;
        }

        if (is_string($value)) {
            return new Email($value);
        }

        throw new \InvalidArgumentException('The value must be an instance of Email or a string.');
    }
}
