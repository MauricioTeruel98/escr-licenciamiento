<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AutoEvaluationResults extends Mailable
{
    use Queueable, SerializesModels;

    protected $pdfPath;

    public function __construct($pdfPath)
    {
        $this->pdfPath = $pdfPath;
    }

    public function build()
    {
        return $this->view('emails.autoevaluation')
                    ->subject('Resultados de su Autoevaluación')
                    ->attach($this->pdfPath, [
                        'as' => 'resultados_autoevaluacion.pdf',
                        'mime' => 'application/pdf',
                    ]);
    }
} 