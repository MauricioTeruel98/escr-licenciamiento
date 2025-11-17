<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EvaluadorAsignado extends Mailable
{
    use Queueable, SerializesModels;

    public $evaluador;
    public $company;
    public $subject = 'Organismo Evaluador Asignado';

    public function __construct(User $evaluador, Company $company)
    {
        $this->evaluador = $evaluador;
        $this->company = $company;
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';

        return $this->view('emails.evaluador-asignado')
            ->with([
                'evaluador' => $this->evaluador,
                'company' => $this->company
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