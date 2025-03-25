<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Company;

class AuthorizeToEvalaution extends Mailable
{
    use Queueable, SerializesModels;

    public $company;
    public $subject = 'Autorización para iniciar evaluación';

    public function __construct($company)
    {
        $this->company = $company;
    }

    public function build()
    {
        return $this->view('emails.authorize_to_evaluation')
                    ->subject('Autorización para Evaluación')
                    ->with([
                        'user' => $this->company->users->where('role', 'admin')->first(),
                        'companyName' => $this->company->name
                    ]);
    }
} 