<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_id',
        'transaction_id',
        'authorization_id',   // To store the authorization ID from the API
        'capture_id',         // To store the capture ID (if applicable)
        'amount',             // Initial transaction amount
        'final_amount',       // Adjusted final amount after capture
        'status',             // Status of the transaction (pending, captured, etc.)
        'capture_mode',       // Mode of capture (AUTO, LATER)
        'currency',           // Transaction currency
        'country',            // Country associated with the transaction
        'reference',          // Reference field for the transaction
        'merchant_id',        // Merchant ID associated with the transaction
        'payer_id',           // Payer's ID returned by the API
        'payment_method_id',  // Stored payment method ID
        'payment_method_data', // JSON field to store payment method details
    ];

    protected $casts = [
        'amount' => 'float',
        'final_amount' => 'float',
        'payment_method_data' => 'json', // Cast payment method details as JSON
    ];

    protected $attributes = [
        'status' => 'pending',     // Default transaction status
        'capture_mode' => 'LATER', // Default capture mode
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
