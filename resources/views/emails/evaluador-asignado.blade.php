@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Organismo Evaluador Asignado
@endsection

@section('content')
<p style="color: #333 !important;">El equipo de <i>esencial</i> Costa Rica ha asignado el organismo evaluador indicado por su empresa para llevar a cabo la revisión de la evaluación presentada.</p>

<p style="color: #333 !important;">La revisión se realizará en la fecha previamente acordada con dicho organismo. En caso de dudas o consultas, le recomendamos comunicarse directamente con ellos <a href="https://www.esencialcostarica.com/wp-content/uploads/2024/03/PDF-evaluadores-v9.pdf" style="color: #15803d !important;">aquí</a>.</p>

@endsection 