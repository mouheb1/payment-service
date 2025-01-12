<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use GlobalPayments\Api\ServiceConfigs\Gateways\GpEcomConfig;
use GlobalPayments\Api\Services\HostedService;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Show the payment page.
     */
    public function showPaymentForm()
    {
        return Inertia::render('Payment/LandingPage');
    }

    /**
     * Generate HPP JSON.
     */
    public function getHppJson(Request $request)
    {
        $config = new GpEcomConfig();
        $config->merchantId = config('services.globalpayments.merchant_id');
        $config->accountId = config('services.globalpayments.account_id', 'internet');
        $config->sharedSecret = config('services.globalpayments.shared_secret');
        $config->serviceUrl = "https://pay.sandbox.realexpayments.com/pay";

        $service = new HostedService($config);

        $timestamp = now()->format('YmdHis');
        $orderId = uniqid();
        $amount = intval($request->amount * 100); // Convert to cents
        $currency = 'EUR';

        // Calculate SHA1HASH
        $hashString = "$timestamp.{$config->merchantId}.$orderId.$amount.$currency";
        $sha1Hash = sha1(sha1($hashString) . '.' . $config->sharedSecret);

        try {
            $hppJson = [
                'MERCHANT_ID' => $config->merchantId,
                'ACCOUNT' => $config->accountId,
                'ORDER_ID' => $orderId,
                'AMOUNT' => $amount,
                'CURRENCY' => $currency,
                'TIMESTAMP' => $timestamp,
                'AUTO_SETTLE_FLAG' => '1',
                'HPP_VERSION' => '2',
                'SHA1HASH' => $sha1Hash,
            ];

            return response()->json(['hppJson' => $hppJson]);
        } catch (\Exception $e) {
            Log::error('Error generating HPP JSON', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to generate HPP JSON.'], 500);
        }
    }

    /**
     * Handle callback from HPP.
     */
    public function handleCallback(Request $request)
    {
        $response = $request->all();
        Log::info('HPP Callback Response', $response);

        // Validate the response SHA1HASH here if needed.

        return redirect()->route('transactions.index')->with('status', 'Payment processed successfully.');
    }
}
