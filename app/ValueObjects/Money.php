<?php

namespace App\ValueObjects;

use App\Casts\MoneyCast;
use Illuminate\Contracts\Database\Eloquent\Castable;
use InvalidArgumentException;
use Stringable;

final readonly class Money implements Castable, Stringable
{
    private int $cents;

    public function __construct(int $cents)
    {
        $this->ensureNonNegative($cents);
        $this->cents = $cents;
    }

    public static function fromAmount(float $amount): self
    {
        $cents = (int) round($amount * 100);
        return new self($cents);
    }

    public function getCents(): int
    {
        return $this->cents;
    }

    public function getAmount(): float
    {
        return $this->cents / 100;
    }

    public function add(Money $money): self
    {
        return new self($this->cents + $money->getCents());
    }

    public function subtract(Money $money): self
    {
        $result = $this->cents - $money->getCents();
        $this->ensureNonNegative($result);

        return new self($result);
    }

    public function multiply(float $factor): self
    {
        $result = (int) round($this->cents * $factor);
        $this->ensureNonNegative($result);

        return new self($result);
    }

    public function equals(Money $money): bool
    {
        return $this->cents === $money->getCents();
    }

    public function greaterThan(Money $money): bool
    {
        return $this->cents > $money->getCents();
    }

    public function lessThan(Money $money): bool
    {
        return $this->cents < $money->getCents();
    }

    public function __toString(): string
    {
        return number_format($this->getAmount(), 2, '.', '');
    }

    private function ensureNonNegative(int $cents): void
    {
        if ($cents < 0) {
            throw new InvalidArgumentException('Amount in cents cannot be negative.');
        }
    }

    public static function castUsing(array $arguments): MoneyCast
    {
        return new MoneyCast();
    }
}