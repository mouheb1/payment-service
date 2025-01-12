<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display the user's transactions.
     */
    public function index()
    {
        // Fetch user-specific transactions
        $transactions = Transaction::with('service')
            ->where('user_id', Auth::id())
            ->get();

        // Pass data to the frontend
        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }
}
