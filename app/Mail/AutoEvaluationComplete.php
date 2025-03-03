<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Company;

class AutoEvaluationComplete extends Mailable
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
        return $this->view('emails.autoevaluationcomplete')
                    ->subject('Autoevaluación completada de la empresa ' . $this->company->name)
                    ->with([
                        'company' => $this->company
                    ]);
    }
} 