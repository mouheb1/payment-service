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
        'authorization_id',
        'capture_id',
        'amount',
        'final_amount',
        'status',
        'capture_mode',
        'currency',
        'country',
        'reference',
        'merchant_id',
        'payer_id',
        'payment_method_id',
        'payment_method_data',
    ];

    protected $casts = [
        'amount' => 'integer', // Stored in cents
        'final_amount' => 'integer', // Stored in cents
        'payment_method_data' => 'json',
    ];

    protected $attributes = [
        'status' => 'pending',
        'capture_mode' => 'LATER',
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
