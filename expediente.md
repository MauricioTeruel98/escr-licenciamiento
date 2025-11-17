# Expediente Integral Único de la Plataforma de Licenciamiento ESCR

> Documento maestro con toda la información técnica, funcional, operativa y de seguridad necesaria para el expediente institucional requerido por el departamento de TI. Integra el contenido completo anteriormente distribuido en múltiples dossiers y elimina la necesidad de consultar referencias externas.

## 1. Resumen Ejecutivo y Propósito
- **Objetivo del sistema:** Digitalizar el proceso de licenciamiento Marca País para empresas exportadoras, abarcando registro, asociación de empresas, autoevaluación, evaluación formal, gestión de certificaciones y emisión de reportes oficiales.
- **Actores principales:** Usuarios solicitantes, administradores de empresa, evaluadores, super administradores y personal de TI.
- **Propósito del expediente:** Describir tecnologías, arquitectura, módulos funcionales, procesos detallados, manuales de instalación/operación/mantenimiento y controles de seguridad exigidos por los estándares institucionales.

## 2. Tecnologías, Entorno y Dependencias
| Capa | Tecnologías y paquetes | Uso principal |
| --- | --- | --- |
| Backend | PHP 8.2, Laravel 11, Sanctum, Breeze, Filament, Inertia Laravel, Barryvdh DOMPDF, PHPWord, Maatwebsite Excel, FPDF/FPDI | API REST + SSR, autenticación, panel administrativo, generación de PDFs/Word/Excel, exportación documental |
| Frontend | React 18, Inertia.js, Vite 5, Tailwind CSS 3, DaisyUI, HeadlessUI, Axios, @dnd-kit, Heroicons, Lucide, React Datepicker | SPA híbrida con componentes responsivos, formularios complejos, drag & drop y comunicación protegida con Laravel |
| Datos | MySQL, catálogos JSON (lugares/paises), repositorio documental en `storage/app/public/pdfs` | Persistencia transaccional, catálogos geográficos y almacenamiento seguro de expedientes |
| DevOps | Composer, npm, Vite, Artisan (`serve`, `migrate`, `queue`, `optimize`), `concurrently` | Instalación, build, ejecución paralela de servidores, colas y logging |
| QA y Formato | PHPUnit 11, Laravel Pint, Faker, Collision, Laravel Pail | Pruebas unitarias, formateo PSR-12, datos ficticios y monitoreo interactivo |

### Requerimientos de infraestructura
1. Servidor con PHP 8.2+, extensiones habilitadas para Laravel 11 y Composer actualizado.
2. Entorno Node.js 18+ para ejecutar y construir el frontend con Vite.
3. Motor MySQL configurado con la base histórica (`db_limpia.sql`) y las migraciones vigentes.
4. Variables en `.env` (APP_KEY, credenciales de DB, drivers de mail y colas, claves de almacenamiento y servicios externos).
5. Enlace de almacenamiento `php artisan storage:link`, espacio para catálogos JSON y repositorio de PDFs institucionales.
6. Configuración de colas y cron para jobs (generación de reportes, notificaciones y homologaciones programadas).

## 3. Arquitectura Técnica y Diagrama
```mermaid
flowchart LR
    subgraph Cliente
        U[Usuarios finales]
    end

    subgraph Frontend Inertia + React
        UI[Componentes React Tailwind + DaisyUI]
        AX[Axios + Ziggy]
    end

    subgraph Servidor Laravel
        MW[Middleware de Seguridad]
        CTR[Controladores HTTP]
        SRV[Servicios/Repositorios]
        JOB[Jobs/Queues]
    end

    subgraph Persistencia
        DB[MySQL]
        FS[Storage público/privado]
    end

    U --> UI --> AX --> CTR
    CTR --> MW
    MW --> CTR --> SRV --> DB
    SRV --> FS
    CTR --> JOB --> DB
```

