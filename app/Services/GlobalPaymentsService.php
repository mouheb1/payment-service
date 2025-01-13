<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GlobalPaymentsService
{
    protected $baseUrl;
    protected $appId;
    protected $appKey;

    public function __construct()
    {
        $this->baseUrl = config('services.globalpayments.base_url');
        $this->appId = config('services.globalpayments.app_id');
        $this->appKey = config('services.globalpayments.app_key');
    }

    /**
     * Generate Access Token
     */
    public function generateAccessToken()
    {
        $nonce = Str::random(16);
        $secret = hash('sha512', $nonce . $this->appKey);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-GP-Version' => '2021-03-22',
        ])->post("{$this->baseUrl}/accesstoken", [
            'app_id' => $this->appId,
            'nonce' => $nonce,
            'secret' => $secret,
            'grant_type' => 'client_credentials',
        ]);

        if ($response->failed()) {
            throw new \Exception('Failed to generate access token: ' . $response->body());
        }

        return $response->json('token');
    }

    /**
     * Create Payment Link (maybe delete this method)
     */
    public function createPaymentLink($token, $data)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-GP-Version' => '2021-03-22',
        ])->withToken($token)
            ->post("{$this->baseUrl}/links", $data);

        if ($response->failed()) {
            throw new \Exception('Failed to create payment link: ' . $response->body());
        }

        return $response->json();
    }

    public function createTransaction($token, $data)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-GP-Version' => '2021-03-22',
        ])->withToken($token)->post("{$this->baseUrl}/transactions", $data);

        if ($response->failed()) {
            throw new \Exception('Failed to create transaction: ' . $response->body());
        }

        return $response->json();
    }

    public function captureTransaction($token, $transactionId, $data)
    {
        // echo "Token: $token\n";
        // echo "Payload: " . json_encode($data, $transactionId) . "\n";
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-GP-Version' => '2021-03-22',
        ])->withToken($token)->post("{$this->baseUrl}/transactions/{$transactionId}/capture", $data);

        if ($response->failed()) {
            throw new \Exception('Failed to capture transaction: ' . $response->body());
        }

        return $response->json();
    }

    public function getProviderTransactions($token, $query = [])
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-GP-Version' => '2021-03-22',
        ])->withToken($token)->get("{$this->baseUrl}/transactions", $query);

        if ($response->failed()) {
            throw new \Exception('Failed to fetch provider transactions: ' . $response->body());
        }

        return $response->json();
    }

    public function getProviderTransactionDetails($token, $transactionId)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-GP-Version' => '2021-03-22',
        ])->withToken($token)->get("{$this->baseUrl}/transactions/{$transactionId}");

        if ($response->failed()) {
            throw new \Exception('Failed to fetch transaction details: ' . $response->body());
        }

        return $response->json();
    }
}
