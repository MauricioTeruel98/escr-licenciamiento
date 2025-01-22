<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Company;
use Illuminate\Auth\Access\HandlesAuthorization;

class CompanyPolicy
{
    use HandlesAuthorization;

    public function authorize(User $user, Company $company)
    {
        return $user->role === 'super_admin';
    }
} 