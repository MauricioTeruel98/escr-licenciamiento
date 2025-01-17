<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewAccessRequestNotification extends Notification
{
    use Queueable;

    protected $requestingUser;

    public function __construct($requestingUser)
    {
        $this->requestingUser = $requestingUser;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nueva Solicitud de Acceso')
            ->view('emails.new-access-request', [
                'requestingUser' => $this->requestingUser
            ]);
    }
} 