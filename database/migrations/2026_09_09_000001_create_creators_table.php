<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('creators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('handle', 30);
            $table->string('display_name', 100);
            $table->text('bio')->nullable();
            $table->timestamps();
        });

        DB::statement('CREATE UNIQUE INDEX creators_handle_lower_unique ON creators (lower(handle))');

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE creators ADD CONSTRAINT creators_handle_lowercase_check CHECK (handle = lower(handle))');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creators');
    }
};