### Descripción técnica
1. **Front-end Inertia** renderiza vistas dinámicas (dashboard, formularios, paneles) manteniendo los beneficios de Laravel SSR; Ziggy proporciona rutas firmadas y Axios gestiona solicitudes protegidas por Sanctum/CSRF.
2. **Back-end Laravel** organiza el dominio mediante controladores (`CompanyAuthController`, `DashboardController`, `IndicadoresController`, `EvaluationController`, `CertificationController`, `SuperAdminController`, etc.), servicios y colas para tareas pesadas como generación de reportes.
3. **Seguridad por middleware**: `auth`, `verified`, `EnsureUserHasCompany`, `EnsureCompanyIsAuthorized`, `EnsureApplicationSended`, `EnsureUserIsSuperAdmin`, `EnsureUserIsEvaluador` y variantes específicas controlan rol, estado de empresa y pasos previos.
4. **Persistencia y archivos**: MySQL almacena usuarios, empresas, indicadores, certificaciones y evidencias; `storage/app/public` resguarda logos, fotografías, PDFs, Word y Excel generados.

## 4. Módulos Funcionales y Rutas Principales
| Módulo | Rutas principales | Resumen operativo |
| --- | --- | --- |
| Registro y asociación de empresa | `POST /register`, `POST /company-register`, verificación de cédula jurídica | Captura datos personales, valida formatos, verifica unicidad de email/cédula y asigna administrador inicial. Gestiona solicitudes de acceso a empresas existentes y flujos de aprobación/rechazo |
| Formulario empresarial | `GET/POST /company/profile` y endpoints de carga `upload-logo/fotos/certificaciones` | Administra información corporativa, contactos obligatorios/opcionales, multimedia y datos de exportación con guardado parcial |
| Autoevaluación | `GET /indicadores/{id}`, `POST /indicadores/store-answers`, `POST /indicadores/finalizar-autoevaluacion` | Presenta indicadores por valores, soporta homologaciones, guardado automático y bloqueo tras finalización |
| Evaluación formal | `GET /evaluacion/{value_id}`, `POST /evaluacion/store-answers`, `POST /evaluacion/enviar-evaluacion-calificada` | Desglosa preguntas derivadas de indicadores aprobados, maneja evidencias y calificaciones de evaluadores |
| Gestión de certificaciones | `GET /certifications/create`, `POST /certifications`, `PUT/DELETE /certifications/{id}` | Permite crear, editar y eliminar certificaciones homologables con restricciones de archivos y vigencias |
| Paneles administrativos | `/dashboard`, `/evaluador/*`, `/super/*`, APIs asociadas | Ofrecen visión de progreso, asignación de empresas, administración de catálogos, usuarios y reportes |
| Reportes | Controladores `ReportController`, `PDFController`, `MonthlyReportController` | Generan expedientes PDF, Word y Excel para Dirección de TI y seguimiento operativo |

## 5. Requerimientos Funcionales Clave
1. Validaciones estrictas en registro (nombres, apellidos, emails, contraseñas, aceptación de términos) y asociación de empresas mediante cédula jurídica (solo números, máximo 12 dígitos).
2. Flujo condicional según la existencia de empresa: solicitud de acceso con notificaciones al administrador o creación completa de empresa con asignación automática de administrador y fecha de autoevaluación.
3. Guardado parcial y finalización del formulario empresarial, bloqueo tras enviar autoevaluación y controles para reabrir solo bajo autorización.
4. Autoevaluación con homologaciones automáticas derivadas de certificaciones vigentes, indicadores descalificatorios señalados y cálculo de puntaje consolidado.
5. Evaluación formal con verificación de requisitos previos, flujos de evidencias (1-3 archivos, ≤2 MB c/u, 15 MB por pregunta) y calificación con estados transicionales auditables.
6. Gestión documental segura: subida de logos, fotos y certificaciones bajo límites de formato (JPG/PNG/PDF/DOC/DOCX/XLS/XLSX) y tamaño.
7. Notificaciones automáticas para registros, solicitudes, finalizaciones de autoevaluación, evaluaciones completadas y calificaciones emitidas.

