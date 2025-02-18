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
            <h1>¡Autoevaluación Completada!</h1>
        </div>
        
        <div class="content">
            <p>Estimado/a {{ $company->name }},</p>
            
            <p>¡Felicitaciones por completar su autoevaluación! Este es un paso importante en su proceso de licenciamiento.</p>
            
            <p>Adjunto encontrará el PDF con los resultados detallados de su autoevaluación.</p>
            
            <p>Próximos pasos:</p>
            <ol>
                <li>Complete el formulario de datos de su empresa en la plataforma</li>
                <li>Espere la revisión de su autoevaluación por nuestro equipo</li>
                <li>Pronto podrá continuar con el proceso de licenciamiento</li>
            </ol>

            <div style="text-align: center;">
                <a href="{{ route('form.empresa') }}" class="button">Completar Datos de Empresa</a>
            </div>
            
            <p>Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.</p>
            
            <p>¡Gracias por confiar en nosotros!</p>
        </div>
        
        <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
        </div>
    </div>
</body>
</html> 