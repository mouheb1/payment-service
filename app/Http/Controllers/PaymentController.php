<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use GlobalPayments\Api\Entities\Transaction;
use GlobalPayments\Api\PaymentMethods\CreditCardData;
use GlobalPayments\Api\Exceptions\ApiException;

class PaymentController extends Controller
{
    /**
     * Show the payment page.
     */
    public function showPaymentForm()
    {
        return Inertia::render('Payment/LandingPage', [
            'globalPaymentsConfig' => [
                'appId' => env('GLOBALPAYMENTS_APP_ID'),
                'appKey' => env('GLOBALPAYMENTS_APP_KEY'),
            ],
        ]);
    }

    public function handleCallback(Request $request)
    {
        // Capture payment status from the request
        $status = $request->input('status');
        $transactionId = $request->input('transactionId');

        // Update the database (e.g., mark transaction as paid)
        // You can also handle specific statuses like success, failure, etc.

        // Redirect to a success or failure page
        return redirect()->route('transactions.index')->with('status', $status);
    }

    public function processPayment(Request $request)
    {
        $request->validate([
            'card_number' => 'required|string',
            'expiry_month' => 'required|numeric|between:1,12',
            'expiry_year' => 'required|numeric|min:' . now()->year,
            'cvv' => 'required|string|min:3|max:4',
            'cardholder_name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
        ]);

        $card = new CreditCardData();
        $card->number = $request->card_number;
        $card->expMonth = $request->expiry_month;
        $card->expYear = $request->expiry_year;
        $card->cvn = $request->cvv;
        $card->cardHolderName = $request->cardholder_name;

        try {
            $response = $card->charge($request->amount)
                ->withCurrency("EUR")
                ->execute();

            Transaction::create([
                'user_id' => auth()->id(),
                'service_id' => $request->service_id ?? null,
                'transaction_id' => $response->transactionId,
                'amount' => $request->amount,
                'status' => $response->responseCode,
            ]);

            return response()->json([
                'success' => true,
                'message' => $response->responseMessage,
            ]);
        } catch (ApiException $e) {
            logger()->error("Payment failed: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Payment failed. Please try again later.',
            ], 400);
        }
    }
}
