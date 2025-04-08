<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
    </style>
</head>
<body>
    <h2>Reporte Mensual de Empresas - {{ $month }}</h2>
    
    <p>Estimado(a) {{ $admin->name }},</p>
    
    <p>Adjunto encontrará el reporte mensual de todas las empresas registradas en la plataforma correspondiente al mes de {{ $month }}.</p>
    
    <p>Este reporte incluye información detallada de cada empresa, incluyendo:</p>
    <ul>
        <li>Datos generales</li>
        <li>Información de contacto</li>
        <li>Estado de evaluación</li>
        <li>Información adicional</li>
    </ul>
    
    <p>Saludos cordiales,<br>
    Sistema Automatizado de Reportes</p>
</body>
</html> 