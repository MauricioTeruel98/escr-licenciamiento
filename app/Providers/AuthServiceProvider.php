<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Certification;
use App\Policies\CertificationPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->configurePolicies();
    }

    protected function configurePolicies()
    {
        $this->policies = [
            Certification::class => CertificationPolicy::class,
        ];
    }
} 