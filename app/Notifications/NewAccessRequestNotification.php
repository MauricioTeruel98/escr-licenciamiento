<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewAccessRequestNotification extends Notification
{
    use Queueable;

    protected $requestingUser;
    protected $company;
    public $subject = 'Nueva solicitud de acceso';

    public function __construct($requestingUser, $company)
    {
        $this->requestingUser = $requestingUser;
        $this->company = $company;
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
                'requestingUser' => $this->requestingUser,
                'company' => $this->company
            ]);
    }
} 