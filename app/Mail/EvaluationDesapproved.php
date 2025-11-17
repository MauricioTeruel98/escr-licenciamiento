<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Company;

class EvaluationDesapproved extends Mailable
{
    use Queueable, SerializesModels;

    public $company;
    public $subject = 'Evaluación No Aprobada';

    public function __construct($company)
    {
        $this->company = $company;
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';

        return $this->view('emails.evaluation_desapproved')
            ->subject($this->subject)
            ->withSwiftMessage(function ($message) use ($messageId) {
                $message->getHeaders()
                    ->addTextHeader('Message-ID', '<' . $messageId . '>')
                    ->remove('References')
                    ->remove('In-Reply-To');
            })
            ->with([
                'user' => $this->company->users->where('role', 'admin')->first(),
                'companyName' => $this->company->name
            ]);
    }
}
