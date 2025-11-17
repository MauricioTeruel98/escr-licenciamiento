<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EvaluadorNotificacion extends Mailable
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
        return $this->subject('Nueva Empresa Asignada')
                    ->view('emails.evaluador-asignado-a-empresa')
                    ->with([
                        'evaluador' => $this->evaluador,
                        'company' => $this->company
                    ]);
    }
}
