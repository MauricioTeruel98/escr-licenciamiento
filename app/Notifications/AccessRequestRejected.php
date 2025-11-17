<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccessRequestRejected extends Notification
{
    use Queueable;

    protected $company;

    public function __construct($company)
    {
        $this->company = $company;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Solicitud de Acceso Denegado')
            ->view('emails.request-denied', [
                'user' => $notifiable,
                'company' => $this->company
            ]);
    }
} 