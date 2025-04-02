<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe de Evaluación</title>
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

    {{-- @if (str_contains($company->evaluation_document_path ?? '', 'draft')) --}}
    @if ($company->estado_eval !== 'evaluacion-calificada' && $company->estado_eval !== 'evaluado')
        <div
            style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(128, 128, 128, 0.2); z-index: 1000;">
            BORRADOR
        </div>
    @endif

    <div class="evaluation-status">
        @php
            $hasFailedBindingIndicators = false;
            foreach ($values as $value) {
                if (isset($indicatorsByValue[$value->id])) {
                    foreach ($indicatorsByValue[$value->id] as $indicator) {
                        if ($indicator->binding) {
                            foreach ($indicator->evaluationQuestions as $question) {
                                if (isset($evaluatorAssessments[$indicator->id])) {
                                    foreach ($evaluatorAssessments[$indicator->id] as $assessment) {
                                        if (
                                            $assessment->evaluation_question_id == $question->id &&
                                            !$assessment->approved
                                        ) {
                                            $hasFailedBindingIndicators = true;
                                            break 4;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        @endphp

        @if ($hasFailedBindingIndicators)
            <div class="evaluation-result failed">
                <div class="result-header">
                    <svg class="icon-warning" viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
                        <path fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                    <h2>EVALUACIÓN NO APROBADA</h2>
                </div>
                <p>La empresa no ha aprobado uno o más indicadores descalificatorios, lo cual impide la obtención de la
                    licencia.</p>
            </div>
        @else
            {{-- <div class="evaluation-result passed">
                <div class="result-header">
                    <svg class="icon-success" viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    <h2>EVALUACIÓN APROBADA</h2>
                </div>
                <p>La empresa ha cumplido con todos los indicadores descalificatorios requeridos.</p>
            </div> --}}
        @endif
    </div>

    <div class="evaluation-info">
        <p><strong style="font-weight: bold; font-size: 15px;">Fecha de evaluación:</strong> {{ $date }}</p>
        <p><strong style="font-weight: bold; font-size: 15px;">Evaluador:</strong> {{ $evaluador->name }}
            {{ $evaluador->lastname }}</p>
        <p><strong style="font-weight: bold; font-size: 15px;">Correo electrónico:</strong> {{ $evaluador->email }}</p>
    </div>

    <h2>Datos de la organización</h2>
    <p><strong style="font-weight: bold; font-size: 15px;">Nombre comercial:</strong>
        {{ $company->infoAdicional->nombre_comercial ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Razón social:</strong>
        {{ $company->infoAdicional->nombre_legal ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Cédula jurídica:</strong>
        {{ $company->infoAdicional->cedula_juridica ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Descripción:</strong>
        {{ $company->infoAdicional->descripcion_es ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Actividad comercial:</strong>
        {{ $company->infoAdicional->actividad_comercial ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Año de fundación:</strong>
        {{ $company->infoAdicional->anio_fundacion ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Proceso de licenciamiento:</strong>
        {{ $company->infoAdicional->proceso_licenciamiento ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Exporta actualmente:</strong>
        {{ $company->infoAdicional->es_exportadora ? 'Sí' : 'No' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Países de exportación:</strong></p>
    @if ($company->infoAdicional->paises_exportacion && $company->infoAdicional->paises_exportacion != 'N/A')
        @php
            $paises = array_map('trim', explode(',', $company->infoAdicional->paises_exportacion));
            $columnas = 3;
            $filas = ceil(count($paises) / $columnas);
        @endphp

        <table class="paises-exportacion" style="width: 100%; border-collapse: collapse;">
            @for ($i = 0; $i < $filas; $i++)
                <tr>
                    @for ($j = 0; $j < $columnas; $j++)
                        @php $index = $i + ($j * $filas); @endphp
                        <td style="padding: 2px 10px; text-align: left;">
                            @if (isset($paises[$index]))
                                - {{ $paises[$index] }}
                            @endif
                        </td>
                    @endfor
                </tr>
            @endfor
        </table>
    @else
        <p style="margin-left: 20px;">N/A</p>
    @endif


    <p><strong style="font-weight: bold; font-size: 15px;">Productos/servicios:</strong>
        {{ $company->infoAdicional->producto_servicio ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Rango de exportaciones:</strong>
        {{ $company->infoAdicional->rango_exportaciones ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Total de empleados:</strong>
        {{ $company->infoAdicional->cantidad_hombres + $company->infoAdicional->cantidad_mujeres + $company->infoAdicional->cantidad_otros }}
    </p>
    <p><strong style="font-weight: bold; font-size: 15px;">Distribución de empleados:</strong></p>
    <p>- Hombres: {{ $company->infoAdicional->cantidad_hombres ?? 0 }}</p>
    <p>- Mujeres: {{ $company->infoAdicional->cantidad_mujeres ?? 0 }}</p>
    <p>- Otros: {{ $company->infoAdicional->cantidad_otros ?? 0 }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Dirección:</strong>
        {{ $company->infoAdicional->direccion_empresa ?? 'N/A' }}</p>
    <p>- Provincia: {{ $company->provincia ?? 'N/A' }}</p>
    <p>- Cantón: {{ $company->canton ?? 'N/A' }}</p>
    <p>- Distrito: {{ $company->distrito ?? 'N/A' }}</p>
    <p><strong style="font-weight: bold; font-size: 15px;">Redes sociales:</strong></p>
    <p>- Sitio web: <a href="{{ $company->infoAdicional->sitio_web }}">{{ $company->infoAdicional->sitio_web }}</a>
    </p>
    <p>- Facebook: <a href="{{ $company->infoAdicional->facebook }}">{{ $company->infoAdicional->facebook }}</a></p>
    <p>- Instagram: <a href="{{ $company->infoAdicional->instagram }}">{{ $company->infoAdicional->instagram }}</a>
    </p>
    <p>- LinkedIn: <a href="{{ $company->infoAdicional->linkedin }}">{{ $company->infoAdicional->linkedin }}</a></p>

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
                <td>{{ $value->minimum_score }}%</td>
                <td>{{ $finalScores[$value->id]->nota ?? 0 }}%</td>
            </tr>
        @endforeach
    </table>

    <h2>Puntos fuertes de la organización</h2>
    <p>{{ $company->infoAdicional->puntos_fuertes ?? 'N/A' }}</p>

    <h2>Oportunidades de mejora de la organización</h2>
    <p>{{ $company->infoAdicional->oportunidades ?? 'N/A' }}</p>

    <h2>Justificación del alcance, articulo 10 del Reglamento para el uso de la marca país <i>esencial</i> COSTA RICA
    </h2>
    <p>{{ $company->infoAdicional->justificacion ?? 'N/A' }}</p>

    <h2>Datos participantes clave</h2>
    <table>
        <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Rol</th>
        </tr>
        @foreach ($company->users as $user)
            @if ($user->role !== 'evaluador' && $user->role !== 'super_admin')
                <tr>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->lastname }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->phone }}</td>
                    <td>{{ $user->role == 'admin' ? 'Administrador' : 'Usuario' }}</td>
                </tr>
            @endif
        @endforeach
    </table>

    @if ($company->certifications->isNotEmpty())
        <h2>Certificaciones vigentes</h2>
        <table>
            <tr>
                <th>Certificación</th>
                <th>Fecha de obtención</th>
                <th>Fecha de vencimiento</th>
                <th>Organismo certificador</th>
            </tr>
            @foreach ($company->certifications as $certification)
                <tr>
                    <td>{{ $certification->nombre }}</td>
                    <td>{{ $certification->fecha_obtencion->format('d/m/Y') }}</td>
                    <td>{{ $certification->fecha_expiracion->format('d/m/Y') }}</td>
                    <td>{{ $certification->organismo_certificador }}</td>
                </tr>
            @endforeach
        </table>
    @endif

    {{-- <h2>Datos complementarios: función central</h2>
    <p><strong>Organización multi-sitio:</strong> Sí [ ] No [ ]</p>

    <h3>Emplazamientos Evaluados</h3>
    <p><strong>Nombre comercial:</strong></p>
    <p><strong>Dirección:</strong> Provincia Cantón Distrito Dirección</p>
    <p><strong>Empleados:</strong></p>
    <p>Hombres <input type="text" size="5"> Mujeres <input type="text" size="5"> Otros <input type="text" size="5"></p> --}}

    {{-- <h2>Puntos fuertes de la organización:</h2>
    <p></p>

    <h2>Oportunidades de mejora de la organización:</h2>
    <p></p> --}}

    <h2>Datos de contacto</h2>

    @if ($company->infoAdicional->contacto_notificacion_nombre)
        <h3>Contacto para recibir Notificaciones de Marca País</h3>
        <p><strong>Nombre del contacto:</strong> {{ $company->infoAdicional->contacto_notificacion_nombre ?? 'N/A' }}
        </p>
        <p><strong>Posición dentro de la organización:</strong>
            {{ $company->infoAdicional->contacto_notificacion_puesto ?? 'N/A' }}</p>
        <p><strong>Correo electrónico:</strong> {{ $company->infoAdicional->contacto_notificacion_email ?? 'N/A' }}</p>
        {{-- <p><strong>Cédula:</strong> {{ $company->infoAdicional->contacto_notificacion_cedula ?? 'N/A' }}</p> --}}
        <p><strong>Teléfono:</strong> {{ $company->infoAdicional->contacto_notificacion_telefono ?? 'N/A' }}
            <strong>Celular:</strong> {{ $company->infoAdicional->contacto_notificacion_celular ?? 'N/A' }}
        </p>
    @endif

    @if ($company->infoAdicional->asignado_proceso_nombre)
        <h3>Contacto asignado para el proceso de licenciamiento de la Marca País</h3>
        <p><strong>Nombre del contacto:</strong> {{ $company->infoAdicional->asignado_proceso_nombre ?? 'N/A' }}</p>
        <p><strong>Posición dentro de la organización:</strong>
            {{ $company->infoAdicional->asignado_proceso_puesto ?? 'N/A' }}</p>
        <p><strong>Correo electrónico:</strong> {{ $company->infoAdicional->asignado_proceso_email ?? 'N/A' }}</p>
        {{-- <p><strong>Cédula:</strong> {{ $company->infoAdicional->asignado_proceso_cedula ?? 'N/A' }}</p> --}}
        <p><strong>Teléfono:</strong> {{ $company->infoAdicional->asignado_proceso_telefono ?? 'N/A' }}
            <strong>Celular:</strong> {{ $company->infoAdicional->asignado_proceso_celular ?? 'N/A' }}
        </p>
    @endif

    @if ($company->infoAdicional->representante_nombre)
        <h3>Contacto del Representante Legal o Gerente General (Presidente o CEO de su organización)</h3>
        <p><strong>Nombre del contacto:</strong> {{ $company->infoAdicional->representante_nombre ?? 'N/A' }}</p>
        <p><strong>Posición dentro de la organización:</strong>
            {{ $company->infoAdicional->representante_puesto ?? 'N/A' }}</p>
        <p><strong>Cédula:</strong> {{ $company->infoAdicional->representante_cedula ?? 'N/A' }}</p>
        <p><strong>Correo electrónico:</strong> {{ $company->infoAdicional->representante_email ?? 'N/A' }}</p>
        <p><strong>Teléfono:</strong> {{ $company->infoAdicional->representante_telefono ?? 'N/A' }}
            <strong>Celular:</strong> {{ $company->infoAdicional->representante_celular ?? 'N/A' }}
        </p>
    @endif

    @if ($company->infoAdicional->vocero_nombre)
        <h3>Contacto Vocero de la empresa</h3>
        <p><strong>Nombre del contacto:</strong> {{ $company->infoAdicional->vocero_nombre ?? 'N/A' }}</p>
        <p><strong>Posición dentro de la organización:</strong>
            {{ $company->infoAdicional->vocero_puesto ?? 'N/A' }}</p>
        <p><strong>Correo electrónico:</strong> {{ $company->infoAdicional->vocero_email ?? 'N/A' }}</p>
        <p><strong>Teléfono:</strong> {{ $company->infoAdicional->vocero_telefono ?? 'N/A' }}
            <strong>Celular:</strong> {{ $company->infoAdicional->vocero_celular ?? 'N/A' }}
        </p>
    @endif

    @if ($company->infoAdicional->mercadeo_nombre)
        <h3>Contacto de su área de Mercadeo</h3>
        <p><strong>Nombre del contacto:</strong> {{ $company->infoAdicional->mercadeo_nombre ?? 'N/A' }}</p>
        <p><strong>Posición dentro de la organización:</strong> {{ $company->infoAdicional->mercadeo_puesto ?? 'N/A' }}
        </p>
        <p><strong>Correo electrónico:</strong> {{ $company->infoAdicional->mercadeo_email ?? 'N/A' }}</p>
        <p><strong>Teléfono:</strong> {{ $company->infoAdicional->mercadeo_telefono ?? 'N/A' }}
            <strong>Celular:</strong>
            {{ $company->infoAdicional->mercadeo_celular ?? 'N/A' }}
        </p>
    @endif

    @if ($company->infoAdicional->micrositio_nombre)
        <h3>Contacto Micrositio en web esencial</h3>
        <p><strong>Nombre del contacto:</strong> {{ $company->infoAdicional->micrositio_nombre ?? 'N/A' }}</p>
        <p><strong>Posición dentro de la organización:</strong>
            {{ $company->infoAdicional->micrositio_puesto ?? 'N/A' }}
        </p>
        <p><strong>Correo electrónico:</strong> {{ $company->infoAdicional->micrositio_email ?? 'N/A' }}</p>
        <p><strong>Teléfono:</strong> {{ $company->infoAdicional->micrositio_telefono ?? 'N/A' }}
            <strong>Celular:</strong>
            {{ $company->infoAdicional->micrositio_celular ?? 'N/A' }}
        </p>
    @endif

    <h2>Datos del equipo evaluador</h2>
    <table>
        <tr>
            <th>Nombre del Organismo Evaluador</th>
            <th>Nombre del Evaluador</th>
            {{-- <th>Cédula</th> --}}
            <th>Correo electrónico</th>
            <th>Teléfono</th>
        </tr>
        <tr>
            <td>{{ $evaluador->organismo ?? 'N/A' }}</td>
            <td>{{ $evaluador->name }} {{ $evaluador->lastname }}</td>
            {{-- <td>{{ $evaluador->cedula }}</td> --}}
            <td>{{ $evaluador->email }}</td>
            <td>{{ $evaluador->phone }}</td>
        </tr>
    </table>

    <h2>Descripción y justificación de cumplimiento del protocolo</h2>
    <p><strong>Indicadores de marca país esencial COSTA RICA</strong></p>
    <p>Todo cumplimiento o incumplimiento de indicador debe ser justificado de acuerdo a los requisitos generales.</p>

    @foreach ($values as $value)
        <h3>{{ $value->name }}</h3>
        <div class="score">
            <p><strong>Calificación obtenida:</strong> {{ $finalScores[$value->id]->nota ?? 0 }}%</p>
            <p><strong>Calificación mínima requerida:</strong> {{ $value->minimum_score }}%</p>
            <p><strong>Estado:</strong>
                @if (($finalScores[$value->id]->nota ?? 0) >= $value->minimum_score)
                    <span class="approved">Aprobado</span>
                @else
                    <span class="not-approved">No aprobado</span>
                @endif
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
                                    Indicador descalificatório
                                </span>
                            @endif
                        </h5>
                        @if ($indicator->self_evaluation_question)
                            <div class="question-box">
                                <p><strong>Pregunta:</strong> {{ $indicator->self_evaluation_question }} </p>
                            </div>

                            @if (isset($autoEvaluationAnswers[$indicator->id]))
                                @foreach ($autoEvaluationAnswers[$indicator->id] as $autoAnswer)
                                    <div class="answer-box">
                                        <p><strong>Respuesta:</strong>
                                            <span class="{{ $autoAnswer->answer == 1 ? 'approved' : 'not-approved' }}">
                                                @if ($indicator->is_binary)
                                                    {{ $autoAnswer->answer == 1 ? 'Sí' : 'No' }}
                                                @else
                                                    {{ $autoAnswer->justification }}
                                                @endif
                                            </span>
                                        </p>
                                        {{-- @if ($autoAnswer->justification)
                                            <p><strong>Justificación:</strong> <span
                                                    class="justification">{{ $autoAnswer->justification }}</span></p>
                                        @endif --}}
                                    </div>
                                @endforeach
                            @else
                                <div class="answer-box">
                                    <p><em>No se encontró respuesta de autoevaluación para este indicador.</em></p>
                                </div>
                            @endif
                        @else
                            <div class="answer-box">
                                <p><em>Este indicador no tiene pregunta de autoevaluación definida.</em></p>
                            </div>
                        @endif
                    </div>

                    <h5>Evaluación @if ($indicator->binding)
                            <span class="descalificatorio">
                                Indicador descalificatório
                            </span>
                        @endif
                    </h5>
                    <table>
                        <tr>
                            <th>Pregunta</th>
                            {{-- <th>Respuesta</th> --}}
                            <th>Cumple</th>
                            <th>Justificación</th>
                        </tr>
                        @foreach ($indicator->evaluationQuestions as $question)
                            <tr>
                                <td>{{ $question->question }}</td>
                                {{-- <td>
                                    @if (isset($companyAnswers[$indicator->id]))
                                        @foreach ($companyAnswers[$indicator->id] as $answer)
                                            @if ($answer->evaluation_question_id == $question->id)
                                                <p>{{ $answer->answer == 1 ? 'Sí' : 'No' }}</p>
                                            @endif
                                        @endforeach
                                    @else
                                        <p>Sin respuesta</p>
                                    @endif
                                </td> --}}
                                <td class="">
                                    @if (isset($evaluatorAssessments[$indicator->id]))
                                        @foreach ($evaluatorAssessments[$indicator->id] as $assessment)
                                            @if ($assessment->evaluation_question_id == $question->id)
                                                @if ($assessment->approved)
                                                    <span class="approved">Sí</span>
                                                    {{-- <p>Comentario del evaluador: {{ $assessment->comment }}</p> --}}
                                                @else
                                                    <span class="not-approved">No</span>
                                                    {{-- <p><strong>Comentario del evaluador:</strong>
                                                        {{ $assessment->comment }}</p> --}}
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
                                                <p>{{ $assessment->comment }}</p>
                                            @endif
                                        @endforeach
                                    @else
                                        <p>Sin respuesta</p>
                                    @endif
                                </td>
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
