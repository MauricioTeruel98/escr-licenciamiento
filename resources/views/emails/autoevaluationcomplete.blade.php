@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Fin de la Autoevaluación
@endsection

@section('content')
<p style="color: #333 !important;">La empresa <a href="https://licenciamiento.esencialcostarica.com/super/companies" style="color: #15803d !important;">{{ $company->name }}</a> ha finalizado la autoevaluación en la plataforma de licenciamientos de <i>esencial</i> Costa Rica.</p>

<p style="color: #333 !important;">La información está lista para ser revisada y, en caso de cumplir con los requisitos, se podrá autorizar el inicio del proceso de evaluación</p>
@endsection 