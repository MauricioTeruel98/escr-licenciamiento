# Documentación Completa del Sistema de Licenciamiento ESCR

Esta guía amplía la información del `README.md` y detalla la estructura del proyecto, flujos principales y aspectos a considerar al trabajar en la base de código.

## 1. Descripción general

Aplicación desarrollada con **Laravel**, **Inertia.js** y **React**. Gestiona empresas y evaluaciones del proceso de licenciamiento "Esencial Costa Rica". La autenticación usa Laravel Sanctum y el frontend se compone de páginas React renderizadas por Inertia.

## 2. Configuración inicial

Los pasos básicos de instalación se resumen en el `README.md`:

```bash
npm install
composer install
```

Luego se configura el archivo `.env`, se genera la clave de la aplicación y se importan las migraciones iniciales junto con `db_limpia.sql`. Para ejecutar el proyecto en desarrollo:

```bash
php artisan serve
npm run dev
```

No olvides copiar `lugares.json` y `paises.json` a `storage/app/public` y crear el enlace simbólico de `storage` con `php artisan storage:link`.

## 3. Estructura de carpetas

- **app/** – Controladores, modelos, servicios y middlewares.
- **routes/web.php** – Contiene todas las rutas de la aplicación, agrupadas por rol y funcionalidad.
- **resources/js** – Componentes y páginas React que se renderizan mediante Inertia.
- **resources/views** – Plantillas Blade para correos y PDF.
- **database/migrations** – Migraciones activas.
- **database/migrations-old** – Historial de migraciones previas (algunas tablas ya están creadas en `db_limpia.sql`).
- **app/Filament** – Configuración de la interfaz administrativa con Filament.

## 4. Modelos principales

- **Company**: mantiene información de la empresa y relaciones con usuarios, certificaciones y resultados de evaluación. Incluye campos como `fecha_inicio_auto_evaluacion` y `estado_eval` para controlar el flujo.
- **User**: representa a los usuarios con roles (`super_admin`, `admin`, `user`, `evaluador`).
- **Indicator** y **EvaluationQuestion**: definen las preguntas de autoevaluación y evaluación.
- **IndicatorAnswer** y **IndicatorAnswerEvaluation**: almacenan respuestas de empresa y evaluador.
- **AutoEvaluationResult** y **EvaluationValueResult**: guardan los puntajes y estados de los procesos.
- **InfoAdicionalEmpresa**: datos ampliados de la empresa, como redes sociales o información de multi‑sitio.

## 5. Roles y permisos

En el `README` se listan los roles disponibles junto con una descripción resumida:

```
| **super_admin** | Control completo de procesos y empresas |
| **admin**       | Gestión de licenciamiento y evaluaciones |
| **user**        | Participación en la autoevaluación |
| **evaluador**   | Realiza la evaluación final |
```

El middleware de cada rol (`EnsureUserIsSuperAdmin`, `EnsureUserIsAdmin`, `EnsureUserIsEvaluador`, etc.) se encarga de restringir el acceso a las secciones correspondientes.

## 6. Flujo de autoevaluación y evaluación

1. **Registro de empresa** – Un usuario inicia sesión y registra su empresa (`/company-register`).
2. **Autoevaluación** – Desde el dashboard (`/dashboard`) se responden los indicadores. Las respuestas se guardan a través de `IndicadorAnswerController`.
3. **Envío de solicitud** – Al completar la autoevaluación, la empresa envía la solicitud mediante `EvaluationController@sendApplication`. Esto marca `application_sended` en `auto_evaluation_result`.
4. **Autorización** – Un super administrador revisa la empresa y puede autorizarla (`CompanyAuthorizationController`). Sólo las empresas autorizadas pueden pasar a la evaluación.
5. **Evaluación** – Un evaluador asignado responde las preguntas en `/evaluacion/{value_id}`. Las rutas usan `EnsureCompanyIsAuthorized` para validar que la empresa esté autorizada.
6. **Finalización** – Tras la evaluación se genera un PDF y se guardan los resultados en `evaluation_document_path`.

## 7. Particularidades y consejos

- **Migrations históricas**: la carpeta `database/migrations-old` conserva más de 70 migraciones previas. Muchas tablas ya existen en `db_limpia.sql`, por lo que estas migraciones sirven de referencia histórica.
- **MailService**: el servicio `app/Services/MailService.php` centraliza el envío de correos y registra cada intento en la tabla `mail_logs`. Permite reintentar envíos fallidos y captura errores para auditoría.
- **Archivos de soporte**: `lugares.json` y `paises.json` se utilizan para cargar provincias y países en formularios. Deben estar accesibles en `storage/app/public`.
- **Campos de multi‑sitio**: tanto `Company` como `InfoAdicionalEmpresa` incluyen los campos `tiene_multi_sitio`, `cantidad_multi_sitio` y `aprobo_evaluacion_multi_sitio`. Estos datos se gestionan en el formulario de la empresa y en el panel del evaluador.
- **Middleware `EnsureApplicationSended`**: impide avanzar en el proceso hasta que la autoevaluación haya sido enviada correctamente.
- **Generación de PDFs**: la carpeta `resources/views/pdf` contiene plantillas Blade usadas por `PDFController` para generar documentos con DomPDF.
- **Filament**: en `app/Filament` se configura un panel administrativo adicional para homologaciones y otros recursos.
- **Archivos subidos**: todas las imágenes y documentos se guardan en `storage/app/public`. Recuerda ejecutar `php artisan storage:link` para crear `public/storage` en entornos locales.
- **Importaciones masivas**: el controlador `ImportController` permite cargar empresas y usuarios desde archivos externos (`/importaciones`).
- **Registros de correo**: la vista de super administrador en `/mail-logs` permite revisar intentos de envío y volver a intentarlos manualmente.

## 8. Desarrollo front‑end

La carpeta `resources/js` alberga componentes React divididos en secciones (`Pages/Dashboard`, `Pages/SuperAdmin`, `Pages/Evaluador`, etc.). Cada página se monta dentro de un layout (por ejemplo, `DashboardLayout`) y utiliza Inertia para las transiciones.

- Los formularios envían datos con `useForm` de Inertia o mediante Axios.
- Algunas páginas (como `Dashboard/Evaluation.jsx`) muestran modales para confirmar el envío de la autoevaluación o la evaluación.
- Los assets de Tailwind están configurados en `tailwind.config.js` y se compilan mediante Vite.

## 9. Construcción para producción

Para desplegar la aplicación se ejecuta:

```bash
npm run build
php artisan optimize
```

El comando `npm run build` genera los archivos estáticos en `public/` y `php artisan optimize` prepara las cachés. Recuerda limpiar las cachés con `php artisan optimize:clear` antes de cada despliegue.

## 10. Usuario de prueba

El `README` proporciona un usuario super administrador para el entorno de desarrollo:

```
Email: admin@admin.com
Contraseña: password
```

Con estas credenciales tendrás acceso completo al panel de administración.

---

Esta documentación ofrece una visión detallada del proyecto para nuevos colaboradores. Revisa el código en `routes/web.php` y los controladores mencionados para entender en profundidad cada flujo.
