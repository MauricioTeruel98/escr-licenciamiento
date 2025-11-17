@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Bienvenido(a) a la plataforma de licenciamiento corporativo de la marca país <i>esencial</i> Costa Rica.  
@endsection

@section('content')
<p style="color: #333 !important;">A partir de este momento, su empresa podrá iniciar el proceso de autoevaluación, el cual le permitirá, a través de un diagnóstico, conocer la calificación de cada uno de los diferentes indicadores a evaluar en el protocolo de licenciamiento.</p>

<p style="color: #333 !important;">Una vez realizado este proceso y según la calificación obtenida, podrá continuar con la siguiente etapa, la cual corresponde a la solicitud de evaluación para formar parte de la comunidad de empresas <i>esencial</i> Costa Rica.</p>

{{-- <div style="text-align: center;">
    <a href="{{ route('login') }}" class="" style="color: #15803d !important;">Iniciar sesión</a>
</div> --}}
@endsection
