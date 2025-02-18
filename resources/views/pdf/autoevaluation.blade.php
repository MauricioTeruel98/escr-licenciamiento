<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resultados de Autoevaluación</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 30px; }
        .question { margin-bottom: 20px; }
        .answer { margin-left: 20px; color: #2563eb; }
        .score { margin-top: 30px; padding: 10px; background: #f3f4f6; }
        .binding { color: #dc2626; }
        .value-section { margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Resultados de Autoevaluación</h1>
        <p>Empresa: {{ $company->name }}</p>
        <p>Fecha: {{ $date }}</p>
    </div>

    @foreach($values as $value)
        <div class="value-section">
            <h2>{{ $value->name }}</h2>
            <div class="score">
                <p>Puntuación: {{ $finalScores[$value->id]->nota ?? 0 }}/100</p>
                <p>Nota mínima requerida: {{ $value->minimum_score }}</p>
            </div>

            @foreach($value->subcategories as $subcategory)
                <h3>{{ $subcategory->name }}</h3>
                
                @foreach($subcategory->indicators as $indicator)
                    <div class="question">
                        <p>
                            {{ $indicator->name }}
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
            @endforeach
        </div>
    @endforeach
</body>
</html> 