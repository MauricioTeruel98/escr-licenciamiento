<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EvaluationCalificatedNotificationSuperAdmin extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $companyName;
    public $subject = 'Evaluación Aprobada';

    public function __construct($user, $companyName)
    {
        $this->user = $user;
        $this->companyName = $companyName;
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';

        return $this->view('emails.evaluation_calificated_super_admin', [
                'user' => $this->user,
                'companyName' => $this->companyName
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