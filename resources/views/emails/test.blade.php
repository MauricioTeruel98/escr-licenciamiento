@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Correo de Prueba
@endsection

@section('content')
<p style="color: #333 !important;">Hola, este es un correo de prueba, por favor no responder a este correo.</p>

<p style="color: #333 !important;">Fecha y hora del envío: {{ now()->setTimezone('America/Costa_Rica')->format('d/m/Y H:i:s') }}</p>

<div style="text-align: center;">
    <a href="{{ route('login') }}" class="" style="color: #15803d !important;">Iniciar sesión</a>
</div>

<p>{{ config('app.name') }}</p>
@endsection