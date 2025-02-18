<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resultados de Autoevaluación</title>
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
        .company-info {
            text-align: center;
            margin-bottom: 30px;
            color: #4b5563;
        }
        .value-section {
            margin-top: 40px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            background-color: #ffffff;
        }
        .value-header {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .subcategory {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 6px;
        }
        .question {
            margin-bottom: 20px;
            padding: 10px;
            border-left: 3px solid #15803d;
        }
        .answer {
            margin-left: 20px;
            color: #2563eb;
            font-weight: bold;
        }
        .binding {
            color: #dc2626;
            font-size: 0.9em;
            font-weight: bold;
        }
        .score {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
        }
        .final-score {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background-color: #15803d;
            color: white;
            border-radius: 8px;
        }
        h1, h2, h3 {
            color: #111827;
            margin-top: 0;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Resultados de Autoevaluación</h1>
    </div>

    <div class="company-info">
        <h2>{{ $company->name }}</h2>
        <p>Fecha de evaluación: {{ $date }}</p>
    </div>

    @foreach($values as $value)
        <div class="value-section">
            <div class="value-header">
                <h2>{{ $value->name }}</h2>
                <div class="score">
                    <p><strong>Puntuación obtenida:</strong> {{ $finalScores[$value->id]->nota ?? 0 }}/100</p>
                    <p><strong>Nota mínima requerida:</strong> {{ $value->minimum_score }}</p>
                </div>
            </div>

            @foreach($value->subcategories as $subcategory)
                <div class="subcategory">
                    <h3>{{ $subcategory->name }}</h3>
                    
                    @foreach($subcategory->indicators as $indicator)
                        <div class="question">
                            <p>
                                <strong>{{ $indicator->name }}</strong>
                                @if($indicator->binding)
                                    <span class="binding">(Vinculante)</span>
                                @endif
                            </p>
                            <p>{{ $indicator->self_evaluation_question }}</p>
                            <p class="answer">
                                Respuesta: 
                                @if(isset($answers[$value->id]))
                                    {{ $answers[$value->id]->firstWhere('indicator_id', $indicator->id)->answer === "1" ? 'Sí' : 'No' }}
                                @else
                                    No respondida
                                @endif
                            </p>
                        </div>
                    @endforeach
                </div>
            @endforeach
        </div>

        @if(!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach

    <div class="final-score">
        <h2>Resultado Final</h2>
        <p>Estado: {{ $status ?? 'En proceso' }}</p>
    </div>
</body>
</html> 