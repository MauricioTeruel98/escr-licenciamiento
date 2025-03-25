<?php

namespace App\Services;

use App\Models\MailLog;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Notifications\Notification as BaseNotification;
use Illuminate\Mail\Mailable;

class MailService
{
    public function send($to, $message)
    {
        // Si es un restablecimiento de contraseña, manejarlo de forma especial
        if ($message instanceof \Illuminate\Auth\Notifications\ResetPassword) {
            return $this->handlePasswordReset($to, $message);
        }

        // Crear registro del intento de envío
        $mailLog = MailLog::create([
            'to_email' => is_array($to) ? implode(',', $to) : $to,
            'subject' => $this->getSubject($message),
            'mailable_class' => get_class($message),
            'mailable_data' => $this->serializeMessage($message),
            'status' => 'pending',
            'attempts' => 0
        ]);

        try {
            // Enviar según el tipo de mensaje
            if ($message instanceof Mailable) {
                Mail::to($to)->send($message);
            } elseif ($message instanceof BaseNotification) {
                Notification::route('mail', $to)->notify($message);
            } else {
                throw new \Exception('Tipo de mensaje no soportado');
            }

            // Actualizar registro como enviado exitosamente
            $mailLog->update([
                'status' => 'sent',
                'attempts' => $mailLog->attempts + 1,
                'last_attempt' => now()
            ]);

            return true;
        } catch (\Exception $e) {
            // Registrar el error
            Log::error('Error al enviar correo:', [
                'error' => $e->getMessage(),
                'email' => $to,
                'message_class' => get_class($message)
            ]);

            // Actualizar registro como fallido
            $mailLog->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'attempts' => $mailLog->attempts + 1,
                'last_attempt' => now()
            ]);

            return false;
        }
    }

    public function handlePasswordReset($email, $notification)
    {
        try {
            // Obtener el usuario por email
            $user = \App\Models\User::where('email', $email)->first();
            
            if (!$user) {
                throw new \Exception("Usuario no encontrado para el email: {$email}");
            }

            // Crear una nueva instancia de CustomResetPasswordNotification
            $resetNotification = new \App\Notifications\CustomResetPasswordNotification($notification->token);

            // Crear el registro en mail_logs
            $mailLog = \App\Models\MailLog::create([
                'to_email' => $email,
                'subject' => 'Restablecer Contraseña',
                'mailable_class' => get_class($resetNotification),
                'mailable_data' => json_encode([
                    'token' => $notification->token,
                    'user_id' => $user->id
                ]),
                'status' => 'pending',
                'attempts' => 0
            ]);

            try {
                // Enviar la notificación personalizada
                $user->notify($resetNotification);

                // Actualizar el estado del log
                $mailLog->update([
                    'status' => 'sent',
                    'attempts' => $mailLog->attempts + 1,
                    'last_attempt' => now()
                ]);

                return true;
            } catch (\Exception $e) {
                // Actualizar el log con el error
                $mailLog->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                    'attempts' => $mailLog->attempts + 1,
                    'last_attempt' => now()
                ]);

                throw $e;
            }
        } catch (\Exception $e) {
            \Log::error('Error en handlePasswordReset: ' . $e->getMessage());
            throw $e;
        }
    }

    public function retry($mailLogId)
    {
        $mailLog = \App\Models\MailLog::findOrFail($mailLogId);
        $mailableData = json_decode($mailLog->mailable_data, true);

        try {
            if ($mailLog->mailable_class === \App\Notifications\CustomResetPasswordNotification::class) {
                // Caso especial para reset de contraseña
                $user = \App\Models\User::where('email', $mailLog->to_email)->first();
                if (!$user) {
                    throw new \Exception("Usuario no encontrado");
                }

                $resetNotification = new \App\Notifications\CustomResetPasswordNotification($mailableData['token']);
                $user->notify($resetNotification);
            } else {
                // Manejo normal para otros tipos de correos
                $mailable = $this->recreateMailable($mailLog->mailable_class, $mailableData);
                Mail::to($mailLog->to_email)->send($mailable);
            }

            $mailLog->update([
                'status' => 'sent',
                'attempts' => $mailLog->attempts + 1,
                'last_attempt' => now(),
                'error_message' => null
            ]);

            return true;
        } catch (\Exception $e) {
            $mailLog->update([
                'status' => 'failed',
                'attempts' => $mailLog->attempts + 1,
                'last_attempt' => now(),
                'error_message' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function getSubject($message)
    {
        if ($message instanceof Mailable) {
            // Intentar obtener el asunto del Mailable
            return $message->subject ?? 
                   $this->getMailableSubject($message) ?? 
                   'Correo del sistema';
        } 
        
        if ($message instanceof BaseNotification) {
            // Intentar obtener el asunto de la Notificación
            return $message->subject ?? 
                   $this->getNotificationSubject($message) ?? 
                   'Notificación del sistema';
        }
        
        return 'Correo del sistema';
    }

    private function getMailableSubject($mailable)
    {
        // Intentar obtener el asunto de diferentes formas comunes
        if (method_exists($mailable, 'build')) {
            $buildResult = $mailable->build();
            if (isset($buildResult->subject)) {
                return $buildResult->subject;
            }
        }
        
        // Intentar obtener de la propiedad subject si existe
        $reflection = new \ReflectionClass($mailable);
        if ($reflection->hasProperty('subject')) {
            $property = $reflection->getProperty('subject');
            $property->setAccessible(true);
            return $property->getValue($mailable);
        }
        
        return null;
    }

    private function getNotificationSubject($notification)
    {
        // Intentar obtener el asunto de la notificación
        if (method_exists($notification, 'toMail')) {
            $mailMessage = $notification->toMail(null);
            if (isset($mailMessage->subject)) {
                return $mailMessage->subject;
            }
        }
        
        return null;
    }

    private function serializeMessage($message)
    {
        // Obtener las propiedades públicas del mensaje
        $reflection = new \ReflectionClass($message);
        $properties = $reflection->getProperties(\ReflectionProperty::IS_PUBLIC);
        
        $data = [];
        foreach ($properties as $property) {
            $data[$property->getName()] = $property->getValue($message);
        }
        
        return $data;
    }

    private function recreateMailable($class, $data)
    {
        // Implementa la lógica para recrear un objeto Mailable a partir de los datos
        // Esto puede variar dependiendo de cómo se almacenan los datos en la base de datos
        // Aquí se asume que los datos se almacenan como un array asociativo
        return new $class(...array_values($data));
    }
} 