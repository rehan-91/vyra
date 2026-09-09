<?php

use App\Domain\Creator\Http\Controllers\CreatorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::prefix('creator')->name('creator.')->group(function () {
        Route::get('/', [CreatorController::class, 'show'])->name('show');
        Route::get('create', [CreatorController::class, 'create'])->name('create');
        Route::post('/', [CreatorController::class, 'store'])->name('store');
        Route::get('{creator}/manage', [CreatorController::class, 'manage'])->name('manage');
        Route::patch('{creator}', [CreatorController::class, 'update'])->name('update');
        Route::delete('{creator}', [CreatorController::class, 'destroy'])->name('destroy');
    });

    Route::post('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
