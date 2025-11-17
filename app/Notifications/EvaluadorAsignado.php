<?php

namespace App\Notifications;

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

    public function __construct(User $evaluador, Company $company)
    {
        $this->evaluador = $evaluador;
        $this->company = $company;
    }

    public function build()
    {
        return $this->subject('Organismo Evaluador Asignado')
                    ->view('emails.evaluador-asignado')
                    ->with([
                        'evaluador' => $this->evaluador,
                        'company' => $this->company
                    ]);
    }
}
