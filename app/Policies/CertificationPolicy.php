<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Certification;

class CertificationPolicy
{
    public function update(User $user, Certification $certification)
    {
        return $user->company_id === $certification->company_id;
    }

    public function delete(User $user, Certification $certification)
    {
        return $user->company_id === $certification->company_id;
    }
} 