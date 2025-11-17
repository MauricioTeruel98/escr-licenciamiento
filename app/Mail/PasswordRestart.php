<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordRestart extends Mailable
{
    use Queueable, SerializesModels;

    public $subject = 'Contraseña Restablecida';

    public function __construct()
    {
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';

        return $this->view('emails.password-restart', [
                'email' => $this->to[0]['address']
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