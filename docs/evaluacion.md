# Proceso de Evaluación

## Descripción General
El proceso de evaluación es la segunda fase después de la auto-evaluación, donde se desglosan los indicadores en preguntas específicas que requieren evidencia documental y revisión por parte de un evaluador.

## Estructura del Proceso

### 1. Inicio de Evaluación

#### 1.1 Requisitos Previos
- Auto-evaluación completada
- Indicadores respondidos con "Sí"
- Formulario de empresa completo
- Empresa exportadora o autorizada

#### 1.2 Filtrado de Preguntas
- Solo se muestran preguntas de indicadores aprobados
- Basado en fecha de registro de empresa
- Incluye homologaciones automáticas

### 2. Respuesta de Preguntas

#### 2.1 Tipos de Preguntas
- Binarias (Sí/No)
- Descriptivas (texto obligatorio)
- Homologadas (automáticas)

#### 2.2 Requisitos por Pregunta
- Respuesta (Sí/No cuando aplica)
- Descripción detallada
- Archivos de evidencia (1-3 archivos)
- Justificación para homologaciones

#### 2.3 Evidencias
- Formatos permitidos: jpg, jpeg, png, pdf, doc, docx, xls, xlsx
- Tamaño máximo: 2MB por archivo
- Total máximo: 15MB por pregunta
- Compresión automática de imágenes

### 3. Homologaciones

#### 3.1 Proceso Automático
- Identificación de certificaciones válidas
- Mapeo de indicadores homologados
- Asignación automática de respuestas
- Uso de evidencias de certificación

#### 3.2 Características
- Respuesta automática "Sí"
- Descripción predefinida
- Evidencias heredadas
- No editable mientras certificación vigente

### 4. Calificación por Evaluador

#### 4.1 Proceso
- Revisión de respuestas
- Verificación de evidencias
- Calificación (Aprobado/No aprobado)
- Comentarios por pregunta

#### 4.2 Criterios
- Pertinencia de respuesta
- Calidad de evidencias
- Cumplimiento de requisitos
- Validez de homologaciones

### 5. Cálculo de Puntaje

#### 5.1 Fórmula
Puntaje = (Preguntas Aprobadas / Total Preguntas a Responder) * 100 

#### 5.2 Consideraciones
- Solo preguntas calificadas
- Homologaciones cuentan como aprobadas
- Indicadores vinculantes son críticos
- Mínimo requerido por valor

### 6. Estados de Evaluación

#### 6.1 Flujo
1. evaluacion (inicial)
2. evaluacion-pendiente (completada)
3. evaluacion-completada (enviada)
4. evaluado (calificado)
5. evaluacion-calificada (aprobada)
6. evaluacion-desaprobada (rechazada)

#### 6.2 Transiciones
- Automáticas por progreso
- Manuales por evaluador
- Notificadas a involucrados

## Roles y Responsabilidades

### 1. Empresa

#### 1.1 Acciones
- Responder preguntas
- Subir evidencias
- Enviar evaluación
- Ver calificaciones

#### 1.2 Restricciones
- Solo preguntas asignadas
- No puede auto-aprobar
- No editar post-envío

### 2. Evaluador

#### 2.1 Acciones
- Revisar respuestas
- Calificar preguntas
- Agregar comentarios
- Generar reportes

#### 2.2 Responsabilidades
- Verificar evidencias
- Validar homologaciones
- Justificar rechazos
- Asegurar objetividad

## Rutas del Sistema

### 1. Visualización
```php
GET /evaluacion/{value_id}
GET /api/evaluation/indicators
```
- Carga preguntas por valor
- Filtra por fecha de registro
- Procesa homologaciones

### 2. Respuestas
```php
POST /evaluacion/store-answers
POST /evaluacion/store-answers-by-indicator
```
- Almacena respuestas
- Procesa evidencias
- Valida requisitos

### 3. Calificación
```php
POST /evaluacion/calificar-nuevamente
POST /evaluacion/enviar-evaluacion-calificada
```
- Gestiona aprobaciones
- Genera documentación
- Envía notificaciones

### 4. Evaluador
```php
GET /evaluador/dashboard
GET /evaluador/evaluations
POST /api/evaluador/switch-company
```
- Gestiona empresas
- Muestra progreso
- Genera reportes

## Seguridad y Validaciones

### 1. Archivos
- Validación de tipos
- Control de tamaños
- Compresión automática
- Almacenamiento seguro

### 2. Acceso
- Verificación de roles
- Control de estados
- Registro de acciones
- Trazabilidad

### 3. Datos
- Sanitización de inputs
- Validación de formatos
- Control de versiones
- Respaldo automático

## Notificaciones

### 1. Eventos
- Evaluación completada
- Calificación realizada
- Aprobación/Rechazo
- Cambios de estado

### 2. Destinatarios
- Empresa (admin)
- Evaluador
- Superadmin
- Otros involucrados

## Reportes y Documentación

### 1. PDF Evaluación
- Resumen ejecutivo
- Detalle por valor
- Evidencias adjuntas
- Calificaciones

### 2. Estadísticas
- Progreso general
- Puntajes por valor
- Indicadores críticos
- Homologaciones 