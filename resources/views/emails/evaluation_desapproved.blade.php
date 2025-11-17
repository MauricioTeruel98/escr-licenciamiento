@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Evaluación No Aprobada
@endsection

@section('content')
<p style="color: #333 !important;">Le informamos que su empresa <strong>{{ $companyName }}</strong> no ha aprobado la evaluación realizada por el organismo certificador, como parte del proceso de licenciamiento de la Marca País <i>esencial</i> Costa Rica.</p>

<p style="color: #333 !important;">Puede comunicarse directamente con el organismo certificador para conocer los detalles del resultado.</p>

<p style="color: #333 !important;">Agradecemos su interés en formar parte de la Marca País <i>esencial</i> Costa Rica.</p>
@endsection 