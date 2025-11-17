@extends('layouts.email')

@section('head')
<!-- ID invisible: {{ uniqid() }} -->
<meta name="message-id" content="{{ uniqid() }}">
<meta name="in-reply-to" content="{{ uniqid() }}">
<meta name="references" content="{{ uniqid() }}">
@endsection

@section('title')
Reporte Mensual de Empresas - {{ $month }}
@endsection

@section('content')
<p style="color: #333 !important;">Estimado(a) {{ $admin->name }},</p>

<p style="color: #333 !important;">Adjunto encontrará los reportes mensuales correspondientes al mes de {{ $month }}:</p>

<h3 style="color: #333 !important;">1. Reporte de Empresas</h3>
<p style="color: #333 !important;">Este reporte incluye la siguiente información para cada empresa:</p>
<ul>
    <li style="color: #333 !important;">ID y Nombre de la empresa</li>
    <li style="color: #333 !important;">Cédula Jurídica</li>
    <li style="color: #333 !important;">Provincia</li>
    <li style="color: #333 !important;">Nombre del Representante Legal</li>
    <li style="color: #333 !important;">Estado actual del proceso de licenciamiento</li>
    <li style="color: #333 !important;">Detalle por cada valor evaluado:
        <ul>
            <li style="color: #333 !important;">Porcentaje de avance</li>
            <li style="color: #333 !important;">Nota obtenida y nota mínima requerida</li>
        </ul>
    </li>
    <li style="color: #333 !important;">Progreso total del proceso</li>
    <li style="color: #333 !important;">Nota final</li>
</ul>

@if(isset($hasUsersReport) && $hasUsersReport)
<h3 style="color: #333 !important;">2. Reporte de Usuarios y Empresas</h3>
<p style="color: #333 !important;">Este reporte incluye información detallada de usuarios y sus empresas asociadas:</p>
<ul>
    <li style="color: #333 !important;">Información del usuario (ID, nombre, apellidos, cédula, email, teléfono)</li>
    <li style="color: #333 !important;">Referencias y organismo</li>
    <li style="color: #333 !important;">Estado de la empresa</li>
    <li style="color: #333 !important;">Información completa de la empresa (sector, provincia, cantón, cédula jurídica)</li>
    <li style="color: #333 !important;">Datos de contacto y representación legal</li>
    <li style="color: #333 !important;">Información de exportación</li>
</ul>
@endif

<p style="color: #333 !important;">Saludos cordiales,<br>
Equipo de Licenciamiento</p>
@endsection