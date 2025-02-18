<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Company;

class AutoEvaluationResults extends Mailable
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
        return $this->view('emails.autoevaluation')
                    ->subject('Resultados de su Autoevaluación')
                    ->with([
                        'company' => $this->company
                    ])
                    ->attach($this->pdfPath, [
                        'as' => 'resultados_autoevaluacion.pdf',
                        'mime' => 'application/pdf',
                    ]);
    }
} 