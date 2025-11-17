@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Contraseña Restablecida
@endsection

@section('content')
<p style="color: #333 !important;">La contraseña de su cuenta ha sido restablecida satisfactoriamente.</p>

<p style="color: #333 !important;">Si usted no solicitó este cambio, por favor comuníquese de inmediato con el equipo de soporte.
    <a href="mailto:licenciasmarcapais@procomer.com" style="color: #15803d !important;">licenciasmarcapais@procomer.com</a>
</p>
@endsection
