<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserKpiPlan extends Model
{
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
    // Связываем план с активностями через индикатор и пользователя
    return $this->hasMany(KpiActivity::class, 'indicator_id', 'kpi_indicator_id')
                ->where('user_id', $this->user_id);
}
protected $casts = [
    'deadline' => 'date',
];

}
