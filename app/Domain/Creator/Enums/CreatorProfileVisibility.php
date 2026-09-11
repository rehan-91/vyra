<?php

namespace App\Domain\Creator\Enums;

enum CreatorProfileVisibility: string
{
    case Private = 'private';
    case Public = 'public';
}
