<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\GlobalPaymentsService;

class ProviderTransactionController extends Controller
{
    private $paymentService;

    public function __construct(GlobalPaymentsService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function index(Request $request)
    {
        // Extract filters and pagination parameters from the request
        // Filter out empty query parameters
        $filters = array_filter($request->only(['id', 'type', 'channel', 'amount', 'status', 'page', 'page_size']), function ($value) {
            return $value !== null && $value !== '';
        });
        $page = $request->query('page', 1);
        $pageSize = $request->query('page_size', 10);

        // Generate access token
        $token = $this->paymentService->generateAccessToken();

        // Combine filters with pagination parameters
        $queryParams = array_merge($filters, [
            'page' => $page,
            'page_size' => $pageSize,
        ]);

        // Fetch transactions from Global Payments
        $response = $this->paymentService->getProviderTransactions($token, $queryParams);

        // Extract transactions and metadata
        $transactions = $response['transactions'] ?? [];
        $total = $response['total_record_count'] ?? 0;

        // Render the Inertia page with transactions data
        return Inertia::render('Transactions/ProviderIndex', [
            'transactions' => $transactions,
            'total' => $total,
            'currentPage' => $page,
            'pageSize' => $pageSize,
            'filters' => $filters,
        ]);
    }
}
