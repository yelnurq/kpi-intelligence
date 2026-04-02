<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['title', 'leader', 'short_name'];

    public function users() {
        return $this->hasMany(User::class);
    }

    public function kpiActivities() {
        return $this->hasManyThrough(KpiActivity::class, User::class);
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }
}
