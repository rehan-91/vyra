<?php

namespace App\Domain\Creator\Models;

use App\Models\User;
use Database\Factories\CreatorFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $user_id
 * @property string $handle
 * @property string $display_name
 * @property string|null $bio
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $owner
 */
#[Fillable(['handle', 'display_name', 'bio'])]
class Creator extends Model
{
    /** @use HasFactory<CreatorFactory> */
    use HasFactory;

    /**
     * Create a factory instance for the domain-local model.
     */
    protected static function newFactory(): CreatorFactory
    {
        return CreatorFactory::new();
    }

    /**
     * Canonicalize a Creator handle before it reaches persistence.
     */
    public static function canonicalizeHandle(string $handle): string
    {
        return Str::lower(trim($handle));
    }

    /**
     * Keep the stored Creator handle in its canonical lowercase form.
     *
     * @return Attribute<string, string>
     */
    protected function handle(): Attribute
    {
        return Attribute::make(
            set: fn (string $value): string => self::canonicalizeHandle($value),
        );
    }

    /**
     * Get the user that authoritatively owns this creator identity.
     *
     * @return BelongsTo<User, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
