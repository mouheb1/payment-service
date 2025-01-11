<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the user's transactions.
     */
    public function index()
    {
        // Fetch transactions for the authenticated user
        $transactions = Transaction::with('service')
            ->where('user_id', Auth::id())
            ->get();

        // Pass data to the Transactions page
        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }
}