## 6. Requerimientos No Funcionales
- **Disponibilidad:** Separación front/back permite escalar servicios Laravel y React, apoyados por colas para operaciones costosas.
- **Rendimiento:** Uso de Vite y lazy loading optimiza tiempos de carga; colas Artisan y jobs reducen bloqueos.
- **Usabilidad:** Tailwind + DaisyUI garantizan formularios responsivos y accesibles, con feedback inmediato.
- **Seguridad:** Hashing seguro de contraseñas, protección CSRF, middleware específicos y validaciones server-side/sanitización.
- **Interoperabilidad:** Exportación a PDF/Excel/Word y catálogos JSON permiten compartir resultados con TI y entes externos.
- **Mantenibilidad:** PSR-4, formateo con Laravel Pint, pruebas PHPUnit y scripts `php artisan optimize`/`optimize:clear` estandarizan despliegues.

## 7. Seguridad y Controles
1. **Autenticación y sesiones:** Laravel Breeze/Sanctum gestionan sesiones y tokens con expiración, protección CSRF y revocación.
2. **Control de acceso:** Middlewares por rol/estado garantizan que solo usuarios autorizados acceden a módulos. Super administradores gestionan usuarios y catálogos; evaluadores solo interactúan con empresas asignadas.
3. **Validación de datos:** Sanitización exhaustiva en registro, formularios y evaluaciones. Restricciones de formato, longitud, fechas y archivos previenen inconsistencias.
4. **Protección de flujos críticos:** Formulario empresarial se habilita tras autoevaluación enviada; evaluadores no pueden calificar empresas sin autorización; certificaciones duplicadas se bloquean.
5. **Gestión documental:** Archivos se almacenan en storage con permisos restringidos; se recomienda firmar URLs cuando se entregan reportes externos.
6. **Auditoría y trazabilidad:** Logging centralizado (Laravel + Pail), registros de cambios de estado, historial de evaluaciones y notificaciones proveen evidencia para TI.

## 8. Manuales Operativos
### 8.1 Instalación y configuración
1. Clonar el repositorio y ejecutar `composer install` y `npm install`.
2. Configurar `.env`, generar `APP_KEY`, definir credenciales de base de datos, correos y servicios externos.
3. Importar la base histórica, ejecutar migraciones/seeders y poblar catálogos JSON.
4. Crear el enlace de almacenamiento (`php artisan storage:link`).
5. Levantar servidores de desarrollo (`php artisan serve`, `npm run dev`) o construir para producción (`npm run build`, `php artisan optimize`).

### 8.2 Operación diaria
- Iniciar sesión con el super administrador inicial (`admin@admin.com` / `password`) y actualizar las credenciales inmediatamente en ambientes reales.
- Gestionar roles y permisos desde el panel de super administración (usuarios, empresas, indicadores, valores, certificaciones, importaciones de catálogos).
- Supervisar el dashboard para revisar estados de registro, autoevaluación y evaluación; habilitar o bloquear accesos según políticas.
- Evaluadores acceden a `/evaluador/dashboard` para revisar empresas asignadas, responder reevaluaciones y generar reportes.
- Exportar reportes PDF/Word/Excel oficiales desde los paneles administrativos, archivándolos según las políticas de TI.

### 8.3 Despliegue y mantenimiento
- Construir assets con `npm run build`, limpiar cachés (`php artisan optimize:clear`) y regenerarlos (`php artisan optimize`).
- Programar respaldos de MySQL y del almacenamiento `storage/app`.
- Monitorear colas y jobs (`php artisan queue:listen`/`queue:work`).
- Ejecutar PHPUnit y Laravel Pint cuando se modifique el core.

## 9. Detalle de Procesos Clave
### 9.1 Registro de usuario y empresa (contenido completo)
#### Formulario de registro
- Campos: nombre y apellido (solo letras/espacios), email válido, contraseña ≥8 caracteres y aceptación de términos.
- Validaciones: formato correcto, email único, robustez de contraseña y confirmación de términos.

#### Post-registro
- Creación de usuario en base, envío de notificación de bienvenida, autenticación automática y redirección a la verificación de cédula jurídica.

#### Verificación de cédula jurídica
- Entrada numérica (solo dígitos, máximo 12) validada en servidor.
- Resultados:
  - **Empresa existe:** se muestra información básica y se habilita solicitud de acceso o regreso.
  - **Empresa no existe:** se redirige al formulario de registro de empresa.

#### Flujo cuando la empresa existe
- El usuario puede solicitar acceso. El sistema notifica al administrador actual, marca al solicitante como pendiente y espera aprobación/rechazo.
- Estados se actualizan automáticamente y se registran para auditoría.

