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
            <h1>Bienvenido(a) a la plataforma de licenciamiento corporativo de la marca país <i>esencial</i> Costa Rica.</h1>
        </div>

        <div class="content">
            <p>A partir de este momento, su empresa podrá iniciar el proceso de autoevaluación, el cual le permitirá, a
                través de un diagnóstico, conocer la calificación de cada uno de los diferentes indicadores a evaluar en
                el protocolo de licenciamiento.</p>

            <p>Una vez realizado este proceso, según la calificación obtenida, podrá continuar con la etapa de solicitud
                para formar parte de la comunidad de empresas <i>esencial</i> Costa Rica.</p>

            {{-- <div style="text-align: center;">
                <a href="{{ route('login') }}" class="button">Iniciar sesión</a>
            </div> --}}
        </div>

        <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
        </div>
    </div>
</body>

</html>
