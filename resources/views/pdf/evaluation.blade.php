<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe de Evaluación</title>
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

        th, td {
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
            margin-top: 60px;
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
    </style>
</head>

<body>
    <header>
        <img src="/public/assets/img/logo_esc_white.png" alt="Logo">
        <h1>Informe de Evaluación del Protocolo Marca País</h1>
    </header>

    <h2>Datos de la organización</h2>
    <p><strong>Nombre comercial:</strong> {{ $company->infoAdicional->nombre_comercial ?? 'N/A' }}</p>
    <p><strong>Razón social:</strong> {{ $company->infoAdicional->nombre_legal ?? 'N/A' }}</p>
    <p><strong>Cédula jurídica:</strong> {{ $company->infoAdicional->cedula_juridica ?? 'N/A' }}</p>
    <p><strong>Descripción:</strong> {{ $company->infoAdicional->descripcion_es ?? 'N/A' }}</p>
    <p><strong>Año de fundación:</strong> {{ $company->infoAdicional->anio_fundacion ?? 'N/A' }}</p>
    <p><strong>Proceso de licenciamiento:</strong> {{ $company->infoAdicional->proceso_licenciamiento ?? 'N/A' }}</p>
    <p><strong>Exporta actualmente:</strong> {{ $company->infoAdicional->es_exportadora ? 'Sí' : 'No' }}</p>
    <p><strong>Países de exportación:</strong> {{ $company->infoAdicional->paises_exportacion ?? 'N/A' }}</p>
    <p><strong>Productos/servicios:</strong> {{ $company->infoAdicional->producto_servicio ?? 'N/A' }}</p>
    <p><strong>Rango de exportaciones:</strong> {{ $company->infoAdicional->rango_exportaciones ?? 'N/A' }}</p>
    <p><strong>Total de empleados:</strong> {{ $company->infoAdicional->cantidad_hombres + $company->infoAdicional->cantidad_mujeres + $company->infoAdicional->cantidad_otros }}</p>
    <p><strong>Distribución de empleados:</strong></p>
    <p>- Hombres: {{ $company->infoAdicional->cantidad_hombres ?? 0 }}</p>
    <p>- Mujeres: {{ $company->infoAdicional->cantidad_mujeres ?? 0 }}</p>
    <p>- Otros: {{ $company->infoAdicional->cantidad_otros ?? 0 }}</p>
    <p><strong>Dirección:</strong></p>
    <p>- Provincia: {{ $company->infoAdicional->provincia ?? 'N/A' }}</p>
    <p>- Cantón: {{ $company->infoAdicional->canton ?? 'N/A' }}</p>
    <p>- Distrito: {{ $company->infoAdicional->distrito ?? 'N/A' }}</p>
    <p>- Dirección: {{ $company->infoAdicional->direccion ?? 'N/A' }}</p>
    <p><strong>Redes sociales:</strong></p>
    <p>- Sitio web: <a href="{{ $company->infoAdicional->sitio_web }}">{{ $company->infoAdicional->sitio_web }}</a></p>
    <p>- Facebook: <a href="{{ $company->infoAdicional->facebook }}">{{ $company->infoAdicional->facebook }}</a></p>
    <p>- Instagram: <a href="{{ $company->infoAdicional->instagram }}">{{ $company->infoAdicional->instagram }}</a></p>
    <p>- LinkedIn: <a href="{{ $company->infoAdicional->linkedin }}">{{ $company->infoAdicional->linkedin }}</a></p>

    <h2>Resumen de evaluación</h2>
    <table>
        <tr>
            <th>Valor</th>
            <th>Calificación mínima</th>
            <th>Calificación obtenida</th>
        </tr>
        @foreach($values as $value)
            <tr>
                <td>{{ $value->name }}</td>
                <td>{{ $value->minimum_score }}%</td>
                <td>{{ $finalScores[$value->id]->nota ?? 0 }}%</td>
            </tr>
        @endforeach
    </table>

    <h2>Datos participantes clave</h2>
    <table>
        <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Rol</th>
        </tr>
        @foreach($company->users as $user)
            <tr>
                <td>{{ $user->name }}</td>
                <td>{{ $user->lastname }}</td>
                <td>{{ $user->email }}</td>
                <td>{{ $user->phone }}</td>
                <td>{{ $user->role }}</td>
            </tr>
        @endforeach
    </table>

    <h2>Certificaciones vigentes</h2>
    <table>
        <tr>
            <th>Certificación</th>
            <th>Fecha de obtención</th>
            <th>Fecha de vencimiento</th>
            <th>Organismo certificador</th>
        </tr>
        @foreach($company->certifications as $certification)
            <tr>
                <td>{{ $certification->nombre }}</td>
                <td>{{ $certification->fecha_obtencion->format('d/m/Y') }}</td>
                <td>{{ $certification->fecha_expiracion->format('d/m/Y') }}</td>
                <td>{{ $certification->organismo_certificador }}</td>
            </tr>
        @endforeach
    </table>

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
    <h3>Contacto para recibir Notificaciones de Marca País</h3>
    <p><strong>Nombre del contacto:</strong></p>
    <p><strong>Posición dentro de la organización:</strong></p>
    <p><strong>Correo electrónico:</strong></p>
    <p><strong>Teléfono:</strong> <strong>Celular:</strong></p>

    <h3>Contacto asignado para el proceso de licenciamiento de la Marca País</h3>
    <p><strong>Nombre del contacto:</strong></p>
    <p><strong>Posición dentro de la organización:</strong></p>
    <p><strong>Correo electrónico:</strong></p>
    <p><strong>Teléfono:</strong> <strong>Celular:</strong></p>

    <h3>Contacto de su área de Mercadeo</h3>
    <p><strong>Nombre del contacto:</strong></p>
    <p><strong>Posición dentro de la organización:</strong></p>
    <p><strong>Correo electrónico:</strong></p>
    <p><strong>Teléfono:</strong> <strong>Celular:</strong></p>

    <h3>Contacto Micrositio en web esencial</h3>
    <p><strong>Nombre del contacto:</strong></p>
    <p><strong>Posición dentro de la organización:</strong></p>
    <p><strong>Correo electrónico:</strong></p>
    <p><strong>Teléfono:</strong> <strong>Celular:</strong></p>

    <h3>Contacto del Representante Legal o Gerente General</h3>
    <p><strong>Nombre del contacto:</strong></p>
    <p><strong>Posición dentro de la organización:</strong></p>
    <p><strong>Cédula:</strong></p>
    <p><strong>Correo electrónico:</strong></p>
    <p><strong>Teléfono:</strong> <strong>Celular:</strong></p>

    <h2>Datos del equipo evaluador</h2>
    <table>
        <tr>
            <th>Nombre del Organismo Evaluador</th>
            <th>Nombre del Evaluador</th>
            <th>Cédula</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Celular</th>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <h2>Descripción y justificación de cumplimiento del protocolo</h2>
    <p><strong>Indicadores de marca país esencial COSTA RICA</strong></p>
    <p>Todo cumplimiento o incumplimiento de indicador debe ser justificado de acuerdo a los requisitos generales.</p>

    @foreach($values as $value)
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
                        {{-- <td>{{ $indicator->self_evaluation_question }}</td> --}}
                    </tr>
                @endforeach
            @endforeach
        </table>

        @if(!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach

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

    <h2>Firma</h2>
    <table class="signature-table">
        <tr>
            <td>
                <div class="signature-line">
                    <p><strong>REPRESENTANTE DE LA ORGANIZACIÓN</strong></p>
                    <p>(Nombre, firma y número de cédula)</p>
                </div>
            </td>
            <td>
                <div class="signature-line">
                    <p><strong>EVALUADOR</strong></p>
                    <p>(Nombre, firma y número de carné)</p>
                </div>
            </td>
        </tr>
    </table>

</body>

</html>