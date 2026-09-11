<?php

use App\Domain\Creator\Enums\CreatorProfileVisibility;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the public-profile fields to the existing Creator aggregate.
     */
    public function up(): void
    {
        Schema::table('creators', function (Blueprint $table): void {
            $table->string('profile_visibility', 16)
                ->default(CreatorProfileVisibility::Private->value)
                ->index();
            $table->jsonb('social_links')->nullable();
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE creators ADD CONSTRAINT creators_profile_visibility_check CHECK (profile_visibility IN ('private', 'public'))");
        }
    }

    /**
     * Remove the profile fields and their PostgreSQL integrity constraint.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE creators DROP CONSTRAINT IF EXISTS creators_profile_visibility_check');
        }

        Schema::table('creators', function (Blueprint $table): void {
            $table->dropIndex(['profile_visibility']);
            $table->dropColumn(['profile_visibility', 'social_links']);
        });
    }
};
