@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Inicio del Proceso de Evaluación
@endsection

@section('content')
<p style="color: #333 !important;">A partir de este momento, su empresa está autorizada para completar el formulario de evaluación, lo que le permite continuar con el proceso de licenciamiento <i>esencial</i> Costa Rica.</p>

<p style="color: #333 !important;">Una vez completado este formulario, y según la calificación obtenida, podrá avanzar a la siguiente etapa de la evaluación.</p>
@endsection 