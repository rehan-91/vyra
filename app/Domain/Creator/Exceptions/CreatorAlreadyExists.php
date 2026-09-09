<?php

namespace App\Domain\Creator\Exceptions;

use App\Domain\Creator\Models\Creator;
use RuntimeException;
use Throwable;

class CreatorAlreadyExists extends RuntimeException
{
    public function __construct(public readonly Creator $creator, ?Throwable $previous = null)
    {
        parent::__construct('The user already owns a creator identity.', 0, $previous);
    }
}
