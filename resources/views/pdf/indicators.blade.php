<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Indicadores</title>
    <style>
        @font-face {
            font-family: 'Poppins';
            src: url('{{ storage_path('fonts/poppins/Poppins-Regular.ttf') }}') format('truetype');
            font-weight: normal;
        }

        @font-face {
            font-family: 'Poppins';
            src: url('{{ storage_path('fonts/poppins/Poppins-Bold.ttf') }}') format('truetype');
            font-weight: bold;
        }

        @font-face {
            font-family: 'Montserrat';
            src: url('{{ storage_path('fonts/montserrat/Montserrat-Regular.ttf') }}') format('truetype');
            font-weight: normal;
        }

        @font-face {
            font-family: 'Montserrat';
            src: url('{{ storage_path('fonts/montserrat/Montserrat-Bold.ttf') }}') format('truetype');
            font-weight: bold;
        }

        @font-face {
            font-family: 'Gotham';
            src: url('{{ storage_path('fonts/gotham/GothamMedium.ttf') }}') format('truetype');
            font-weight: normal;
        }

        @page {
            margin: 0mm;
            /* Ajusta el valor según lo necesites */
        }

        body {
            font-family: 'Gotham', sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 20px;
            font-size: 0.85rem !important;
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
            color: #333;
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

        header {
            background-image: url('/public/assets/img/Header_pdf.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        header h1 {
            width: 60%;
            color: #157f3d;
        }
        
    </style>
</head>
<body>
    <header class="header">
        <img src="/public/assets/img/logo_esc.png" alt="Logo">
        <h1>Lista de Indicadores</h1>
    </header>

    @foreach($values as $value)
        <div class="value-section">
            <h2>Valor: <span style="color: #157f3d;">{{ $value->name }}</span></h2>
            @foreach($value->subcategories as $subcategory)
                <div class="subcategory-section">
                    <h3>Componente: <span style="color: #157f3d;">{{ $subcategory->name }}</span></h3>
                    @foreach($subcategory->indicators as $indicator)
                        <div class="requisito-section">
                            <h4>Requisito: <span style="color: #157f3d;">{{ $indicator->requisito->name ?? 'N/A' }}</span></h4>
                            <p><strong>Indicador:</strong> <span style="color: #157f3d;">{{ $indicator->name }}</span></p>
                            <p><strong>Pregunta de Autoevaluación:</strong> <span style="color: #157f3d;">{{ $indicator->self_evaluation_question }}</span></p>
                        </div>
                    @endforeach
                </div>
            @endforeach
        </div>
    @endforeach
</body>
</html> 