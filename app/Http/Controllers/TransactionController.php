<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Transaction;
use App\Services\GlobalPaymentsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Display the user's transactions.
     */
    public function index()
    {
        $transactions = Transaction::with('service')
            ->where('user_id', Auth::id())
            ->orderByDesc('id')
            ->get();

        return inertia('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Pre-authorize (create) a transaction with card details, but do NOT finalize.
     */
    public function preauthorizeTransaction(Request $request, GlobalPaymentsService $paymentService)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'amount' => 'required|numeric',
            'name' => 'required',
            'number' => 'required',
            'expiry_month' => 'required',
            'expiry_year' => 'required',
            'cvv' => 'required',
        ]);

        $service = Service::findOrFail($request->service_id);

        $token = $paymentService->generateAccessToken();

        // "SALE" with capture_mode=LATER -> Preauthorization
        $payload = [
            "account_name" => "pay_link_hpp",
            "type" => "SALE",
            "channel" => "CNP",
            "capture_mode" => "LATER",
            "amount" => $request->amount,
            "currency" => "EUR",
            "reference" => "txn_" . uniqid(),
            "country" => "DE", // or your actual country code
            "payment_method" => [
                "name" => $request->name,
                "entry_mode" => "ECOM",
                "card" => [
                    "number"       => $request->number,
                    "expiry_month" => $request->expiry_month,
                    "expiry_year"  => $request->expiry_year,
                    "cvv"          => $request->cvv,
                    "cvv_indicator" => "PRESENT",
                    "avs_address" => "",     // Optional
                    "avs_postal_code" => "",    // Optional
                ]
            ]
        ];

        try {
            $response = $paymentService->createTransaction($token, $payload);

            // Store the transaction with the necessary fields
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'service_id' => $service->id,
                'transaction_id' => $response['id'], // TRN_xxx
                'authorization_id' => $response['id'],
                'amount' => $request->amount,
                'status' => $response['status'], // "AUTHORIZED" or "PREAUTHORIZED"
                'capture_mode' => $response['capture_mode'] ?? 'LATER',
                'currency' => $response['currency'] ?? 'EUR',
                'reference' => $response['reference'] ?? null,
                'country' => $payload['country'], // Included from payload
                'merchant_id' => config('services.globalpayments.merchant_id'), // From .env or services.php
                'payer_id' => Auth::id(), // Connected user
                'payment_method_id' => 'ONLINE_PAYMENT', // Static value
            ]);

            return response()->json(['success' => true, 'transaction' => $transaction]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Finalize (Capture) a preauthorized transaction
     */
    public function captureTransaction(Request $request, $transactionId, GlobalPaymentsService $paymentService)
    {
        $transaction = Transaction::where('transaction_id', $transactionId)->firstOrFail();

        $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $token = $paymentService->generateAccessToken();

        // Convert amount to integer (cents)
        $amountInCents = (int) round($request->amount);

        // Capture on the same transaction ID
        $payload = [
            "amount" => $amountInCents,
        ];

        try {
            $response = $paymentService->captureTransaction($token, $transaction->authorization_id, $payload);

            // Update transaction with final details
            $transaction->update([
                'capture_id' => $response['id'],
                'final_amount' => (int) $response['amount'], // Parse to integer
                'status' => 'CAPTURED',
            ]);

            return response()->json(['success' => true, 'transaction' => $transaction]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    
}
