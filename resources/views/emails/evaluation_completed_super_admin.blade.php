@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Nueva evaluación completada
@endsection

@section('content')
<p style="color: #333 !important;">Hola</p>

<p style="color: #333 !important;">La empresa <strong>{{ $companyName }}</strong> ha completado su evaluación y está lista para ser revisada.</p>

<p style="color: #333 !important;">Por favor, ingrese al sistema para asignar un Evaluador a la empresa.</p>

<a href="{{ url('https://licenciamiento.esencialcostarica.com/super/companies') }}" class="" style="color: #15803d !important;">Ir a la plataforma</a>
@endsection 