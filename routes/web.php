<?php

use App\Http\Controllers\ProfileController;

use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PaymentController;
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

    // Services
    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');

    Route::post('/transactions/tokenize', [TransactionController::class, 'tokenizeCard'])
        ->name('transactions.tokenize');

    Route::post('/transactions/create', [TransactionController::class, 'createTransaction'])
        ->name('transactions.create');

    Route::post('/transactions/{transactionId}/capture', [TransactionController::class, 'captureTransaction'])
        ->name('transactions.capture');

    // Show form for creating a transaction (select a service, etc.)
    Route::get('/transactions/create-form', function () {
        // Pass the list of services to the page
        $services = Service::all();
        return Inertia::render('Services/CreateTransaction', [
            'services' => $services,
        ]);
    })->name('transactions.createForm');

    // API routes
    Route::post('/transactions/tokenize', [TransactionController::class, 'tokenizeCard'])->name('transactions.tokenize');
    Route::post('/transactions/create', [TransactionController::class, 'createTransaction'])->name('transactions.create');
    Route::post('/transactions/{transactionId}/capture', [TransactionController::class, 'captureTransaction'])->name('transactions.capture');
});



// Include Laravel Breeze or Fortify Authentication Routes
require __DIR__ . '/auth.php';
