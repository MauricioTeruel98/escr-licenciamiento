<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario de solicitud de licencia e informe de evaluación</title>
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

        @font-face {
            font-family: 'Gotham';
            src: url('{{ storage_path('fonts/gotham/GothamBold.ttf') }}') format('truetype');
            font-weight: bold;
        }

        body {
            font-family: 'Gotham', sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 25px;
            font-size: 0.85rem !important;

        }

        @page {
            margin: 0mm;
            /* Ajusta el valor según lo necesites */
        }


        header {
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

        header img {
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

        th,
        td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;

        }

        th {
            background-color: #157f3d;
            color: white;
        }

        .highlight {
            background-color: yellow;
            font-weight: bold;
        }

        .signature-table {
            width: 100%;
            margin-top: 180px;
            border: none;
            background-color: #f4f4f9;

        }

        .signature-table td {
            width: 50%;
            padding: 20px;
            text-align: center;
            border: none;
        }

        .signature-line {
            border-top: 1px solid #333;
            margin: 0 auto;
            width: 80%;
            padding-top: 10px;
        }

        .score {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-top: 10px;
        }

        .indicator-section {
            margin-bottom: 20px;

            background-color: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            padding: 15px;
        }

        .indicator-section h4 {
            color: #157f3d;
            margin-top: 0;
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }

        .approved {
            color: #157f3d;
            font-weight: bold;
        }

        .not-approved {
            color: #dc2626;
            font-weight: bold;
        }

        .comment {
            font-style: italic;
            color: #4b5563;
        }

        .page-break {
            page-break-after: always;


        }

        .evaluation-info {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-bottom: 20px;
        }

        .text-center {
            text-align: center;
        }

        .auto-evaluation-section {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-bottom: 15px;
        }

        .auto-evaluation-section h5 {
            color: #4b5563;
            margin-top: 0;
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }

        h5 {
            font-size: 1.1em;
            margin-top: 15px;
            margin-bottom: 10px;
            color: #157f3d;
        }

        .question-box {
            margin-bottom: 10px;
        }

        .answer-box {
            margin-left: 20px;
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #e5e7eb;

        }

        .justification {
            font-style: italic;
            color: #4b5563;
            display: block;
            margin-top: 5px;
            padding: 5px;
            background-color: #f3f4f6;
            border-radius: 4px;
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

        .paises-exportacion td {
            border: 0;
            background-color: #f4f4f9;
        }

        .descalificatorio {
            display: inline-flex;
            align-items: center;
            background-color: #ffdfdf;
            border: 1px solid #e24343;
            padding: 2px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: #dc2626;
        }

        .evaluation-status {
            margin: 20px 0;
        }

        .evaluation-result {
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .evaluation-result.failed {
            background-color: #FEE2E2;
            border: 2px solid #DC2626;
        }

        .evaluation-result.passed {
            background-color: #DCFCE7;
            border: 2px solid #16A34A;
        }

        .result-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }

        .result-header h2 {
            margin: 0;
            color: inherit;
        }

        .icon-warning {
            color: #DC2626;
        }

        .icon-success {
            color: #16A34A;
        }

        .evaluation-result.failed h2 {
            color: #DC2626;
        }

        .evaluation-result.passed h2 {
            color: #16A34A;
        }

        .evaluation-result p {
            margin: 0;
            font-size: 0.9em;
        }

        .evaluation-result.failed p {
            color: #7F1D1D;
        }

        .evaluation-result.passed p {
            color: #166534;
        }

        .full-page {
            width: 100%;
            height: 100%;
            /* Alternativa si DomPDF no interpreta bien A4 */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            margin: 0;
            padding: 0;
            /* Fuerza una nueva página */
        }
    </style>
</head>

<body>
    <div class="full-page">
        i
        <img src="/public/assets/img/ESE_FEB_Descargable_Informe-01.jpg" alt="Logo"
            style="position: absolute; top:0; left: 0; width: 100%; height: 100%; object-fit: cover;">
    </div>
    <header>
        <img src="/public/assets/img/logo_esc.png" alt="Logo">
        <h1>Informe de Evaluación del Protocolo Marca País</h1>
    </header>

    <h2>Datos de la organización</h2>
    <p><strong style="font-weight: bold; font-size: 15px;">Nombre comercial:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Razón social:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Cédula jurídica:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Descripción:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Actividad comercial:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Año de fundación:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Proceso de licenciamiento:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Exporta actualmente:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Países de exportación:</strong></p>
    <p>
    </p>
    <p>
    </p>
    <p>
    </p>

    <p><strong style="font-weight: bold; font-size: 15px;">Productos/servicios:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Rango de exportaciones:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Total de empleados:</strong>
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Distribución de empleados:</strong></p>
    <p>- Hombres: </p>
    <p>- Mujeres: </p>
    <p>- Otros: </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Dirección:</strong>
    </p>
    <p>- Provincia:
    </p>
    <p>- Cantón:
    </p>
    <p>- Distrito:
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Redes sociales:</strong></p>
    <p>- Sitio web:
    </p>
    <p>- Facebook:
    </p>
    <p>- Instagram:
    </p>
    <p>- LinkedIn:
    </p>

    <div style="page-break-after: always;"></div>

    <h2>Resumen de evaluación</h2>
    <table>
        <tr>
            <th>Valor</th>
            <th>Calificación mínima</th>
            <th>Calificación obtenida</th>
        </tr>
        @foreach ($values as $value)
            <tr>
                <td>{{ $value->name }}</td>
                <td></td>
                <td></td>
            </tr>
        @endforeach
    </table>

    <div style="border: 1px solid #ccc; border-radius: 8px; background: #fcfdff; margin-top: 10px; padding: 10px !important;">
        <h2 style="color: #157f3d; margin: 3px !important;">Justificación del alcance, articulo 10 del Reglamento para el uso de la marca país <i>esencial</i> COSTA
            RICA
        </h2>
        <p>
        </p>
        <br>
        <br>
        <br>
        <br>
    </div>

    <div style="border: 1px solid #ccc; border-radius: 8px; background: #fcfdff; margin-top: 10px; padding: 10px !important;">
        <h2 style="color: #157f3d; margin: 3px !important;">Puntos fuertes de la organización</h2>
        <p>
        </p>
        <br>
        <br>
        <br>
        <br>
    </div>

    <div style="border: 1px solid #ccc; border-radius: 8px; background: #fcfdff; margin-top: 10px; padding: 10px !important;">
        <h2 style="color: #157f3d; margin: 3px !important;">Oportunidades de mejora de la organización</h2>
        <p>
        </p>
        <br>
        <br>
        <br>
        <br>
    </div>

    <h2>Datos participantes clave</h2>
    <table>
        <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Rol</th>
        </tr>

        <tr>
            <td style="color: white;">i</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td style="color: white;">i</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td style="color: white;">i</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td style="color: white;">i</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

    </table>

    <div style="page-break-after: always;"></div>

    <h2>Certificaciones vigentes</h2>
    <table>
        <tr>
            <th>Certificación</th>
            <th>Fecha de obtención</th>
            <th>Fecha de vencimiento</th>
            <th>Organismo certificador</th>
        </tr>

        <tr>
            <td style="width: 45%; color: white;">i</td>
            <td style="width: 15%;"></td>
            <td style="width: 15%;"></td>
            <td style="width: 25%;"></td>
        </tr>

        <tr>
            <td style="width: 45%; color: white;">i</td>
            <td style="width: 15%;"></td>
            <td style="width: 15%;"></td>
            <td style="width: 25%;"></td>
        </tr>

        <tr>
            <td style="width: 45%; color: white;">i</td>
            <td style="width: 15%;"></td>
            <td style="width: 15%;"></td>
            <td style="width: 25%;"></td>
        </tr>

        <tr>
            <td style="width: 45%; color: white;">i</td>
            <td style="width: 15%;"></td>
            <td style="width: 15%;"></td>
            <td style="width: 25%;"></td>
        </tr>

    </table>


    <h2>Datos complementarios a la función central</h2>
    <div class="indicator-section">
        <p><strong>¿Tiene la organización multi-sitio?</strong>

        </p>


        <p><strong>Cantidad de multi-sitio evaluados:</strong>

        </p>

        <p><strong>¿La organización ha aprobado la evaluación de los multi-sitio?</strong>

        </p>

        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">
                <strong>Importante:</strong> En el caso de organizaciones multi-sitio, la función central de la
                organización debe ser siempre evaluada.
                La evaluación del resto de sitios se debe basar en muestreo e incluir al menos un número igual a la
                raíz
                cuadrada del total de sitios adicionales a la función central.
            </p>
        </div>

    </div>

    <h2>Datos de contacto</h2>


    <h3>Contacto para recibir Notificaciones de Marca País</h3>
    <p><strong>Nombre del contacto:</strong>
    </p>
    <p><strong>Posición dentro de la organización:</strong>
    </p>
    <p><strong>Correo electrónico:</strong>
    </p>
    {{-- <p><strong>Cédula:</strong> {{ $company->infoAdicional->contacto_notificacion_cedula ?? 'N/A' }}</p> --}}
    <p><strong>Teléfono:</strong>
    </p>
    <p><strong>Celular:</strong>
    </p>

    <div style="height: 1px; width: 100%; background-color: #ccc; margin-top: 10px; margin-bottom: 10px;"></div>

    <h3>Contacto asignado para el proceso de licenciamiento de la Marca País</h3>
    <p><strong>Nombre del contacto:</strong>
    </p>
    <p><strong>Posición dentro de la organización:</strong>
    </p>
    <p><strong>Correo electrónico:</strong>
    </p>
    {{-- <p><strong>Cédula:</strong> {{ $company->infoAdicional->asignado_proceso_cedula ?? 'N/A' }}</p> --}}
    <p><strong>Teléfono:</strong>
    </p>
    <p><strong>Celular:</strong>
    </p>

    <div style="height: 1px; width: 100%; background-color: #ccc; margin-top: 10px; margin-bottom: 10px;"></div>

    <div style="page-break-after: always;"></div>


    <h3>Contacto del Representante Legal o Gerente General (Presidente o CEO de su organización)</h3>
    <p><strong>Nombre del contacto:</strong>
    </p>
    <p><strong>Posición dentro de la organización:</strong>
    </p>
    <p><strong>Cédula:</strong>
    </p>
    <p><strong>Correo electrónico:</strong>
    </p>
    <p><strong>Teléfono:</strong>
    </p>
    <p><strong>Celular:</strong>
    </p>

    <div style="height: 1px; width: 100%; background-color: #ccc; margin-top: 10px; margin-bottom: 10px;"></div>

    <h3>Contacto Vocero de la empresa</h3>
    <p><strong>Nombre del contacto:</strong>
    </p>
    <p><strong>Posición dentro de la organización:</strong>
    </p>
    <p><strong>Correo electrónico:</strong>
    </p>
    <p><strong>Teléfono:</strong>
    </p>
    <p><strong>Celular:</strong>
    </p>

    <div style="height: 1px; width: 100%; background-color: #ccc; margin-top: 10px; margin-bottom: 10px;"></div>

    <h3>Contacto de su área de Mercadeo</h3>
    <p><strong>Nombre del contacto:</strong>
    </p>
    <p><strong>Posición dentro de la organización:</strong>
    </p>
    <p><strong>Correo electrónico:</strong>
    </p>
    <p><strong>Teléfono:</strong>
    </p>
    <p><strong>Celular:</strong>
    </p>

    <div style="height: 1px; width: 100%; background-color: #ccc; margin-top: 10px; margin-bottom: 10px;"></div>

    <h3>Contacto Micrositio en web esencial</h3>
    <p><strong>Nombre del contacto:</strong>
    </p>
    <p><strong>Posición dentro de la organización:</strong>
    </p>
    <p><strong>Correo electrónico:</strong>
    </p>
    <p><strong>Teléfono:</strong>
    </p>
    <p><strong>Celular:</strong>
    </p>

    <div style="page-break-after: always;"></div>

    <h2>Datos del equipo evaluador</h2>
    <table>
        <tr>
            <th style="width: 35%;">Nombre del Organismo Evaluador</th>
            <th style="width: 15%;">Nombre del Evaluador</th>
            {{-- <th>Cédula</th> --}}
            <th style="width: 35%;">Correo electrónico</th>
            <th style="width: 15%;">Teléfono</th>
        </tr>
        <tr>
            <td style="color: white;">i</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td style="color: white;">i</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td style="color: white;">i</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td style="color: white;">i</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <h2>Descripción y justificación de cumplimiento del protocolo</h2>
    <p><strong>Indicadores de marca país esencial COSTA RICA</strong></p>
    <p>Todo cumplimiento o incumplimiento de indicador debe ser justificado de acuerdo a los requisitos generales.</p>

    @foreach ($values as $value)
        <h3>{{ $value->name }}</h3>
        <div class="score">
            <p><strong>Calificación obtenida:</strong> </p>
            {{-- <p><strong>Calificación mínima requerida:</strong> {{ $value->minimum_score }}%</p> --}}
            <p><strong>Calificación mínima requerida:</strong></p>
            <p><strong>Estado:</strong>

            </p>
        </div>

        @if (isset($indicatorsByValue[$value->id]))
            @foreach ($indicatorsByValue[$value->id] as $indicator)
                <div class="indicator-section">
                    <h4>{{ $indicator->name }}</h4>
                    {{-- <p><strong>Valor:</strong> <span style="color: #157f3d;">{{ $indicator->value->name }}</span></p> --}}
                    <p><strong>Componente:</strong> <span
                            style="color: #157f3d;">{{ $indicator->subcategory->name }}</span></p>
                    <p><strong>Requisito:</strong> <span
                            style="color: #157f3d;">{{ $indicator->requisito->name }}</span></p>

                    <!-- Pregunta de autoevaluación -->
                    <div class="auto-evaluation-section">
                        <h5>Autoevaluación @if ($indicator->binding)
                                <span class="descalificatorio">
                                    Indicador descalificatorio
                                </span>
                            @endif
                        </h5>

                        <div class="question-box">
                            <p><strong>Pregunta:</strong> {{ $indicator->self_evaluation_question }} </p>
                        </div>

                        @if (isset($autoEvaluationAnswers[$indicator->id]) && $autoEvaluationAnswers[$indicator->id]->count() > 0)
                            @foreach ($autoEvaluationAnswers[$indicator->id] as $autoAnswer)
                                <div class="answer-box">
                                    <p><strong>Respuesta:</strong>
                                        <span class="">
                                            
                                        </span>
                                    </p>
                                    @if ($autoAnswer->justification)
                                        <p><strong>Justificación:</strong> <span
                                                class="justification">{{ $autoAnswer->justification }}</span></p>
                                    @endif
                                </div>
                            @endforeach
                        @else
                            <div class="answer-box">
                                <p><strong>Respuesta:</strong> <span class=""></span></p>
                            </div>
                        @endif
                    </div>

                    <h5>Evaluación @if ($indicator->binding)
                            <span class="descalificatorio">
                                Indicador descalificatorio
                            </span>
                        @endif
                    </h5>
                    <table>
                        <tr>
                            <th>Pregunta</th>
                            <th>Cumple</th>
                            <th>Justificación</th>
                        </tr>
                        @foreach ($indicator->evaluationQuestions as $question)
                            <tr>
                                <td style="width: 40%;">{{ $question->question }}</td>
                                <td style="width: 10%;"></td>
                                <td style="width: 50%;"></td>
                            </tr>
                        @endforeach
                    </table>

                    {{--
                    <h5>Evaluación</h5>
                    <table>
                        <tr>
                            <th>Pregunta</th>
                            <th>Respuesta de la empresa</th>
                            <th>Cumplimiento</th>
                            <th>Comentario del evaluador</th>
                        </tr>
                        @foreach ($indicator->evaluationQuestions as $question)
                            <tr>
                                <td>{{ $question->question }}</td>
                                <td>
                                    @if (isset($companyAnswers[$indicator->id]))
                                        @foreach ($companyAnswers[$indicator->id] as $answer)
                                            @if ($answer->evaluation_question_id == $question->id)
                                                <p><strong>Respuesta:</strong> {{ $answer->answer == 1 ? 'Sí' : 'No' }}
                                                </p>
                                                <p><strong>Justificación:</strong> {{ $answer->description }}</p>
                                                @if ($answer->file_path)
                                                    <p><strong>Archivos adjuntos:</strong> Sí</p>
                                                @endif
                                            @endif
                                        @endforeach
                                    @else
                                        <p>Sin respuesta</p>
                                    @endif
                                </td>
                                <td class="text-center">
                                    @if (isset($evaluatorAssessments[$indicator->id]))
                                        @foreach ($evaluatorAssessments[$indicator->id] as $assessment)
                                            @if ($assessment->evaluation_question_id == $question->id)
                                                @if ($assessment->approved)
                                                    <span class="approved">Sí</span>
                                                @else
                                                    <span class="not-approved">No</span>
                                                @endif
                                            @endif
                                        @endforeach
                                    @else
                                        <span>No evaluado</span>
                                    @endif
                                </td>
                                <td>
                                    @if (isset($evaluatorAssessments[$indicator->id]))
                                        @foreach ($evaluatorAssessments[$indicator->id] as $assessment)
                                            @if ($assessment->evaluation_question_id == $question->id)
                                                <span class="comment">{{ $assessment->comment }}</span>
                                            @endif
                                        @endforeach
                                    @endif
                    
                                </td>
                            </tr>
                        @endforeach
                    </table>
                    --}}
                </div>
            @endforeach
        @else
            <p>No hay indicadores para este valor.</p>
        @endif

        <div class="page-break"></div>
    @endforeach


    {{-- 
    <h2>Descripción y justificación de cumplimiento del protocolo</h2>
    <p><strong>Indicadores de marca país esencial COSTA RICA</strong></p>
    <p>Todo cumplimiento o incumplimiento de indicador debe ser justificado de acuerdo a los requisitos generales.</p>

    @foreach ($values as $value)
        <h3>{{ $value->name }}</h3>
        <div class="score">
            <p><strong>Puntuación obtenida:</strong> {{ $finalScores[$value->id]->nota ?? 0 }}/100</p>
            <p><strong>Nota mínima requerida:</strong> {{ $value->minimum_score }}</p>
        </div>

        <table>
            <tr>
                <th>Componente</th>
                <th>Requisito</th>
                <th>Indicador</th>
                <th>Cumplimiento</th>
                <th>Justificación</th>
            </tr>
            @foreach ($value->subcategories as $subcategory)
                @foreach ($subcategory->indicators as $indicator)
                    <tr>
                        <td>{{ $subcategory->name }}</td>
                        <td>{{ $indicator->requisito->name ?? 'N/A' }}</td>
                        <td>
                            {{ $indicator->name }}
                            @if ($indicator->binding)
                                <span class="binding">(Vinculante)</span>
                            @endif
                        </td>
                        <td>
                            @if (isset($answers[$value->id]))
                                {{ $answers[$value->id]->firstWhere('indicator_id', $indicator->id)->answer === '1' ? 'Sí' : 'No' }}
                            @else
                                No respondida
                            @endif
                        </td>
                        <td>{{ $indicator->self_evaluation_question }}</td>
                    </tr>
                @endforeach
            @endforeach
        </table>

        @if (!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach --}}

    <h3>Disposiciones finales</h3>
    <ol>
        <li>La organización se quedará con copia de este informe.</li>
        <li>Los no cumplimientos han sido aclarados y entendidos.</li>
    </ol>

    <h3>Anexos</h3>
    <ul>
        <li>Copia del informe técnico de cumplimiento del protocolo de evaluación.</li>
        <li>Certificación de personería con no más de tres meses de emitida.</li>
        <li>Copia de la cédula de identidad del representante legal.</li>
    </ul>

    <h3>Declaraciones Juradas</h3>

    <h1>DECLARO BAJO LA FE DEL JURAMENTO LO SIGUIENTE:</h1>

    <h2>Solicitante de Licencia</h2>
    <p><strong>Primero:</strong> Que la información suministrada y las evidencias aportadas durante la evaluación de
        la
        Marca País son verídicas y representan la realidad de la organización evaluada.</p>
    <p><strong>Segundo:</strong> Que mi representada se encuentra al día con el pago de los tributos nacionales,
        municipales y demás obligaciones tributarias.</p>
    <p><strong>Tercero:</strong> Quien suscribe, solicita la licencia de uso corporativo de la marca país esencial
        COSTA
        RICA. Asimismo, declaro que conozco, acepto y me comprometo a que mi representada acate todos los
        lineamientos
        de uso de la marca, debiendo ajustarse en todo momento a los requerimientos, deberes, obligaciones y
        restricciones estipuladas en el Reglamento para la implementación y uso de la marca país esencial COSTA
        RICA.
    </p>

    <h2>Evaluador de la Marca País</h2>
    <p><strong>Primero:</strong> Que en la evaluación realizada por mi persona a la empresa, no existió ningún
        conflicto
        de interés.</p>
    <p><strong>Segundo:</strong> Que no he tenido relación con la empresa evaluada, ni con los empleados,
        propietarios,
        socios, representantes legales, proveedores o consultores relacionados con la empresa evaluada.</p>
    <p><strong>Tercero:</strong> Que no he trabajado ni he brindado servicio de asesoría a la empresa a evaluar en
        los
        últimos 2 años.</p>
    <p><strong>Cuarto:</strong> Que no tengo ninguna relación de parentesco, afinidad y consanguinidad hasta el
        segundo
        grado con la persona evaluada.</p>
    <p><strong>Quinto:</strong> Hago la presente declaración bajo advertencia de las penas por falso testimonio que
        contempla el Código Penal.</p>

    <div class="page-break"></div>

    <h2>Firma</h2>
    <table class="signature-table">
        <tr>
            <td>
                <div class="signature-line">
                    <p><strong>REPRESENTANTE DE LA ORGANIZACIÓN</strong></p>
                </div>
            </td>
            <td>
                <div class="signature-line">
                    <p><strong>EVALUADOR</strong></p>
                </div>
            </td>
        </tr>
    </table>

    <div style="margin-top: 50px;">
        <p class="text-center">Este informe ha sido generado automáticamente por el sistema de evaluación del Protocolo
            Marca País.</p>
        <p class="text-center">© {{ date('Y') }} - Todos los derechos reservados</p>
    </div>

    <div class="full-page">
        i
        <img src="/public/assets/img/ESE_FEB_Descargable_Informe-02.jpg" alt="Logo"
            style="position: absolute; top:0; left: 0; width: 100%; height: 100%; object-fit: cover;">
    </div>
</body>

</html>
