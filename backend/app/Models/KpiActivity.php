<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // 1. Добавь этот импорт
class KpiActivity extends Model
{
use HasFactory;
protected $fillable = ['user_id', 'indicator_id', 'quantity', 'total_points', 'status', 'comment'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function indicator() {
        // Явно указываем 'indicator_id' вторым параметром
        return $this->belongsTo(KpiIndicator::class, 'indicator_id');
    }

    public function evidence() {
        return $this->hasMany(KpiEvidence::class, 'kpi_activity_id'); // Проверь также имя ключа здесь
    }

    protected static function booted()
    {
        static::creating(function ($activity) {
            $indicator = KpiIndicator::find($activity->indicator_id);
            if ($indicator) {
                // Используем weight или points в зависимости от твоей базы
                $activity->total_points = ($indicator->points ?? $indicator->weight ?? 0) * ($activity->quantity ?? 1);
            }
        });
    }
}