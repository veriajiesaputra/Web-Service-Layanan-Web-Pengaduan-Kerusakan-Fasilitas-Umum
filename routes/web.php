<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

// Public citizen portal (pengguna as source of truth)
Route::get('/', [PageController::class, 'pengguna'])->name('pengguna');
Route::get('/pengguna', [PageController::class, 'pengguna']);
Route::get('/warga', [PageController::class, 'pengguna'])->name('warga');

// Admin panel (dasbor)
Route::get('/admin', [PageController::class, 'dasbor'])->name('dasbor');
Route::get('/dasbor', [PageController::class, 'dasbor']);
