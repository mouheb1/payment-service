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
        $this->baseUrl = config('services.globalpay.base_url');
        $this->appId = config('services.globalpay.app_id');
        $this->appKey = config('services.globalpay.app_key');
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
     * Tokenize Card
     */
    public function tokenizeCard($token, array $payload)
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'Content-Type' => 'application/json',
            'X-GP-Version' => '2021-03-22',
        ])->post("{$this->baseUrl}/payment-methods", $payload);

        if ($response->failed()) {
            throw new \Exception('Failed to tokenize card: ' . $response->body());
        }

        return $response->json(); // { id: "PMT_xxx", ... }
    }


    /**
     * Create Payment Link (already existing in your code)
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

    /**
     * Authorize a transaction (SALE with capture_mode=LATER)
     */
    public function authorizeSale($token, array $payload)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-GP-Version' => '2021-03-22',
        ])->withToken($token)
            ->post("{$this->baseUrl}/transactions", $payload);

        if ($response->failed()) {
            throw new \Exception('Failed to authorize sale: ' . $response->body());
        }

        return $response->json(); // e.g. { id: 'TRN_...', status: 'AUTHORIZED', ... }
    }

    /**
     * Capture an authorized transaction
     */
    public function captureSale($token, string $authorizationId, array $payload = [])
    {
        $endpoint = "{$this->baseUrl}/transactions/{$authorizationId}/capture";
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-GP-Version' => '2021-03-22',
        ])->withToken($token)
            ->post($endpoint, $payload);

        if ($response->failed()) {
            throw new \Exception('Failed to capture sale: ' . $response->body());
        }

        return $response->json();
    }

    public function createTransaction($token, $data)
    {
        // Debug: Echo the token and payload
        // echo "Token: $token\n";
        // echo "Payload: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
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
        echo "Token: $token\n";
        echo "Payload: " . json_encode($data, $transactionId) . "\n";
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
}
