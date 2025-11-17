<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewAccessRequestNotification extends Mailable
{
    use Queueable, SerializesModels;

    protected $requestingUser;
    protected $company;
    public $subject = 'Nueva Solicitud de Acceso';

    public function __construct($requestingUser, $company)
    {
        $this->requestingUser = $requestingUser;
        $this->company = $company;
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';

        return $this->view('emails.new-access-request', [
                'requestingUser' => $this->requestingUser,
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