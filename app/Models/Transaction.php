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
        'amount',
        'status',
        'authorization_id',   // New
        'capture_id',         // New
        'capture_mode',       // New
        'final_amount',       // New
    ];

    protected $casts = [
        'amount' => 'float',
        'final_amount' => 'float', // Ensure final_amount is cast to float
    ];

    protected $attributes = [
        'status' => 'pending',
        'capture_mode' => 'MANUAL', // Default if you prefer
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
