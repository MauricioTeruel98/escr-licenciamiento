<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @yield('head')
    <!-- Estilos mínimos en head como respaldo -->
    <style>
        /* Reset básico para algunos clientes */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            outline: none;
            text-decoration: none;
        }
    </style>
    @yield('additional_styles')
</head>

<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <!-- Contenedor principal usando tabla -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Contenedor del email -->
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #15803d; padding: 40px 20px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; line-height: 1.2;">
                                @yield('title')
                            </h1>
                        </td>
                    </tr>

                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 30px; background-color: #ffffff; color: #333333; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #15803d; padding: 20px; text-align: center;">
                            @section('footer')
                                <!-- Logo -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding-bottom: 15px;">
                                            <img src="https://licenciamiento.esencialcostarica.com/public/assets/img/logo-esencial-procomer.png"
                                                alt="Logo" 
                                                width="250" 
                                                height="51"
                                                style="display: block; max-width: 250px; height: auto; border: 0;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <p style="margin: 0; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4;">
                                                Este es un correo automático, por favor no responder.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @show
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

    <!-- Estilos para botones (si los necesitas en el contenido) -->
    <style>
        .email-button {
            display: inline-block !important;
            background-color: #15803d !important;
            color: #ffffff !important;
            padding: 12px 24px !important;
            text-decoration: none !important;
            border-radius: 6px !important;
            font-family: Arial, sans-serif !important;
            font-size: 16px !important;
            font-weight: bold !important;
            margin: 20px 0 !important;
            border: none !important;
        }
    </style>
</body>

</html>
