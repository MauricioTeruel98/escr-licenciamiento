<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\CustomResetPasswordNotification;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'lastname',
        'id_number',
        'phone',
        'email',
        'password',
        'role',
        'company_id',
        'status',
        'form_sended'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
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
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getRoleAttribute()
    {
        return $this->attributes['role'] ?? 'user';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function toArray()
    {
        $array = parent::toArray();
        $array['role'] = $this->role;
        $array['auto_evaluation_status'] = $this->company?->autoEvaluationStatus() ?? 'en_proceso';
        return $array;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function aptoForEvaluation(): bool
    {
        if (!$this->company) {
            return false;
        }
        
        // Verificar que la empresa tenga una auto-evaluación completada y aprobada
        return $this->company->autoEvaluationStatus === 'apto';
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPasswordNotification($token));
    }
}
