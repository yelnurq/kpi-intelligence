<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KpiActivity extends Model
{
    protected $fillable = ['user_id', 'indicator_id', 'quantity', 'total_points', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function indicator() {
        return $this->belongsTo(KpiIndicator::class);
    }

    public function evidence() {
        return $this->hasMany(KpiEvidence::class);
    }

    protected static function booted()
    {
        static::creating(function ($activity) {
            $indicator = KpiIndicator::find($activity->indicator_id);
            $activity->total_points = $indicator->weight * $activity->quantity;
        });
    }
}