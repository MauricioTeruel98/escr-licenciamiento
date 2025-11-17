<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TestMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject = 'Correo de Prueba';

    public function __construct()
    {
        //
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';

        return $this->view('emails.test')
            ->subject($this->subject)
            ->withSwiftMessage(function ($message) use ($messageId) {
                $message->getHeaders()
                    ->addTextHeader('Message-ID', '<' . $messageId . '>')
                    ->remove('References')
                    ->remove('In-Reply-To');
            });
    }
} 