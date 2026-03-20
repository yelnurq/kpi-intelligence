<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KpiIndicator extends Model
{
    protected $fillable = ['category', 'title', 'points', 'desc', 'difficulty', 'year'];
    public function activities()
    {
        return $this->hasMany(KpiActivity::class);
    }
    }
