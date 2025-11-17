# Documentación del Proceso de Registro

## 1. Registro de Usuario

### 1.1 Formulario de Registro
El usuario ingresa sus datos personales:
- Nombre (solo letras y espacios)
- Apellido (solo letras y espacios)
- Email (formato válido)
- Contraseña (mínimo 8 caracteres)
- Aceptación de términos y condiciones

### 1.2 Validaciones del Servidor
- Verificación de formato de datos
- Comprobación de email único
- Validación de contraseña segura
- Confirmación de términos aceptados

### 1.3 Proceso Post-Registro
- Creación del usuario en la base de datos
- Envío de notificación de bienvenida
- Autenticación automática
- Redirección a verificación de cédula jurídica

## 2. Verificación de Cédula Jurídica

### 2.1 Ingreso de Cédula
- El usuario ingresa la cédula jurídica de la empresa
- Validación de formato (solo números, máximo 12 dígitos)

### 2.2 Verificación en Base de Datos
- Búsqueda de la cédula en el sistema
- Dos posibles resultados:
  - Empresa existe
  - Empresa no existe

## 3. Flujo según Resultado

### 3.1 Si la Empresa Existe
- Redirección a página de empresa existente
- Opciones para el usuario:
  - Solicitar acceso
  - Regresar
- Proceso de solicitud de acceso:
  - Notificación al administrador
  - Usuario marcado como pendiente
  - Espera de aprobación

### 3.2 Si la Empresa No Existe
- Redirección a formulario de registro de empresa
- Campos requeridos:
  - Nombre de la empresa
  - Sitio web
  - Sector
  - Provincia
  - Actividad comercial
  - Teléfonos
  - Confirmación de ser exportadora

## 4. Registro de Empresa

### 4.1 Validaciones
- Todos los campos son obligatorios
- Formato específico para cada tipo de dato
- Verificación de URL válida
- Validación de números telefónicos
- Confirmación de ser empresa exportadora

### 4.2 Proceso de Creación
- Creación de la empresa en la base de datos
- Asignación del usuario como administrador
- Establecimiento de fecha de inicio de autoevaluación
- Redirección al dashboard

## 5. Notificaciones

### 5.1 Tipos de Notificaciones
- Bienvenida al usuario
- Solicitud de acceso pendiente
- Notificación al administrador de nueva solicitud
- Aprobación/Rechazo de solicitud

### 5.2 Manejo de Errores
- Registro de errores en logs
- Mensajes de error amigables
- Rollback de transacciones en caso de error
- Redirección con mensajes de error

## 6. Seguridad

### 6.1 Validaciones de Seguridad
- Sanitización de inputs
- Prevención de caracteres especiales
- Validación de roles y permisos
- Protección contra acceso no autorizado

### 6.2 Manejo de Sesiones
- Almacenamiento temporal de datos
- Limpieza de sesiones
- Control de acceso a rutas
- Middleware de autenticación