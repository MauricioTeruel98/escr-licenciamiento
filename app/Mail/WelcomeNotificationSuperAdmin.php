<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeNotificationSuperAdmin extends Mailable
{
    use Queueable, SerializesModels;

    protected $company;
    public $subject = 'Nuevo Usuario Registrado';

    public function __construct($company)
    {
        $this->company = $company;
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';

        return $this->view('emails.welcome-superadmin', [
                'user' => $this->to[0]['address'],
                'company' => $this->company
            ])
            ->subject($this->subject)
            ->withSwiftMessage(function ($message) use ($messageId) {
                $message->getHeaders()
                    ->addTextHeader('Message-ID', '<' . $messageId . '>')
                    ->remove('References')
                    ->remove('In-Reply-To');
            });
    }
} 