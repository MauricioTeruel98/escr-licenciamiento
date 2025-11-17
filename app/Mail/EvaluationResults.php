<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Company;

class EvaluationResults extends Mailable
{
    use Queueable, SerializesModels;

    protected $pdfPath;
    public $company;
    public $subject = 'Evaluación Aprobada';

    public function __construct($pdfPath, $company)
    {
        $this->pdfPath = $pdfPath;
        $this->company = $company;
    }

    public function build()
    {
        return $this->view('emails.evaluation_calificated')
                    ->subject($this->subject)
                    ->with([
                        'user' => $this->company->users->where('role', 'admin')->first(),
                        'companyName' => $this->company->name
                    ]);
    }
} 