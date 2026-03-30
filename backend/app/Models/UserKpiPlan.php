<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; 
class UserKpiPlan extends Model
{
    use HasFactory;
protected $table = 'user_kpi_plans';    
protected $fillable = [
        "kpi_indicator_id","academic_year","user_id", "deadline"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function indicator()
    {
        return $this->belongsTo(KpiIndicator::class, 'kpi_indicator_id');
    }
public function activities()
{
    return $this->hasMany(KpiActivity::class, 'indicator_id', 'kpi_indicator_id')
                // Используем whereColumn вместо $this->user_id
                ->whereColumn('user_id', 'user_kpi_plans.user_id');
}
protected $casts = [
    'deadline' => 'date',
];

}
