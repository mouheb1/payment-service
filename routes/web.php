<?php
use App\Http\Controllers\ProfileController;

use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PaymentController;

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

// Authenticated Routes Group
Route::middleware('auth')->group(function () {
    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Services Page
    Route::get('/services', function () {
        return Inertia::render('Services/Index');
    })->name('services.index');

    // Transactions Page
    Route::get('/transactions', function () {
        return Inertia::render('Transactions/Index');
    })->name('transactions.index');

    // Payment Landing Page
    Route::get('/payment', function () {
        return Inertia::render('Payment/LandingPage');
    })->name('payment.landing');
});

// Services Page
Route::middleware('auth')->get('/services', [ServiceController::class, 'index'])->name('services.index');

// Transactions Page
Route::middleware('auth')->get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');

// Payment Page
Route::middleware('auth')->get('/payment', [PaymentController::class, 'showPaymentForm'])->name('payment.landing');

Route::post('/payment/callback', [PaymentController::class, 'handleCallback'])->name('payment.callback');

Route::post('/payment/process', [PaymentController::class, 'processPayment'])->name('payment.process');

// Include Laravel Breeze or Fortify Authentication Routes
require __DIR__ . '/auth.php';
