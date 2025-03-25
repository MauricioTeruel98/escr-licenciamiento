@component('mail::message')
# Correo de Prueba

Este es un correo de prueba enviado desde el sistema de logs de correo.

Fecha y hora del envío: {{ now()->format('d/m/Y H:i:s') }}

Gracias,<br>
{{ config('app.name') }}
@endcomponent 