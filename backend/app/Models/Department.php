<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['title', 'dean', 'short_name', 'short_title'];

    public function users() {
        return $this->hasMany(User::class);
    }

    public function kpiActivities() {
        return $this->hasManyThrough(KpiActivity::class, User::class);
    }
}
