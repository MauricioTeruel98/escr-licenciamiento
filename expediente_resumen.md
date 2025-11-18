# Documentación Plataforma de Licenciamiento - Versión Resumida

Documento resumido y simplificado de la plataforma de Licenciamiento Esencial Costa Rica, orientado a personal no técnico y para presentaciones ejecutivas.

Link al [Repositorio de GitHub](https://github.com/buzzcostarica/licenciamiento)

## 1. Resumen General

### ¿Qué es este sistema?
La plataforma digitaliza el proceso completo para que empresas exportadoras obtengan la certificación Marca País. Permite gestionar desde el registro inicial hasta la emisión de certificaciones oficiales, pasando por autoevaluaciones y evaluaciones formales.

### ¿Quiénes lo usan?
- **Solicitantes**: Personas que quieren obtener la certificación para su empresa
- **Administradores de empresa**: Usuarios que gestionan la información corporativa
- **Evaluadores**: Personal autorizado que revisa y califica las solicitudes
- **Super administradores**: Personal de TI que gestiona usuarios, empresas y configuración del sistema

### Propósito de este documento
Este expediente describe cómo funciona el sistema, qué tecnologías utiliza, cómo se instala y opera, y qué controles de seguridad tiene implementados para cumplir con los estándares institucionales.

## 2. Tecnología Utilizada (Explicación Simple)

### ¿Con qué está construido?
- **Backend (Servidor)**: Utiliza PHP 8.2 con el framework Laravel 11, que maneja toda la lógica del negocio, autenticación de usuarios y generación de documentos.
- **Frontend (Interfaz)**: Utiliza React 18 para crear las pantallas interactivas que ven los usuarios, con diseño moderno y responsivo.
- **Base de datos**: MySQL almacena toda la información de usuarios, empresas, evaluaciones y certificaciones.
- **Archivos**: Los documentos, logos, fotos y PDFs se guardan en carpetas seguras del servidor.

### ¿Qué se necesita para ejecutarlo?
1. Servidor con PHP 8.2 o superior
2. Base de datos MySQL configurada
3. Node.js para compilar la interfaz de usuario
4. Espacio de almacenamiento para archivos y documentos

## 3. Arquitectura del Sistema (Simplificada)

### Flujo básico de funcionamiento
1. **Usuario accede** a través de un navegador web
2. **Sistema valida** quién es el usuario y qué permisos tiene
3. **Procesa la solicitud** según las reglas de negocio
4. **Guarda la información** en la base de datos o archivos
5. **Responde al usuario** mostrando resultados o confirmaciones

### Componentes principales
- **Pantallas web**: Interfaz que ven los usuarios (formularios, dashboards, reportes)
- **Servidor de aplicaciones**: Procesa todas las solicitudes y aplica las reglas
- **Base de datos**: Almacena toda la información de forma organizada
- **Sistema de archivos**: Guarda documentos, imágenes y reportes generados
- **Colas de trabajo**: Procesan tareas pesadas (como generar reportes) sin bloquear al usuario

## 4. Módulos Principales del Sistema

### 4.1 Registro y Asociación de Empresas
**¿Qué hace?**
Permite que nuevos usuarios se registren en el sistema y se asocien a una empresa. Si la empresa ya existe, el usuario solicita acceso. Si no existe, puede crear una nueva empresa.

**Funcionalidades clave:**
- Registro de usuarios con validación de datos
- Verificación de cédula jurídica de la empresa
- Solicitud de acceso a empresas existentes
- Creación de nuevas empresas con asignación automática de administrador

### 4.2 Formulario Empresarial
**¿Qué hace?**
Captura toda la información corporativa necesaria: datos generales, contactos, imágenes, certificaciones y datos de exportación.

**Funcionalidades clave:**
- Información general de la empresa (nombre, descripción, sitio web, etc.)
- Gestión de contactos (obligatorios y opcionales)
- Carga de logos y fotografías
- Registro de certificaciones existentes
- Información sobre exportaciones y productos

### 4.3 Dashboard y Autoevaluación
**¿Qué hace?**
Muestra el progreso de cumplimiento de la empresa y permite completar cuestionarios de autoevaluación basados en indicadores.

**Funcionalidades clave:**
- Vista general del progreso
- Cuestionarios organizados por valores
- Guardado automático de respuestas
- Identificación de indicadores descalificatorios
- Homologación automática por certificaciones vigentes
- Cálculo de puntaje final

### 4.4 Evaluación Formal
**¿Qué hace?**
Permite que los evaluadores revisen las respuestas de la empresa, verifiquen evidencias y califiquen cada indicador.

**Funcionalidades clave:**
- Visualización de preguntas derivadas de indicadores aprobados
- Revisión de evidencias subidas por la empresa
- Calificación por parte de evaluadores
- Estados del proceso (pendiente, en revisión, aprobado, rechazado)
- Generación de reportes de evaluación

### 4.5 Gestión de Certificaciones
**¿Qué hace?**
Permite registrar certificaciones que pueden homologar indicadores automáticamente, reduciendo el trabajo de evaluación.

**Funcionalidades clave:**
- Registro de certificaciones con fechas de vigencia
- Carga de documentos comprobatorios
- Homologación automática de indicadores relacionados
- Alertas de certificaciones próximas a vencer
- Edición y eliminación de certificaciones

### 4.6 Paneles Administrativos
**¿Qué hace?**
Proporciona herramientas especializadas para evaluadores y super administradores.

**Funcionalidades clave:**
- Asignación de empresas a evaluadores
- Gestión de usuarios y roles
- Administración de valores, indicadores y requisitos
- Visualización de reportes y estadísticas
- Control de fechas y configuraciones del sistema

### 4.7 Reportes y Documentos
**¿Qué hace?**
Genera documentos oficiales en formato PDF, Word y Excel para uso institucional.

**Funcionalidades clave:**
- Reportes de autoevaluación
- Reportes de evaluación formal
- Reportes mensuales automáticos
- Expedientes completos descargables
- Estadísticas y métricas de cumplimiento

## 5. Requisitos Funcionales Clave

### Validaciones y Seguridad
- Validación estricta de todos los datos ingresados
- Verificación de formatos de archivos y tamaños máximos
- Control de duplicidad de registros
- Protección contra envíos duplicados

### Flujos Condicionales
- El sistema guía al usuario según el estado de su empresa
- No se puede avanzar sin completar pasos previos
- Bloqueo automático después de enviar evaluaciones
- Requisitos previos verificados antes de permitir acciones

### Homologaciones Automáticas
- Identificación automática de certificaciones vigentes
- Asignación automática de respuestas "Sí" para indicadores homologables
- Reversión automática cuando vencen las certificaciones
- Indicadores bloqueados mientras la certificación esté vigente

### Roles y Permisos
- **Super administrador**: Acceso completo al sistema
- **Administrador de empresa**: Gestiona información corporativa
- **Usuario regular**: Completa autoevaluaciones y consulta progreso
- **Evaluador**: Revisa y califica evaluaciones de empresas asignadas

### Notificaciones Automáticas
- Confirmación de registro
- Notificaciones de solicitudes de acceso
- Alertas de finalización de autoevaluación
- Notificaciones de evaluaciones completadas
- Avisos de calificaciones y aprobaciones/rechazos

## 6. Seguridad y Controles

### Autenticación y Sesiones
- Sistema de login seguro con verificación de email
- Sesiones protegidas que expiran automáticamente
- Recuperación de contraseñas mediante correo electrónico
- Protección contra accesos no autorizados

### Control de Acceso
- Verificación de roles antes de permitir acciones
- Validación del estado de la empresa (autorizada, pendiente, etc.)
- Verificación de pasos previos completados
- Restricciones específicas por tipo de usuario

### Validación de Datos
- Sanitización de todos los datos ingresados
- Validación de formatos (emails, teléfonos, fechas)
- Verificación de tamaños y tipos de archivos
- Prevención de datos inconsistentes o maliciosos

### Protección de Flujos Críticos
- No se puede editar información después de enviar evaluaciones
- Requisitos previos verificados antes de permitir evaluaciones
- Bloqueo de duplicados y reprocesos no autorizados
- Transacciones seguras que revierten cambios en caso de error

### Gestión de Archivos
- Almacenamiento seguro de documentos
- Validación de formatos y tamaños
- Compresión automática de imágenes
- Respaldo de archivos importantes

### Auditoría y Trazabilidad
- Registro de todas las acciones importantes
- Logs de cambios de estado
- Notificaciones que documentan aprobaciones y rechazos
- Historial completo para auditorías

## 7. Instalación y Configuración

### Requisitos Previos
- PHP 8.2 o superior instalado
- MySQL configurado y funcionando
- Node.js instalado (para compilar la interfaz)
- Composer instalado (gestor de dependencias PHP)

### Pasos de Instalación

1. **Clonar el repositorio**
   - Descargar el código desde GitHub

2. **Instalar dependencias**
   ```
   npm install
   composer install
   ```

3. **Configurar el entorno**
   - Crear archivo `.env` con las configuraciones necesarias
   - Definir credenciales de base de datos
   - Configurar correo electrónico y servicios externos
   - Generar clave de aplicación

4. **Configurar base de datos**
   - Crear la base de datos en MySQL
   - Importar el archivo inicial `db_limpia.sql`
   - Ejecutar migraciones adicionales

5. **Configurar almacenamiento**
   - Crear enlace simbólico para archivos públicos
   - Copiar archivos JSON de ubicaciones geográficas
   - Preparar carpeta para documentos PDF

6. **Ejecutar en desarrollo**
   ```
   php artisan serve
   npm run dev
   ```

### Despliegue en Producción

1. **Compilar recursos**
   ```
   npm run build
   ```

2. **Subir archivos al servidor**
   - Comprimir archivos en .zip
   - Cargar en el directorio público del servidor
   - **Importante**: No sobrescribir el archivo `.env` del servidor

3. **Descomprimir y configurar**
   - Descomprimir archivos en el servidor
   - Ejecutar comandos de optimización

4. **Optimizar**
   ```
   php artisan optimize:clear
   php artisan optimize
   ```

## 8. Operación Diaria

### Tareas Comunes

1. **Gestión de Usuarios**
   - Iniciar sesión con super administrador
   - Asignar roles y permisos desde el panel `/super/users`
   - Gestionar estados de empresas

2. **Registro de Empresas**
   - Seguir el flujo documentado para nuevas empresas
   - Verificar cédulas jurídicas
   - Aprobar o rechazar solicitudes de acceso

3. **Supervisión de Evaluaciones**
   - Revisar dashboards de progreso
   - Habilitar formularios solo cuando corresponda
   - Asignar empresas a evaluadores

4. **Generación de Reportes**
   - Generar reportes desde `/super/reportes`
   - Respaldar documentos generados
   - Archivar según políticas institucionales

### Mantenimiento

- Revisar logs regularmente (`storage/logs`)
- Limpiar archivos temporales
- Verificar espacio de almacenamiento
- Monitorear rendimiento del sistema

## 9. Procesos Clave Explicados

### 9.1 Proceso de Registro

**Paso 1: Registro de Usuario**
- El usuario completa formulario con datos personales
- Sistema valida formato de email, contraseña segura, etc.
- Se crea la cuenta y se envía notificación de bienvenida

**Paso 2: Verificación de Empresa**
- Usuario ingresa cédula jurídica (solo números, máximo 12 dígitos)
- Sistema busca si la empresa existe

**Paso 3A: Empresa Existe**
- Usuario solicita acceso a la empresa
- Sistema notifica al administrador actual
- Administrador aprueba o rechaza la solicitud

**Paso 3B: Empresa No Existe**
- Usuario completa formulario de registro de empresa
- Sistema valida todos los datos
- Se crea la empresa y el usuario queda como administrador
- Se establece fecha de inicio de autoevaluación

### 9.2 Proceso de Autoevaluación

**Inicio**
- Sistema registra la fecha de inicio
- Congela el conjunto de indicadores vigentes en ese momento
- Identifica certificaciones vigentes para homologación

**Evaluación**
- Usuario responde indicadores organizados por valores
- Sistema muestra indicadores descalificatorios claramente
- Guardado automático de respuestas
- Indicadores homologados aparecen como "Sí" y no editables

**Finalización**
- Sistema verifica que todo esté completo
- Calcula puntaje final
- Genera reporte PDF
- Envía notificaciones
- Bloquea edición posterior

### 9.3 Proceso de Evaluación Formal

**Requisitos Previos**
- Autoevaluación completada
- Formulario empresarial completo
- Empresa autorizada o exportadora

**Evaluación por Empresa**
- Empresa responde preguntas derivadas de indicadores aprobados
- Sube evidencias (1-3 archivos por pregunta)
- Sistema valida formatos y tamaños
- Empresa envía evaluación para revisión

**Calificación por Evaluador**
- Evaluador revisa respuestas y evidencias
- Verifica homologaciones
- Califica cada pregunta (Aprobado/No aprobado)
- Agrega comentarios y justificaciones
- Calcula puntaje final

**Estados del Proceso**
- **Evaluación**: Inicial, empresa completando
- **Evaluación pendiente**: Completada, esperando revisión
- **Evaluación completada**: Enviada al evaluador
- **Evaluado**: En proceso de calificación
- **Evaluación calificada**: Aprobada
- **Evaluación desaprobada**: Rechazada

### 9.4 Gestión de Certificaciones

**Registro**
- Usuario selecciona tipo de certificación homologable
- Ingresa fechas de obtención y expiración
- Registra organismo certificador
- Sube documentos comprobatorios (máximo 3 archivos)

**Homologación Automática**
- Sistema identifica indicadores relacionados
- Asigna automáticamente respuestas "Sí"
- Bloquea edición mientras la certificación esté vigente
- Revierte automáticamente al vencer

**Gestión**
- Visualización de todas las certificaciones
- Edición de fechas y documentos
- Eliminación con confirmación
- Alertas de certificaciones próximas a vencer

## 10. Referencias y Documentación Adicional

| Documento | Descripción | Ubicación |
|-----------|-------------|-----------|
| `README.md` | Guía principal de instalación y uso | Raíz del repositorio |
| `docs/registro.md` | Detalle del flujo de registro | Carpeta `docs/` |
| `expediente.md` | Documentación técnica completa | Raíz del repositorio |
| `db_limpia.sql` | Base de datos inicial | Raíz del repositorio |
| `lugares.json` / `paises.json` | Datos geográficos | Raíz (copiar a storage) |
| `storage/app/public/pdfs` | Plantillas y documentos oficiales | Directorio de almacenamiento |

## 11. Contacto y Soporte

Para consultas técnicas o problemas con el sistema, referirse al repositorio de GitHub o contactar al equipo de desarrollo.

---

**Nota**: Este documento es una versión resumida y simplificada. Para detalles técnicos completos, consultar el archivo `expediente.md`.

