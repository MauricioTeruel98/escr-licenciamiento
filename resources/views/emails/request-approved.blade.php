@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Solicitud de Acceso Aprobado
@endsection

@section('content')
<p style="color: #333 !important;">Su solicitud de acceso al perfil de la empresa {{ $company->name }} en la plataforma de licenciamiento
    corporativo de la marca país <i>esencial</i> Costa Rica ha sido aprobada por el administrador(a) de la
    empresa.</p>

<div style="text-align: center;">
    <a href="{{ route('login') }}" class="" style="color: #15803d !important;">Iniciar sesión</a>
</div>
@endsection
