<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserKpiPlan extends Model
{
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
protected $casts = [
    'deadline' => 'date',
];

}
