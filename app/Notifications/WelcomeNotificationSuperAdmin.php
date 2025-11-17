<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotificationSuperAdmin extends Notification
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
            ->subject(' Nuevo Usuario Registrado')
            ->view('emails.welcome-superadmin', [
                'user' => $notifiable,
                'company' => $this->company
            ]);
    }
} 