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
            <h1>Restablecer contraseña del perfil de su empresa</h1>
        </div>

        <div class="content">
            <p>Hemos recibido una solicitud de restablecimiento de contraseña para el perfil de su empresa dentro de la
                plataforma de licenciamiento corporativo de la marca país <i>esencial</i> Costa Rica.</p>

            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Restablecer Contraseña</a>
            </div>

            <p>Este enlace de restablecimiento de contraseña expirará en 60 minutos.</p>

            <p>Si no solicitó ningún restablecimiento de contraseña, por favor hacer caso omiso a esta información.</p>
        </div>

        <div class="footer">
            <p>Si tienes problemas para hacer clic en el botón "Restablecer Contraseña", copia y pega esta URL en tu
                navegador web: {{ $resetUrl }}</p>
        </div>
    </div>
</body>

</html>
