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
        return $this->markdown('emails.test')
            ->subject($this->subject);
    }
} 