# Proceso de Gestión de Certificaciones

## Descripción General
El sistema permite a las empresas gestionar sus certificaciones para homologación con la marca país. Incluye funcionalidades para crear, editar, eliminar y gestionar certificaciones y sus archivos adjuntos.

## Rutas del Sistema

### 1. Visualización
- **Ruta**: `GET /certifications/create`
- **Nombre**: `certifications.create`
- **Middleware**: `auth`, `verified`, `EnsureUserHasCompany`
- **Función**: Muestra el formulario de creación y lista de certificaciones existentes

### 2. Creación
- **Ruta**: `POST /certifications`
- **Nombre**: `certifications.store`
- **Middleware**: `auth`, `verified`, `EnsureUserHasCompany`
- **Función**: Almacena nueva certificación

### 3. Actualización
- **Ruta**: `PUT /certifications/{certification}`
- **Nombre**: `certifications.update`
- **Middleware**: `auth`, `verified`, `EnsureUserHasCompany`
- **Función**: Actualiza certificación existente

### 4. Eliminación
- **Ruta**: `DELETE /certifications/{certification}`
- **Nombre**: `certifications.destroy`
- **Middleware**: `auth`, `verified`, `EnsureUserHasCompany`
- **Función**: Elimina certificación

## Proceso de Creación

### 1. Selección de Certificación
- Búsqueda en lista de certificaciones homologables
- Validación de certificación no duplicada
- Selección de certificación específica

### 2. Información Básica
- Fecha de obtención
  - No puede ser posterior a la fecha actual
- Fecha de expiración
  - Debe ser posterior a la fecha de obtención
- Organismo certificador
  - Campo obligatorio
  - Solo letras y números permitidos

### 3. Gestión de Archivos
- **Restricciones**:
  - Máximo 3 archivos por certificación
  - 5MB máximo por archivo
  - 15MB máximo total
  - Formatos permitidos: jpg, jpeg, png, pdf, doc, docx, xls, xlsx

- **Funcionalidades**:
  - Carga por arrastrar y soltar
  - Selección manual de archivos
  - Vista previa de archivos
  - Eliminación individual de archivos

### 4. Validaciones
- **Campos Obligatorios**:
  - Nombre de certificación
  - Fechas de obtención y expiración
  - Organismo certificador
  - Al menos un archivo de evidencia

- **Validaciones Específicas**:
  - Fechas coherentes
  - Formatos de archivo correctos
  - Tamaños de archivo dentro de límites
  - No duplicidad de certificaciones

### 5. Procesamiento
1. Validación de datos del formulario
2. Procesamiento y compresión de imágenes
3. Almacenamiento de archivos
4. Creación de registro en base de datos
5. Cálculo de indicadores homologados
6. Respuesta con confirmación o errores

## Gestión de Certificaciones Existentes

### 1. Visualización
- Lista ordenada de certificaciones
- Información detallada por certificación
- Estado de expiración
- Archivos adjuntos

### 2. Edición
- Modificación de fechas
- Actualización de organismo certificador
- Gestión de archivos
  - Agregar nuevos (respetando límites)
  - Eliminar existentes
  - Visualizar actuales

### 3. Eliminación
- Confirmación mediante modal
- Eliminación de registro y archivos asociados

## Manejo de Errores
- Validación en tiempo real
- Mensajes de error específicos
- Rollback en caso de fallo
- Limpieza de archivos en errores
- Registro de errores en logs

## Seguridad
- Autenticación requerida
- Verificación de email
- Validación de pertenencia a empresa
- Sanitización de inputs
- Protección contra desbordamiento de archivos 