#### Flujo cuando la empresa no existe
- Formulario con campos obligatorios (nombre comercial, sitio web, sector, provincia, actividad, teléfonos, confirmación de exportadora, etc.).
- Validaciones por tipo de dato (URL, teléfonos numéricos, selección de sector/provincia).
- Resultado: creación de empresa, asignación de rol administrador al solicitante, establecimiento de fecha de inicio de autoevaluación y redirección al dashboard.

#### Notificaciones y seguridad del registro
- Correos de bienvenida, solicitudes de acceso, avisos al administrador y confirmaciones de aprobación/rechazo.
- Manejo de errores con logs, mensajes amigables y rollback de transacciones.
- Sanitización de inputs, validación de roles, limpieza de sesiones y middleware de autenticación protegen el flujo.

### 9.2 Formulario empresarial (contenido completo)
#### Funciones principales
- **Manejo de estado y datos:** `handleChange`, `handleURLChange`, `handleAnioFundacionChange`, `handlePaisesChange`.
- **Validaciones:** `validarCampo`, `isValidEmail`, `obtenerLimitesEmpleados` para rangos de personal.
- **Imágenes:** `handleImagenChange`, `uploadLogo`, `uploadFotografias`, `uploadCertificaciones`, `removeImagen`, `removeExistingImage`.
- **Productos:** `agregarProducto`, `handleDeleteProducto`, `eliminarProductoNuevo`, `confirmarEliminarProducto`.
- **UI/Navegación:** `toggleSeccion`, `pasarSiguienteSeccion`, `openFinalizarModal`, `confirmFinalizarAutoevaluacion`.

#### Campos requeridos
1. **Información general:** nombre comercial y legal, descripciones ES/EN, año de fundación (DD/MM/AAAA), sitio web, tamaño, cédula jurídica, actividad comercial.
2. **Imágenes y multimedia:** logo (≤1 MB JPG/PNG), fotografías (1-3, ≤3 MB c/u), certificaciones opcionales (≤1 MB c/u).
3. **Información de licenciamiento:** razones ES/EN, proceso y recomendación de Marca País.
4. **Contactos obligatorios:** notificaciones, proceso de licenciamiento y representante legal (nombre completo, email, puesto, teléfono, celular y cédula donde aplique).
5. **Contactos opcionales:** mercadeo, micrositio y vocero con los mismos campos.
6. **Empresas exportadoras:** países de exportación, productos o servicios, rango de exportaciones y planes de expansión.

#### Reglas y restricciones
- Campos obligatorios marcados con *.
- Validaciones específicas para emails, teléfonos numéricos y fechas.
- Capacidad de guardado parcial y bloqueo tras finalizar autoevaluación.
- Edición posterior solo mediante intervención de evaluadores o super administradores.

### 9.3 Proceso de autoevaluación (contenido completo)
#### Inicio
- Registro de fecha de inicio para congelar el conjunto de indicadores; nuevos indicadores no afectan evaluaciones en curso.
- Verificación de certificaciones vigentes y homologación automática (respuestas "Sí" no editables mientras la certificación esté activa).

#### Evaluación de indicadores
- Visualización agrupada por valores, mostrando homologaciones y marcadores de indicadores descalificatorios.
- Respuestas binarias (Sí/No) con justificación obligatoria para "Sí".
- Guardado automático cada 30 s y bloqueo de edición para homologados.

#### Indicadores descalificatorios
- Etiquetas visibles; cualquier "No" descalifica pero permite completar el resto para expediente.

#### Cálculo de puntaje
```
Puntaje = (Respuestas "Sí" + Indicadores Homologados) / Total de Indicadores * 100
```
- Requisitos: nota mínima por valor, todos los descalificatorios en "Sí" y homologaciones contadas como "Sí".

#### Formulario adicional y documentación
- Información general, contactos, operaciones y anexos (logo, fotos, certificaciones, catálogo de productos) deben estar completos para finalizar.

#### Finalización del proceso
1. Verificación de completitud.
2. Cálculo del puntaje final.
3. Generación de reporte PDF.
4. Envío de notificaciones.
5. Bloqueo de edición.

