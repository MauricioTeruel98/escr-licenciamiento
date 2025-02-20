<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados de Autoevaluación</title>
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

        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #157f3d;
            padding: 15px;
            color: white;
            margin-bottom: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .header img {
            height: 50px;
        }

        h1 {
            font-size: 2em;
            margin: 0;
        }

        h2 {
            font-size: 1.5em;
            color: #157f3d;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        p {
            margin: 10px 0;
        }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 10px;
            background-color: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            overflow: hidden;
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

        .binding {
            color: #dc2626;
            font-size: 0.9em;
            font-weight: bold;
        }

        .score {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-top: 10px;
        }

        .final-score {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background-color: #157f3d;
            color: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="/public/assets/img/logo_esc_white.png" alt="Logo">
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

            <table>
                <tr>
                    <th>Componente</th>
                    <th>Requisito</th>
                    <th>Indicador</th>
                    <th>Cumplimiento</th>
                    {{-- <th>Justificación</th> --}}
                </tr>
                @foreach($value->subcategories as $subcategory)
                    @foreach($subcategory->indicators as $indicator)
                        <tr>
                            <td>{{ $subcategory->name }}</td>
                            <td>{{ $indicator->requisito->name ?? 'N/A' }}</td>
                            <td>
                                {{ $indicator->name }}
                                @if($indicator->binding)
                                    <span class="binding">(Vinculante)</span>
                                @endif
                            </td>
                            <td>
                                @if(isset($answers[$value->id]))
                                    {{ $answers[$value->id]->firstWhere('indicator_id', $indicator->id)->answer === "1" ? 'Sí' : 'No' }}
                                @else
                                    No respondida
                                @endif
                            </td>
                            {{-- <td></td> --}}
                        </tr>
                    @endforeach
                @endforeach
            </table>
        </div>

        @if(!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach

    {{-- <div class="final-score">
        <h2>Resultado Final</h2>
        <p>Estado: {{ $status ?? 'En proceso' }}</p>
    </div> --}}
</body>
</html> 