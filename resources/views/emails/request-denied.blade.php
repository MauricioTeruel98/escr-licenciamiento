@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Solicitud de Acceso Denegado
@endsection

@section('content')
<p style="color: #333 !important;">Su solicitud de acceso al perfil de la empresa {{ $company->name }} en la plataforma de licenciamiento
    corporativo de la marca país <i>esencial</i> Costa Rica ha sido denegada por el administrador(a) de la
    empresa.
</p>
@endsection
