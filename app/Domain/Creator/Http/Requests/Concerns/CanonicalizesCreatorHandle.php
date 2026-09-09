<?php

namespace App\Domain\Creator\Http\Requests\Concerns;

use App\Domain\Creator\Models\Creator;

trait CanonicalizesCreatorHandle
{
    /**
     * Normalize the handle before validation can check its canonical value.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('handle')) {
            $this->merge([
                'handle' => Creator::canonicalizeHandle((string) $this->input('handle')),
            ]);
        }
    }
}
