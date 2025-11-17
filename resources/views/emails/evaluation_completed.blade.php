@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Evaluación Completada
@endsection

@section('content')
<p style="color: #333 !important;">La evaluación de su empresa ha sido completada satisfactoriamente. A partir de este momento, corresponde seleccionar uno de los dos organismos certificadores autorizados <a href="https://www.esencialcostarica.com/wp-content/uploads/2024/03/PDF-evaluadores-v9.pdf" style="color: #15803d !important;">aquí</a> y gestionar la cotización directamente con los organismos. </p>

<p style="color: #333 !important;">Una vez realizado este paso, porfavor notificar la elección del evaluador al correo <a href="mailto:licenciasmarcapais@procomer.com" style="color: #15803d !important;">licenciasmarcapais@procomer.com</a>, para que el equipo de esencial asigne el evaluador a su empresa y lleve a cabo la evaluación correspondiente.</p>
@endsection 