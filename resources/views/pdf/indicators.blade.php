<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Indicadores</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            background-color: #15803d;
            color: white;
            padding: 20px;
            border-radius: 8px;
        }
        .value-section, .subcategory-section, .requisito-section {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background-color: #f9fafb;
        }
        h1, h2, h3, h4 {
            color: #111827;
            margin-top: 0;
        }
        .text-white {
            color: white;
        }
    </style>
</head>
<body>
    <div class="header">
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