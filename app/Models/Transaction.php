<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Transaction extends Model
{
    use LogsActivity;

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
        'reference_id',
        'checkout_url',
        'payment_method',
        'payment_bank',
        'va_number',
        'qr_code_url',
        'payment_expired_at',
    ];

    protected $casts = [
        'payment_expired_at' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'grand_total', 'subtotal']);
    }


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
