<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        
        'mobile',
        'auth_type',
        'academic_specialization',
        'department_id',
        'academic_degree_id',
        'faculty_id',
        'position_id',
    ];
    public function tokens()
    {
        return $this->hasMany(Token::class);
    }
    public function department() {
        return $this->belongsTo(Department::class);
    }
    public function faculty() {
        return $this->belongsTo(Faculty::class);
    }
    public function academic_degree() {
        return $this->belongsTo(AcademicDegree::class);
    }
    public function position() {
        return $this->belongsTo(Position::class);
    }

    public function activities() {
        return $this->hasMany(KpiActivity::class);
    }
    public function kpiPlans()
    {
        return $this->hasMany(UserKpiPlan::class, 'user_id'); 
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