#### Homologaciones
- Flujo: carga de certificaciones → verificación de vigencia → identificación de indicadores homologables → asignación automática de respuestas y justificaciones.
- Reversión automática cuando vence la certificación.

#### Rutas y seguridad
- Visualización: `GET /indicadores/{id}`.
- Respuestas: `POST /indicadores/store-answers`, `POST /indicadores/save-partial-answers`.
- Finalización: `POST /indicadores/finalizar-autoevaluacion`.
- Formularios adicionales y cargas: `POST /company/profile` y variantes `upload-{tipo}`.
- Seguridad basada en autenticación, verificación de pertenencia a empresa, control de edición y validaciones de formatos/fechas/archivos.
- Notificaciones por guardado automático, certificaciones próximas a vencer, finalización y aprobaciones/rechazos.

### 9.4 Proceso de evaluación formal (contenido completo)
#### Requisitos previos
- Autoevaluación completada, indicadores respondidos con "Sí", formulario empresarial completo y empresa exportadora o autorizada.

#### Filtrado y visualización
- Solo se muestran preguntas derivadas de indicadores aprobados y homologados en la fecha de registro, con soporte para homologaciones automáticas.

#### Tipos de preguntas y requisitos
- Preguntas binarias, descriptivas y homologadas.
- Cada pregunta requiere respuesta, descripción detallada, evidencias (1-3 archivos; formatos jpg/jpeg/png/pdf/doc/docx/xls/xlsx; ≤2 MB por archivo; ≤15 MB totales) y justificación cuando aplique.
- Evidencias se comprimen y almacenan de forma segura.

#### Homologaciones
- Identificación automática de certificaciones válidas, mapeo de indicadores, asignación de respuestas y reutilización de evidencias; edición bloqueada mientras la certificación siga vigente.

#### Calificación por evaluador
- Pasos: revisión, verificación de evidencias, calificación (Aprobado/No aprobado) y comentarios.
- Criterios: pertinencia, calidad, cumplimiento y validez de homologaciones.

#### Cálculo de puntaje
```
Puntaje = (Preguntas Aprobadas / Total de Preguntas a Responder) * 100
```
- Solo se consideran preguntas calificadas; homologaciones cuentan como aprobadas; indicadores vinculantes son críticos.

#### Estados del proceso
1. `evaluacion` (inicial)
2. `evaluacion-pendiente` (completada por la empresa)
3. `evaluacion-completada` (enviada al evaluador)
4. `evaluado` (en revisión)
5. `evaluacion-calificada` (aprobada)
6. `evaluacion-desaprobada` (rechazada)
- Transiciones automáticas o manuales generan notificaciones para empresa, evaluador y super administración.

#### Roles y responsabilidades
- **Empresa:** responde preguntas, sube evidencias, envía la evaluación y consulta calificaciones; no puede editar tras el envío ni aprobarse a sí misma.
- **Evaluador:** revisa respuestas, califica preguntas, agrega comentarios, verifica evidencias, valida homologaciones, justifica rechazos y genera reportes.

#### Rutas del sistema
- Visualización: `GET /evaluacion/{value_id}`, `GET /api/evaluation/indicators`.
- Respuestas: `POST /evaluacion/store-answers`, `POST /evaluacion/store-answers-by-indicator`.
- Calificación y reevaluación: `POST /evaluacion/calificar-nuevamente`, `POST /evaluacion/enviar-evaluacion-calificada`.
- Panel evaluador: `GET /evaluador/dashboard`, `GET /evaluador/evaluations`, `POST /api/evaluador/switch-company`.

#### Seguridad y validaciones
- Control de archivos (tipos, tamaños, compresión, almacenamiento seguro).
- Verificación de roles, control de estados, registro de acciones y trazabilidad completa.
- Sanitización de inputs, validación de formatos y respaldos automáticos de respuestas/evidencias.

#### Reportes y notificaciones
- PDF con resumen ejecutivo, detalle por valor, evidencias y calificaciones.
- Estadísticas de progreso, puntajes, indicadores críticos y homologaciones.
- Notificaciones por evaluación completada, calificación, aprobación/rechazo y cambios de estado.

