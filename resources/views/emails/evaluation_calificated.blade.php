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
<p style="color: #333 !important;">Nos complace informarle que su empresa <strong>{{ $companyName }}</strong> ha aprobado la evaluación realizada por el organismo certificador, como parte del proceso de licenciamiento de la Marca País <i>esencial</i> Costa Rica.</p>

<p style="color: #333 !important;">Como siguiente paso, deberá coordinar junto con el organismo certificador la firma y entrega del informe de evaluación, así como de los documentos requeridos por la Marca.</p>

<p style="color: #333 !important;">Una vez completado este paso, los documentos deberán ser enviados para su revisión y aprobación final al correo: <a href="mailto:licenciasmarcapais@procomer.com" style="color: #15803d !important;">licenciasmarcapais@procomer.com</a>, con el fin de proceder con el otorgamiento oficial del licenciamiento.</p>

<p style="color: #333 !important;">Agradecemos su interés en formar parte de la Marca País <i>esencial</i> Costa Rica.</p>
@endsection 