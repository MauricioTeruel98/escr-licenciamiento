<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 0;
            margin: 0;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #15803d;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            color: #6b7280;
            font-size: 0.875rem;
        }

        ul {
            padding-left: 20px;
        }

        li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reporte Mensual de Empresas - {{ $month }}</h1>
        </div>

        <div class="content">
            <p>Estimado(a) {{ $admin->name }},</p>
            
            <p>Adjunto encontrará el reporte mensual de todas las empresas registradas en la plataforma correspondiente al mes de {{ $month }}. El reporte incluye la siguiente información para cada empresa:</p>
            
            <ul>
                <li>ID y Nombre de la empresa</li>
                <li>Cédula Jurídica</li>
                <li>Provincia</li>
                <li>Nombre del Representante Legal</li>
                <li>Estado actual del proceso de licenciamiento</li>
                <li>Detalle por cada valor evaluado:
                    <ul>
                        <li>Porcentaje de avance</li>
                        <li>Nota obtenida y nota mínima requerida</li>
                    </ul>
                </li>
                <li>Progreso total del proceso</li>
                <li>Nota final</li>
            </ul>

            
        </div>

        <div class="footer">
            <p>Este es un correo automático generado por el sistema de licenciamiento corporativo de la marca país <i>esencial</i> Costa Rica.</p>
        </div>
    </div>
</body>
</html> 