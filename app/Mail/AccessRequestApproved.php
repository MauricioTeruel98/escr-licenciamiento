<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccessRequestApproved extends Mailable
{
    use Queueable, SerializesModels;

    protected $company;
    public $subject = 'Solicitud de Acceso Aprobado';

    public function __construct($company)
    {
        $this->company = $company;
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';

        return $this->view('emails.request-approved', [
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