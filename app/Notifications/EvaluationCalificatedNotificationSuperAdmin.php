<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EvaluationCalificatedNotificationSuperAdmin extends Notification
{
    use Queueable;

    protected $user;
    protected $companyName;

    public function __construct($user, $companyName)
    {
        $this->user = $user;
        $this->companyName = $companyName;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Evaluación calificada')
            ->view('emails.evaluation_calificated_super_admin', [
                'user' => $this->user,
                'companyName' => $this->companyName
            ]);
    }
} 