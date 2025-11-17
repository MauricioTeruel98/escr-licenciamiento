@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Resultados de su Autoevaluación
@endsection

@section('content')
<p style="color: #333 !important;">Ha completado satisfactoriamente el proceso de autoevaluación del licenciamiento corporativo de la marca país <i>esencial</i> Costa Rica.</p>

<p style="color: #333 !important;">Adjunto encontrará un documento pdf con los resultados detallados de su autoevaluación.</p>

<p style="color: #333 !important;">Próximos pasos:</p>
<ol>
    <li style="color: #333 !important;">El equipo de licenciamiento <i>esencial</i> Costa Rica revisará su autoevaluación.</li>
    <li style="color: #333 !important;">Una vez revisada la autoevaluación, el equipo se comunicará vía correo electrónico.</li>
    <li style="color: #333 !important;">Podrá continuar con el proceso de evaluación del licenciamiento corporativo de la marca país <i>esencial</i> Costa Rica.</li>
</ol>

{{-- <div style="text-align: center;">
    <a href="{{ route('form.empresa') }}" class="button">Completar Datos de Empresa</a>
</div> --}}

<p style="color: #333 !important;">Si tiene alguna duda o necesita asistencia, no dude en contactarnos al correo electrónico: <a href="mailto:licenciasmarcapais@procomer.com" style="font-weight: bold; color: #15803d !important;">licenciasmarcapais@procomer.com</a></p>
@endsection