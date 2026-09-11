<?php

namespace Database\Factories;

use App\Domain\Creator\Enums\CreatorProfileVisibility;
use App\Domain\Creator\Models\Creator;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Creator>
 */
class CreatorFactory extends Factory
{
    /** @var class-string<Creator> */
    protected $model = Creator::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $handle = Str::lower(fake()->unique()->bothify('creator_##??'));

        return [
            'user_id' => User::factory(),
            'handle' => $handle,
            'display_name' => fake()->name(),
            'bio' => fake()->optional()->paragraph(),
            'profile_visibility' => CreatorProfileVisibility::Private,
            'social_links' => null,
        ];
    }

    /**
     * Indicate that the creator profile is publicly available.
     */
    public function public(): static
    {
        return $this->state(fn (): array => [
            'profile_visibility' => CreatorProfileVisibility::Public,
        ]);
    }
}
