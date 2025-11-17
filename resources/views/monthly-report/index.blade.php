<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Reportes Mensuales</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-8">Reportes Mensuales</h1>

        <!-- Tabla -->
        <div class="bg-white rounded-lg shadow overflow-x-auto">
            @if($reports->isEmpty())
                <div class="p-8 text-center text-gray-500">
                    No hay reportes para mostrar
                </div>
            @else
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes/Año</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Empresas</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha de Generación</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        @foreach($reports as $report)
                            <tr>
                                <td class="px-6 py-4 text-sm">{{ $report->month }}/{{ $report->year }}</td>
                                <td class="px-6 py-4 text-sm">{{ $report->total_companies }}</td>
                                <td class="px-6 py-4 text-sm">{{ $report->created_at->format('d/m/Y H:i') }}</td>
                                <td class="px-6 py-4 text-sm">
                                    <a href="{{ $report->download_url }}" 
                                       class="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                                        Descargar
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>

        <!-- Paginación (si existe) -->
        @if(isset($reports) && method_exists($reports, 'links'))
        <div class="mt-4">
            {{ $reports->links() }}
        </div>
        @endif
    </div>
</body>
</html>