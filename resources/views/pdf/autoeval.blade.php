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
            background-color: #007b00;
            padding: 15px;
            color: white;
            margin-bottom: 20px;
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
            color: #007b00;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        p {
            margin: 10px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            background-color: white;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #007b00;
            color: white;
        }

        .highlight {
            background-color: yellow;
            font-weight: bold;
        }

        .signature-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .signature-box {
            width: 45%;
            border-top: 1px solid #333;
            text-align: center;
            padding-top: 10px;
        }
    </style>
</head>

<body>
    <header>
        <img src="/public/assets/img/logo_esc_white.png" alt="Logo">
        <h1>Informe de Evaluación del Protocolo Marca País</h1>
    </header>

    <h2>Datos de la organización</h2>
    <p><strong>Nombre comercial:</strong></p>
    <p><strong>Razón social:</strong></p>
    <p><strong>Cédula jurídica:</strong></p>
    <p><strong>Descripción:</strong></p>
    <p><strong>Exporta actualmente:</strong> Sí [ ] No [ ]</p>
    <p><strong>Productos/servicios:</strong></p>

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
            <th>Departamento</th>
            <th>Posición</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <h2>Certificaciones vigentes</h2>
    <table>
        <tr>
            <th>Certificación</th>
            <th>Fecha de vencimiento</th>
            <th>Organismo certificador</th>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <h2>Datos complementarios: función central</h2>
    <p><strong>Organización multi-sitio:</strong> Sí [ ] No [ ]</p>

    <h3>Emplazamientos Evaluados</h3>
    <p><strong>Nombre comercial:</strong></p>
    <p><strong>Dirección:</strong> Provincia Cantón Distrito Dirección</p>
    <p><strong>Empleados:</strong> Hombres Mujeres Otros</p>

    <h2>Puntos fuertes de la organización:</h2>
    <p></p>

    <h2>Oportunidades de mejora de la organización:</h2>
    <p></p>

    <h3>Datos participantes clave en el proceso de evaluación</h3>
    <table border="1">
        <tr>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Posición</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <h3>Certificaciones vigentes de la organización que justifican homologaciones dadas</h3>
    <table border="1">
        <tr>
            <th>Certificación</th>
            <th>Fecha de vencimiento</th>
            <th>Organismo certificador</th>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <h3>Datos complementarios: función central</h3>
    <p>¿La organización es multi-sitio? Si <input type="checkbox"> No <input type="checkbox"></p>

    <h3>Emplazamientos Evaluados</h3>
    <p><strong>Nombre comercial de la empresa:</strong></p>
    <p><strong>Dirección:</strong> Provincia Cantón Distrito Dirección</p>
    <p><strong>¿Cuántas personas emplea?</strong></p>
    <p>Hombres <input type="text" size="5"> Mujeres <input type="text" size="5"> Otros <input type="text" size="5"></p>


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
    <p>Todo cumplimiento o incumplimiento de indicador debe ser justificado de acuerdo a los requisitos generales.
    </p>

    <p class="highlight">TODO ESTE CUADRO ES EL</p>
    <p class="highlight">EXCEL ADJUNTO</p>
    <p><strong>PORFA REVISEMOS EN CONJUNTO PARA VER COMO ES LA MEJOR OPCIÓN DE PODER TENER LA INFO</strong></p>

    @foreach($values as $value)
        <h3>{{ $value->name }}</h3>
        <div class="score">
            <p><strong>Puntuación obtenida:</strong> {{ $finalScores[$value->id]->nota ?? 0 }}/100</p>
            <p><strong>Nota mínima requerida:</strong> {{ $value->minimum_score }}</p>
        </div>

        <table border="1">
            <tr>
                <th>Componente</th>
                <th>Requisito</th>
                <th>Indicador</th>
                <th>Cumplimiento</th>
                <th>Justificación</th>
            </tr>
            @foreach($value->subcategories as $subcategory)
                @foreach($subcategory->indicators as $indicator)
                    <tr>
                        <td>{{ $subcategory->name }}</td>
                        <td></td>
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
                        <td>{{ $indicator->self_evaluation_question }}</td>
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
    <div class="signature-container">
        <div class="signature-box">
            <p><strong>REPRESENTANTE DE LA ORGANIZACIÓN</strong></p>
            <p>(Nombre, firma y número de cédula)</p>
        </div>
        <div class="signature-box">
            <p><strong>EVALUADOR</strong></p>
            <p>(Nombre, firma y número de carné)</p>
        </div>
    </div>

</body>

</html>