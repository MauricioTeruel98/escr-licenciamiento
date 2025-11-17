@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection 

@section('title')
Nueva Solicitud de Acceso
@endsection

@section('content')
<p style="color: #333 !important;">Ha recibido una nueva solicitud de acceso al perfil de su empresa {{ $company->name }} en la plataforma de licenciamiento
    corporativo de la marca país <i>esencial</i> Costa Rica.</p>

<p style="color: #333 !important;"><strong>Detalles del solicitante:</strong></p>
<ul>
    <li style="color: #333 !important;">Nombre: {{ $requestingUser->name }}</li>
    <li style="color: #333 !important;">Email: {{ $requestingUser->email }}</li>
    <li style="color: #333 !important;">Fecha de solicitud: {{ $requestingUser->created_at->format('d/m/Y H:i') }}</li>
</ul>

<div style="text-align: center;">
    <a href="{{ route('dashboard') }}" class="" style="color: #15803d !important;">Revisar Solicitud</a>
</div>
@endsection
