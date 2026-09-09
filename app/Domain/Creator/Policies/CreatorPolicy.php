<?php

namespace App\Domain\Creator\Policies;

use App\Domain\Creator\Models\Creator;
use App\Models\User;

class CreatorPolicy
{
    /**
     * Determine whether the user can create a creator identity.
     */
    public function create(User $user): bool
    {
        return ! $user->creator()->exists();
    }

    /**
     * Determine whether the user can view private creator management resources.
     */
    public function view(User $user, Creator $creator): bool
    {
        return $creator->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the creator identity.
     */
    public function update(User $user, Creator $creator): bool
    {
        return $this->view($user, $creator);
    }

    /**
     * Determine whether the user can delete the creator identity.
     */
    public function delete(User $user, Creator $creator): bool
    {
        return $this->view($user, $creator);
    }
}
