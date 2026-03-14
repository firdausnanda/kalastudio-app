<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'package_price_id',
        'promo_code_id',
        'subtotal',
        'discount_amount',
        'grand_total',
        'status',
        'xendit_invoice_id',
        'xendit_invoice_url',
        'xendit_recurring_id',
        'next_billing_date',
    ];

    protected $table = "transactions";

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function packagePrice()
    {
        return $this->belongsTo(PackagesPrices::class);
    }

    public function promoCode()
    {
        return $this->belongsTo(PromoCodes::class);
    }
}
