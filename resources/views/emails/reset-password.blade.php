@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
    Restablecer Contraseña
@endsection

@section('content')
    <p style="color: #333 !important;">Se ha recibido una solicitud para el restablecimiento de la contraseña.</p>

    <p style="color: #333 !important;">El enlace para restablecer la contraseña estará disponible por un periodo de 60 minutos.</p>

    <p style="color: #333 !important;">En caso de no haber realizado esta solicitud, hacer caso omiso a este mensaje.</p>

    <div style="text-align: center;">
        <a href="{{ $resetUrl }}" class="" style="color: #15803d !important;">Restablecer Contraseña</a>
    </div>

    <p style="color: #333 !important;">Si se presentan inconvenientes al hacer clic en el botón puede copiar y pegar la URL proporcionada directamente en el
        navegador. <span style="color: #15803d !important;">{{ $resetUrl }}</span></p>
@endsection
