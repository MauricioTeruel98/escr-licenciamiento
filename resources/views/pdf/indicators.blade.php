<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Indicadores</title>
    <style>
        @font-face {
            font-family: 'Poppins';
            src: url('/public/fonts/poppins/Poppins-Regular.ttf') format('truetype');
            font-weight: normal;
        }

        @font-face {
            font-family: 'Poppins';
            src: url('/public/fonts/poppins/Poppins-Bold.ttf') format('truetype');
            font-weight: bold;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #157f3d;
            padding: 15px;
            color: white;
            margin-bottom: 20px;
            border-radius: 8px; /* Borde redondeado */
            border: 1px solid #e5e7eb; /* Borde */
        }

        .header img {
            height: 50px;
        }

        h1, h2, h3, h4 {
            color: #111827;
            margin-top: 0;
        }

        .value-section, .subcategory-section, .requisito-section {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #e5e7eb; /* Borde */
            border-radius: 8px; /* Borde redondeado */
            background-color: #f9fafb;
        }

        table {
            width: 100%;
            border-collapse: separate; /* Cambiado a 'separate' para bordes redondeados */
            border-spacing: 0; /* Espaciado entre celdas */
            margin-top: 10px;
            background-color: white;
            border-radius: 8px; /* Borde redondeado */
            border: 1px solid #e5e7eb; /* Borde */
            overflow: hidden; /* Para asegurar que el borde redondeado se aplique */
        }

        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #157f3d;
            color: white;
        }

        .text-white {
            color: white;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="/public/assets/img/logo_esc_white.png" alt="Logo">
        <h1 class="text-white">Lista de Indicadores</h1>
    </div>

    @foreach($values as $value)
        <div class="value-section">
            <h2>Valor: {{ $value->name }}</h2>
            @foreach($value->subcategories as $subcategory)
                <div class="subcategory-section">
                    <h3>Componente: {{ $subcategory->name }}</h3>
                    @foreach($subcategory->indicators as $indicator)
                        <div class="requisito-section">
                            <h4>Requisito: {{ $indicator->requisito->name ?? 'N/A' }}</h4>
                            <p><strong>Indicador:</strong> {{ $indicator->name }}</p>
                            <p><strong>Pregunta de Autoevaluación:</strong> {{ $indicator->self_evaluation_question }}</p>
                        </div>
                    @endforeach
                </div>
            @endforeach
        </div>
    @endforeach
</body>
</html> 