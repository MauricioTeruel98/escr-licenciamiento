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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nueva evaluación completada</h1>
        </div>
        
        <div class="content">
            <p>Hola</p>
            
            <p>La empresa <strong>{{ $companyName }}</strong> ha completado su evaluación y está lista para ser revisada.</p>
            
            <p>Por favor, ingrese al sistema para revisar las respuestas proporcionadas y realizar la evaluación correspondiente.</p>
        </div>
        
        <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
        </div>
    </div>
</body>
</html> 