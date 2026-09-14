<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/ready', function () {
    try {
        DB::select('select 1');
    } catch (Throwable) {
        return response()->noContent(503);
    }

    return response()->noContent();
})->name('readiness');
