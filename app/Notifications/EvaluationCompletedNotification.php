<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EvaluationCompletedNotification extends Notification
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
            ->subject('Evaluación Completada')
            ->view('emails.evaluation_completed', [
                'user' => $this->user,
                'companyName' => $this->companyName
            ]);
    }
} 