### 9.5 Gestión de certificaciones (contenido completo)
#### Rutas
- Visualización: `GET /certifications/create` (lista existente + formulario), protegido con `auth`, `verified`, `EnsureUserHasCompany`.
- Creación: `POST /certifications` con las mismas protecciones.
- Actualización: `PUT /certifications/{certification}`.
- Eliminación: `DELETE /certifications/{certification}`.

#### Proceso de creación
1. Selección de certificación homologable; se evita duplicidad.
2. Registro de fechas: obtención (≤ fecha actual) y expiración (> obtención).
3. Captura del organismo certificador (obligatorio, solo letras y números).
4. Gestión de archivos: máximo 3, 5 MB por archivo, 15 MB totales, formatos jpg/jpeg/png/pdf/doc/docx/xls/xlsx; permite arrastrar y soltar, selección manual, vista previa y eliminación individual.
5. Validaciones: campos obligatorios completos, coherencia de fechas, formatos y tamaños correctos, al menos un archivo y ausencia de duplicados.
6. Procesamiento: validación del formulario, compresión de imágenes, almacenamiento de archivos, registro en base, cálculo de indicadores homologados y respuesta al usuario.

#### Gestión de certificaciones existentes
- Lista ordenada con información detallada, estado de expiración y archivos adjuntos.
- Edición de fechas, organismo y archivos (agregar/eliminar con límites vigentes, visualizar existentes).
- Eliminación mediante modal de confirmación que borra registros y archivos asociados.

#### Manejo de errores y seguridad
- Validación en tiempo real, mensajes específicos, rollback y limpieza de archivos ante fallos.
- Registro de errores en logs.
- Autenticación obligatoria, verificación de email, pertenencia a empresa, sanitización de inputs y protección contra desbordamientos de archivos.

## 10. Manual de Seguridad y Niveles de Protección
1. **Autenticación:** uso de hashing seguro (bcrypt/argon), recuperación de contraseñas y verificación de correo.
2. **Sesiones:** expiración configurable, limpieza de sesiones inactivas y revocación de tokens en dispositivos comprometidos.
3. **Roles y permisos:** super administradores gestionan catálogos y usuarios; evaluadores solo ven empresas asignadas; administradores de empresa editan datos antes de la evaluación; usuarios regulares visualizan su progreso.
4. **Integridad de datos:** transacciones durante registro y creación de empresas; rollback ante errores.
5. **Disponibilidad:** recomendaciones de despliegue con balanceadores, supervisión de colas y monitoreo de jobs.
6. **Respaldo:** políticas para respaldar base de datos, almacenamiento de archivos y catálogos críticos.

## 11. Manuales específicos
### Instalación
(ya detallado en la sección 8.1).

### Operación
- Tableros por rol muestran estados (registro, autoevaluación, evaluación, certificaciones, reportes mensuales).
- Recordatorio para rotar contraseñas administrativas y habilitar MFA en servidores si aplica.

### Mantenimiento
- Actualizar dependencias con `composer update`/`npm update` siguiendo ventanas de mantenimiento.
- Ejecutar `php artisan config:cache`, `route:cache` y `view:cache` tras desplegar.
- Revisar logs (`storage/logs`, Laravel Pail) y limpiar archivos temporales.

## 12. Inventario integrado para TI
- **Aplicación web:** código Laravel + React descrito en este expediente.
- **Base de datos:** estructura y datos semilla provistos en el volcado histórico para iniciar operaciones.
- **Catálogos JSON:** listados de lugares y países sincronizados con los formularios y reportes.
- **Plantillas institucionales:** PDFs ubicados en el almacenamiento público para generar expedientes.
- **Documentación:** este archivo concentra tecnologías, procesos, manuales, diagramas y controles.

## 13. Conclusiones
La plataforma cumple con los requisitos de TI al documentar exhaustivamente tecnologías, arquitectura, procesos, seguridad y manuales operativos en un único archivo Markdown. Este expediente integra los contenidos de los dossiers anteriores (registro, formulario empresarial, autoevaluación, evaluación, certificaciones y documentación técnica) para que la Dirección de TI disponga de una fuente única, actualizable y lista para auditorías o aprobaciones regulatorias.