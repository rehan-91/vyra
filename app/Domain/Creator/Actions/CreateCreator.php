<?php

namespace App\Domain\Creator\Actions;

use App\Domain\Creator\Exceptions\CreatorAlreadyExists;
use App\Domain\Creator\Models\Creator;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;

class CreateCreator
{
    /**
     * Create a creator identity owned by the authenticated user.
     */
    public function handle(User $owner, string $handle, string $displayName, ?string $bio): Creator
    {
        try {
            return DB::transaction(fn (): Creator => $owner->creator()->create([
                'handle' => $handle,
                'display_name' => $displayName,
                'bio' => $bio,
            ]));
        } catch (UniqueConstraintViolationException $exception) {
            $creator = $owner->creator()->first();

            if ($creator !== null) {
                throw new CreatorAlreadyExists($creator, $exception);
            }

            throw $exception;
        }
    }
}
