<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Registro de Correos</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-8">Registro de Correos</h1>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-sm text-gray-500">Total</div>
                <div class="text-2xl font-bold">{{ $stats['total'] }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-sm text-gray-500">Enviados</div>
                <div class="text-2xl font-bold text-green-600">{{ $stats['sent'] }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-sm text-gray-500">Pendientes</div>
                <div class="text-2xl font-bold text-yellow-600">{{ $stats['pending'] }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-sm text-gray-500">Fallidos</div>
                <div class="text-2xl font-bold text-red-600">{{ $stats['failed'] }}</div>
            </div>
        </div>

        <!-- Formulario de prueba -->
        <div class="bg-white p-6 rounded-lg shadow mb-8">
            <h2 class="text-lg font-semibold mb-4">Enviar correo de prueba</h2>
            <form id="testMailForm" class="flex gap-4">
                <input 
                    type="email" 
                    id="test_email" 
                    placeholder="Correo electrónico de prueba"
                    class="flex-1 px-4 py-2 border rounded-md"
                    required
                >
                <button 
                    type="submit"
                    class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Enviar prueba
                </button>
            </form>
        </div>

        <!-- Filtros -->
        <div class="flex gap-2 mb-6">
            <a href="{{ route('mail-logs.index') }}" 
               class="px-4 py-2 rounded {{ !request('filter') ? 'bg-blue-600 text-white' : 'bg-gray-200' }}">
                Todos
            </a>
            <a href="{{ route('mail-logs.index', ['filter' => 'sent']) }}" 
               class="px-4 py-2 rounded {{ request('filter') === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-200' }}">
                Enviados
            </a>
            <a href="{{ route('mail-logs.index', ['filter' => 'pending']) }}" 
               class="px-4 py-2 rounded {{ request('filter') === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200' }}">
                Pendientes
            </a>
            <a href="{{ route('mail-logs.index', ['filter' => 'failed']) }}" 
               class="px-4 py-2 rounded {{ request('filter') === 'failed' ? 'bg-blue-600 text-white' : 'bg-gray-200' }}">
                Fallidos
            </a>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-lg shadow overflow-x-auto">
            @if($mailLogs->isEmpty())
                <div class="p-8 text-center text-gray-500">
                    No hay registros para mostrar
                </div>
            @else
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destinatario</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asunto</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Intentos</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                            {{-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th> --}}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        @foreach($mailLogs as $mail)
                            <tr>
                                <td class="px-6 py-4 text-sm">{{ $mail->created_at->format('d/m/Y H:i:s') }}</td>
                                <td class="px-6 py-4">{{ $mail->to_email }}</td>
                                <td class="px-6 py-4">{{ $mail->subject }}</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full
                                        {{ $mail->status === 'sent' ? 'bg-green-100 text-green-800' : '' }}
                                        {{ $mail->status === 'failed' ? 'bg-red-100 text-red-800' : '' }}
                                        {{ $mail->status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '' }}">
                                        {{ ucfirst($mail->status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">{{ $mail->attempts }}</td>
                                <td class="px-6 py-4">
                                    <div class="max-w-xs truncate text-sm text-gray-500" title="{{ $mail->error_message }}">
                                        {{ $mail->error_message ?: 'N/A' }}
                                    </div>
                                </td>
                                {{-- <td class="px-6 py-4">
                                    @if($mail->status === 'failed')
                                        <button 
                                            onclick="retryMail({{ $mail->id }})"
                                            class="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                                            Reintentar
                                        </button>
                                    @endif
                                </td> --}}
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>

        <!-- Paginación -->
        <div class="mt-4">
            {{ $mailLogs->links() }}
        </div>
    </div>

    <script>
        document.getElementById('testMailForm').addEventListener('submit', function(e) {
            e.preventDefault();
            sendTestMail();
        });

        function sendTestMail() {
            const email = document.getElementById('test_email').value;
            if (!email) {
                alert('Por favor, ingrese un correo electrónico');
                return;
            }

            fetch('/mail-logs/send-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ test_email: email })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al procesar la solicitud');
            });
        }

        function retryMail(id) {
            if (!confirm('¿Está seguro que desea reintentar el envío de este correo?')) {
                return;
            }

            fetch(`/mail-logs/${id}/retry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al procesar la solicitud');
            });
        }
    </script>
</body>
</html> 