<!-- resources/views/storage.blade.php -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Enlaces de Almacenamiento</title>
</head>
<body>
    <h1>Gestión de Enlaces de Almacenamiento</h1>
    @if(session('success'))
        <p style="color: green;">{{ session('success') }}</p>
    @endif
    @if(session('error'))
        <p style="color: red;">{{ session('error') }}</p>
    @endif
    <form action="{{ route('storage.link') }}" method="GET">
        <button type="submit">Crear Enlace de Almacenamiento</button>
    </form>
    <form action="{{ route('storage.unlink') }}" method="GET">
        <button type="submit">Eliminar Enlace de Almacenamiento</button>
    </form>
</body>
</html>