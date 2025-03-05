<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Company;

class EvaluationResultsSuperAdmin extends Mailable
{
    use Queueable, SerializesModels;

    protected $pdfPath;
    public $company;

    public function __construct($pdfPath, $company)
    {
        $this->pdfPath = $pdfPath;
        $this->company = $company;
    }

    public function build()
    {
        return $this->view('emails.evaluation_calificated_super_admin')
                    ->subject('Resultados de la Evaluación')
                    ->with([
                        'user' => $this->company->users->where('role', 'admin')->first(),
                        'companyName' => $this->company->name
                    ])
                    ->attach($this->pdfPath, [
                        'as' => 'resultados_evaluacion.pdf',
                        'mime' => 'application/pdf',
                    ]);
    }
} 