# Proceso de Auto-evaluación

## Descripción General
El sistema implementa un proceso de auto-evaluación para empresas basado en indicadores, con homologación automática por certificaciones y validación de criterios descalificatorios.

## Estructura del Proceso

### 1. Inicio de Auto-evaluación

#### 1.1 Registro de Fecha
- Se registra la fecha de inicio de auto-evaluación
- Los indicadores mostrados son los existentes a esta fecha
- Indicadores nuevos no afectan evaluaciones en curso

#### 1.2 Certificaciones
- Verificación de certificaciones vigentes
- Homologación automática de indicadores
- Asignación automática de respuesta "Sí" para indicadores homologados

### 2. Evaluación de Indicadores

#### 2.1 Visualización
- Indicadores agrupados por valores
- Información de homologación visible
- Marcadores de indicadores descalificatorios

#### 2.2 Respuestas
- Opciones: Sí/No
- Justificación obligatoria para respuestas "Sí"
- Bloqueo de edición para indicadores homologados
- Guardado automático cada 30 segundos

#### 2.3 Indicadores Descalificatorios
- Claramente identificados
- Respuesta "No" descalifica automáticamente
- Permite continuar respondiendo otros indicadores
- Afecta resultado final

### 3. Cálculo de Puntaje

#### 3.1 Fórmula
```
Puntaje = (Respuestas "Sí" + Indicadores Homologados) / Total Indicadores * 100
```

#### 3.2 Criterios
- Mínimo requerido: Nota minima de cada valor
- Indicadores descalificatorios deben ser "Sí"
- Homologaciones cuentan como "Sí"

### 4. Formulario de Información Adicional

#### 4.1 Campos Requeridos
- Información general
  - Nombre de la empresa
  - RUC/Cédula jurídica
  - Año de fundación
  - Sector económico
  - Tamaño de empresa

- Contacto
  - Dirección completa
  - Teléfono
  - Email corporativo
  - Sitio web

- Operaciones
  - Países de exportación
  - Productos principales
  - Certificaciones vigentes

#### 4.2 Documentación
- Logo empresarial
- Fotografías de instalaciones
- Certificaciones escaneadas
- Catálogo de productos

### 5. Finalización

#### 5.1 Requisitos
- Todos los indicadores respondidos
- Formulario adicional completo
- Sin indicadores descalificatorios en "No"
- Puntaje mínimo alcanzado

#### 5.2 Proceso
1. Verificación de completitud
2. Cálculo de puntaje final
3. Generación de reporte PDF
4. Envío de notificaciones
5. Bloqueo de edición

## Homologaciones

### 1. Proceso
1. Empresa sube certificaciones
2. Sistema verifica vigencia
3. Identificación de indicadores homologables
4. Asignación automática de respuestas

### 2. Características
- Respuesta automática "Sí"
- Justificación automática
- No editable mientras certificación vigente
- Se revierte si certificación vence

## Rutas del Sistema

### 1. Visualización
```php
GET /indicadores/{id}
```
- Muestra indicadores por valor
- Carga certificaciones vigentes
- Procesa homologaciones

### 2. Respuestas
```php
POST /indicadores/store-answers
POST /indicadores/save-partial-answers
```
- Almacena respuestas finales/parciales
- Valida indicadores vinculantes
- Calcula puntajes

### 3. Finalización
```php
POST /indicadores/finalizar-autoevaluacion
```
- Verifica completitud
- Genera documentación
- Envía notificaciones

### 4. Formulario
```php
POST /company/profile
POST /company/profile/upload-{tipo}
```
- Gestiona información adicional
- Procesa archivos
- Valida campos requeridos

## Seguridad y Validaciones

### 1. Acceso
- Autenticación requerida
- Verificación de pertenencia a empresa
- Control de edición post-finalización

### 2. Datos
- Validación de formatos
- Verificación de fechas
- Control de tamaños de archivo

### 3. Proceso
- Verificación de completitud
- Validación de respuestas vinculantes
- Control de homologaciones

## Notificaciones

### 1. Automáticas
- Guardado automático
- Certificación por vencer
- Finalización de proceso

### 2. Manuales
- Aprobación/Rechazo
- Solicitud de correcciones
- Confirmación de recepción

