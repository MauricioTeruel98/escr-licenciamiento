@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Solicitud de Acceso Enviada
@endsection

@section('content')
<p style="color: #333 !important;">Su solicitud de acceso al perfil de la empresa {{ $company->name }} ha sido enviada satisfactoriamente.</p>

<p>El administrador de la empresa revisará su solicitud y una vez aprobada, se le notificará el acceso por correo electrónico.</p>
@endsection 