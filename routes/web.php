<?php

use App\Http\Controllers\ProfileController;

use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProviderTransactionController;
use App\Models\Service;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes (Accessible without authentication)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard Route (Accessible to authenticated users)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Services List
    Route::get('/services', 'App\Http\Controllers\ServiceController@index')
        ->name('services.index');

    // Transactions List
    Route::get('/transactions', [TransactionController::class, 'index'])
        ->name('transactions.index');

    // 1. Show Card Entry Form (preauthorize)
    Route::get('/transactions/preauthorize-form/{serviceId}', function ($serviceId) {
        $service = Service::findOrFail($serviceId);
        return Inertia::render('Transactions/PreAuthorizeTransaction', [
            'service' => $service,
        ]);
    })->name('transactions.preauthorizeForm');

    // 2. Show Capture Form for finalizing
    Route::get('/transactions/finalize-form/{transactionId}', function ($transactionId) {
        // We’ll fetch transaction in the controller or pass minimal data here
        return Inertia::render('Transactions/FinalizeTransaction', [
            'transactionId' => $transactionId,
        ]);
    })->name('transactions.finalizeForm');

    // 3. Preauthorize Transaction (POST)
    Route::post('/transactions/preauthorize', [TransactionController::class, 'preauthorizeTransaction'])
        ->name('transactions.preauthorize');

    // 4. Capture Transaction (POST)
    Route::post('/transactions/{transactionId}/capture', [TransactionController::class, 'captureTransaction'])
        ->name('transactions.capture');

    Route::get('/provider-transactions', [ProviderTransactionController::class, 'index'])->name('provider.transactions.index');
});



// Include Laravel Breeze or Fortify Authentication Routes
require __DIR__ . '/auth.php';
