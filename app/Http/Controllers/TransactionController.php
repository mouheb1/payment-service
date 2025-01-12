<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Transaction;
use App\Services\GlobalPaymentsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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


    public function createTransaction(Request $request, GlobalPaymentsService $paymentService)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'amount' => 'required|numeric',
        ]);

        $service = Service::findOrFail($request->service_id);

        $token = $paymentService->generateAccessToken();

        $payload = [
            "account_name" => "Transaction_Processing",
            "type" => "SALE",
            "channel" => "CNP",
            "amount" => intval($request->amount * 100),
            "currency" => "EUR",
            "reference" => "txn_" . uniqid(),
            "capture_mode" => "LATER",
            "payment_method" => [
                "name" => "John Doe",
                "entry_mode" => "ECOM",
                "card" => [
                    "number" => "4263970000005262", // Replace with real data
                    "expiry_month" => "05",
                    "expiry_year" => "25",
                    "cvv" => "852",
                ],
            ],
        ];

        $response = $paymentService->createTransaction($token, $payload);

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'service_id' => $service->id,
            'transaction_id' => $response['id'],
            'authorization_id' => $response['id'],
            'amount' => $request->amount,
            'currency' => $response['currency'] ?? 'EUR',
            'status' => $response['status'],
            'capture_mode' => $response['capture_mode'],
            'reference' => $response['reference'],
            'merchant_id' => $response['merchant_id'],
            'payer_id' => $response['payer']['id'] ?? null,
            'payment_method_id' => $response['payment_method']['id'] ?? null,
            'payment_method_data' => $response['payment_method'] ?? [],
        ]);

        return response()->json(['success' => true, 'transaction' => $transaction]);
    }

    /**
     * Tokenize the user's card and store the Payment Method ID
     */
    public function tokenizeCard(Request $request, GlobalPaymentsService $paymentService)
    {
        $request->validate([
            'number' => 'required',
            'expiry_month' => 'required',
            'expiry_year' => 'required',
            'cvv' => 'required',
        ]);

        try {
            $token = $paymentService->generateAccessToken();

            $payload = [
                "reference" => "UserCard_" . Auth::id(),
                "usage_mode" => "MULTIPLE",
                "card" => [
                    "number" => $request->number,
                    "expiry_month" => $request->expiry_month,
                    "expiry_year" => $request->expiry_year,
                    "cvv" => $request->cvv
                ]
            ];

            $response = $paymentService->tokenizeCard($token, $payload);

            // You might store this in the user's profile or a PaymentMethod model
            // For simplicity, we'll return it to the frontend
            return response()->json(['success' => true, 'payment_method_id' => $response['id']]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
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
                    "avs_address" => "Flat 123",     // Optional
                    "avs_postal_code" => "50001",    // Optional
                ]
            ]
        ];

        try {
            $response = $paymentService->createTransaction($token, $payload);

            // Store the transaction with status = 'authorized' (or 'pending')
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'service_id' => $service->id,
                'transaction_id' => $response['id'],  // TRN_xxx
                'authorization_id' => $response['id'],
                'amount' => $request->amount,
                'status' => $response['status'], // "AUTHORIZED" or "PREAUTHORIZED"
                'capture_mode' => $response['capture_mode'] ?? 'LATER',
                'currency' => $response['currency'] ?? 'EUR',
                'reference' => $response['reference'] ?? null,
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
            'amount' => 'required|numeric',
        ]);

        $token = $paymentService->generateAccessToken();

        // We do a capture on the same transaction ID
        $payload = [
            "amount" => $request->amount,
        ];

        try {
            $response = $paymentService->captureTransaction($token, $transaction->authorization_id, $payload);

            $transaction->update([
                'capture_id' => $response['id'],
                'final_amount' => $response['amount'],
                'status' => 'captured',
            ]);

            return response()->json(['success' => true, 'transaction' => $transaction]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
