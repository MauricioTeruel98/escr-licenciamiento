@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Evaluación Aprobada
@endsection

@section('content')
<p style="color: #333 !important;">Hola</p>

<p style="color: #333 !important;">La empresa <strong>{{ $companyName }}</strong> ha calificado su evaluación y está lista para ser revisada.</p>
@endsection 