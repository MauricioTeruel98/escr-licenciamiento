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
            <h1>Nueva Solicitud de Acceso</h1>
        </div>
        
        <div class="content">
            <p>Hola Administrador,</p>
            
            <p>Has recibido una nueva solicitud de acceso para tu empresa.</p>
            
            <p><strong>Detalles del solicitante:</strong></p>
            <ul>
                <li>Nombre: {{ $requestingUser->name }}</li>
                <li>Email: {{ $requestingUser->email }}</li>
                <li>Fecha de solicitud: {{ $requestingUser->created_at->format('d/m/Y H:i') }}</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="{{ route('dashboard') }}" class="button">Revisar Solicitud</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
        </div>
    </div>
</body>
</html> 