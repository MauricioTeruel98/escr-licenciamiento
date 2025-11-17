@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Nuevo Usuario Registrado 
@endsection

@section('content')
<p style="color: #333 !important;">La empresa <strong>{{ $company->name }}</strong> se ha registrado exitosamente en la plataforma de licenciamientos de <i>esencial</i> Costa Rica.</p>
@endsection
