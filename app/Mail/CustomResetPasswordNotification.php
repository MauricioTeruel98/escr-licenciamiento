<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\URL;

class CustomResetPasswordNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $subject = 'Restablecer Contraseña';

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';
        $email = $this->to[0]['address'];

        return $this->view('emails.reset-password', [
                'resetUrl' => url(route('password.reset', [
                    'token' => $this->token,
                    'email' => $email,
                ], false)),
                'user' => $this->to[0]['address']
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