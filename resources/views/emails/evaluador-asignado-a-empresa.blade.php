@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Nueva Empresa Asignada
@endsection

@section('content')
<p style="color: #333 !important;">La empresa <strong>{{ $company->name }}</strong> ha sido asignada a usted como evaluador/a.</p>

<p style="color: #333 !important;">Por favor, ingrese al sistema para revisar las respuestas proporcionadas y proceder con la evaluación correspondiente.</p>

@endsection 