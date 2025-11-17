<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class MonthlyReportNotification extends Notification
{
    use Queueable;

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

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $mailMessage = (new MailMessage)
            ->subject('Reporte Mensual de Empresas - ' . $this->month)
            ->view('emails.monthly-report', [
                'admin' => $this->admin,
                'month' => $this->month,
                'hasUsersReport' => !empty($this->filePathUsuarios)
            ])
            ->attach($this->filePathEmpresas, [
                'as' => $this->fileNameEmpresas,
                'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ]);

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