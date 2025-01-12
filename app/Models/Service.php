<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'price'];

    protected $casts = [
        'price' => 'integer', // Stored as cents
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Accessor: Convert from cents to float (e.g., 12345 => 123.45)
    public function getPriceAttribute($value)
    {
        return $value / 100;
    }

    // Mutator: Convert from float to cents when saving (e.g., 123.45 => 12345)
    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = (int)round($value * 100);
    }
}
