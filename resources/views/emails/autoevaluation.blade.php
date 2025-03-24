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
        .button {
            display: inline-block;
            background-color: #15803d;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #6b7280;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Autoevaluación Finalizada!</h1>
        </div>
        
        <div class="content">
            <p>Ha completado satisfactoriamente el proceso de autoevaluación del licenciamiento corporativo de la marca país <i>esencial</i> Costa Rica.</p>
            
            <p>Adjunto encontrará un documento pdf con los resultados detallados de su autoevaluación.</p>
            
            <p>Próximos pasos:</p>
            <ol>
                <li>El equipo de licenciamiento <i>esencial</i> Costa Rica revisará su autoevaluación.</li>
                <li>Una vez revisada la autoevaluación, el equipo se comunicará vía correo electrónico en un plazo no mayor a 30 días hábiles.</li>
                <li>Podrá continuar con el proceso de evaluación del licenciamiento corporativo de la marca país <i>esencial</i> Costa Rica.</li>
            </ol>

            {{-- <div style="text-align: center;">
                <a href="{{ route('form.empresa') }}" class="button">Completar Datos de Empresa</a>
            </div> --}}
            
            <p>Si tiene alguna duda o necesita asistencia, no dude en contactarnos al correo electrónico: <a href="mailto:licenciamiento@esencial.cr" style="font-weight: bold;">licenciamiento@esencial.cr</a></p>
        </div>
        
        <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
        </div>
    </div>
</body>
</html> 