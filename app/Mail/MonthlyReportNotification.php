<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MonthlyReportNotification extends Mailable
{
    use Queueable, SerializesModels;

    protected $admin;
    protected $month;
    protected $filePathEmpresas;
    protected $fileNameEmpresas;
    protected $filePathUsuarios;
    protected $fileNameUsuarios;

    public function __construct($admin, $month, $filePathEmpresas, $fileNameEmpresas, $filePathUsuarios = null, $fileNameUsuarios = null)
    {
        $this->admin = $admin;
        $this->month = $month;
        $this->filePathEmpresas = $filePathEmpresas;
        $this->fileNameEmpresas = $fileNameEmpresas;
        $this->filePathUsuarios = $filePathUsuarios;
        $this->fileNameUsuarios = $fileNameUsuarios;
    }

    public function build()
    {
        $messageId = time() . '.' . uniqid() . '@procomer.com';

        $mailMessage = $this->view('emails.monthly-report', [
                'admin' => $this->admin,
                'month' => $this->month,
                'hasUsersReport' => !empty($this->filePathUsuarios)
            ])
            ->subject('Reporte Mensual de Empresas - ' . $this->month)
            ->attach($this->filePathEmpresas, [
                'as' => $this->fileNameEmpresas,
                'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ])
            ->withSwiftMessage(function ($message) use ($messageId) {
                $message->getHeaders()
                    ->addTextHeader('Message-ID', '<' . $messageId . '>')
                    ->remove('References')
                    ->remove('In-Reply-To');
            });

        // Adjuntar el reporte de usuarios/empresas si existe
        if ($this->filePathUsuarios && $this->fileNameUsuarios) {
            $mailMessage->attach($this->filePathUsuarios, [
                'as' => $this->fileNameUsuarios,
                'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ]);
        }

        return $mailMessage;
    }
} 