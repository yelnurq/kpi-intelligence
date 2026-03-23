<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class KpiEvidence extends Model
{
    protected $fillable = ['kpi_activity_id', 'file_name', 'file_path', 'file_type'];

    // Добавляем виртуальное поле url для фронтенда
    protected $appends = ['file_url'];

    public function activity()
    {
        return $this->belongsTo(KpiActivity::class, 'kpi_activity_id');
    }

    public function getFileUrlAttribute()
    {
        return $this->file_path ? Storage::disk('public')->url($this->file_path) : null;
    }
}