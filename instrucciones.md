# Sistema de Licenciamiento ESCR

## 🚀 Configuración Inicial

### Requisitos Previos
El proyecto está desarrollado con:
- Laravel
- Inertia.js
- React.js

### Pasos de Instalación

1. **Instalar Dependencias**
   ```bash
   npm install
   composer install
   ```

2. **Configuración del Entorno**
   - Crear archivo `.env`
   - Copiar contenido de `.env.example` a `.env`
   - Configurar variables de entorno según tu entorno local
   - Generar key:
     ```bash
     php artisan key:generate
     ```

3. **Configuración de Base de Datos**
   - Crear base de datos MySQL
   - Importar archivo `db_limpia.sql`
   - Ejecutar migraciones:
     ```bash
     php artisan migrate
     ```

4. **Configuración Adicional**
   ```bash
   # Limpiar caché
   php artisan optimize:clear

   # Crear enlace simbólico de storage
   php artisan storage:link
   ```

5. **Archivos Requeridos**
   Copiar en `storage/app/public`:
   - `lugares.json`
   - `paises.json`

## 🏃‍♂️ Ejecutar el Proyecto

1. **Iniciar Servidor Laravel**
   ```bash
   php artisan serve
   ```

2. **Iniciar Servidor de Desarrollo**
   ```bash
   npm run dev
   ```

3. Acceder a través del localhost

## 📦 Despliegue en Producción

1. **Generar Build**
   ```bash
   npm run build
   ```
   > Nota: Los archivos de vistas se generarán en la carpeta `public`

2. **Gestión de Caché**
   ```bash
   # Limpiar caché
   php artisan optimize:clear

   # Setear caché
   php artisan optimize
   ```

## 👥 Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| **super_admin** | - Control de elementos en procesos de licenciamiento<br>- Acceso a panel de administración de todas las empresas |
| **admin** | Gestión de procesos de licenciamiento, autoevaluación y evaluación |
| **user** | Participación en procesos de licenciamiento, autoevaluación y evaluación |
| **evaluador** | Evaluación de procesos una vez finalizados por la empresa |

### Nota sobre Roles
Las funcionalidades pueden variar según el rol del usuario. Verificar en el código las condiciones específicas para roles de evaluador, admin o super_admin.

### Rutas
Las rutas y sus correspondientes vistas/acciones se encuentran definidas en `routes/web.php`:
- GET: Renderización de vistas
- POST/PUT/DELETE: Ejecución de acciones

## 🛣️ Documentación de Rutas y Controladores

### 🖥️ Vistas Principales

#### Dashboard
- **Ruta**: `/dashboard`
- **Controlador**: `DashboardController@showEvaluation`
- **Middleware**: `auth, verified, EnsureUserHasCompany`
- **Acciones**:
  - GET: Muestra el dashboard principal

#### Autenticación de Empresa
- **Ruta Base**: `/company-register`
- **Controlador**: `CompanyAuthController`
- **Middleware**: `auth`
- **Acciones**:
  - GET `/regard`: Muestra página de consideración
  - GET `/company-register`: Formulario de registro de empresa
  - POST `/company-register`: Almacena nueva empresa
  - GET `/legal-id`: Muestra formulario de ID legal
  - POST `/legal-id/verify`: Verifica ID legal
  - GET `/company-exists`: Muestra página de empresa existente
  - POST `/company-request-access`: Solicita acceso a empresa

#### Perfil de Usuario
- **Ruta Base**: `/profile`
- **Controlador**: `ProfileController`
- **Middleware**: `auth`
- **Acciones**:
  - GET: Muestra formulario de edición
  - PATCH: Actualiza perfil
  - DELETE: Elimina perfil

### 👑 Panel Super Admin

#### Dashboard Super Admin
- **Ruta**: `/super/dashboard`
- **Controlador**: `SuperAdminController`
- **Middleware**: `auth, EnsureUserIsSuperAdmin`
- **Acciones API**:
  - GET `/api/super/dashboard-stats`: Obtiene estadísticas
  - POST `/api/super/switch-company`: Cambia empresa activa
  - GET `/api/super/active-company`: Obtiene empresa activa

#### Gestión de Usuarios
- **Ruta**: `/super/users`
- **Controlador**: `UsersManagementSuperAdminController`
- **Middleware**: `auth, EnsureUserIsSuperAdmin`
- **Acciones API**:
  - GET `/api/users`: Lista usuarios
  - POST `/api/users`: Crea usuario
  - PUT `/api/users/{user}`: Actualiza usuario
  - DELETE `/api/users/{user}`: Elimina usuario
  - PATCH `/api/users/{user}/status`: Actualiza estado
  - PATCH `/api/users/{user}/role`: Actualiza rol

#### Gestión de Empresas
- **Ruta**: `/super/companies`
- **Controlador**: `CompanyManagementController`
- **Middleware**: `auth, EnsureUserIsSuperAdmin`
- **Acciones API**:
  - GET `/api/companies`: Lista empresas
  - POST `/api/companies`: Crea empresa
  - PUT `/api/companies/{company}`: Actualiza empresa
  - DELETE `/api/companies/{company}`: Elimina empresa

### 📊 Módulo de Evaluación

#### Indicadores
- **Ruta**: `/indicadores/{id}`
- **Controlador**: `IndicadoresController`
- **Middleware**: `auth, verified, EnsureUserHasCompany`
- **Acciones API**:
  - POST `/indicadores/store-answers`: Guarda respuestas
  - POST `/indicadores/save-partial-answers`: Guarda respuestas parciales
  - POST `/indicadores/finalizar-autoevaluacion`: Finaliza autoevaluación

#### Evaluación
- **Ruta**: `/evaluacion/{value_id}`
- **Controlador**: `EvaluationController`
- **Middleware**: `auth, verified, EnsureUserHasCompany, EnsureCompanyIsAuthorized`
- **Acciones API**:
  - POST `/evaluacion/store-answers`: Guarda respuestas
  - POST `/evaluacion/store-answers-by-indicator`: Guarda por indicador
  - DELETE `/evaluacion/delete-file`: Elimina archivo

### 👨‍💼 Módulo de Evaluador

#### Dashboard Evaluador
- **Ruta**: `/evaluador/dashboard`
- **Controlador**: `EvaluadorController`
- **Middleware**: `auth, EnsureUserIsEvaluador`
- **Acciones API**:
  - GET `/api/evaluador/companies`: Lista empresas
  - POST `/api/evaluador/switch-company`: Cambia empresa activa
  - GET `/api/evaluador/active-company`: Obtiene empresa activa

### 📄 Reportes y Documentación

#### Reportes
- **Ruta**: `/super/reportes`
- **Controlador**: `ReportController`
- **Middleware**: `auth, EnsureUserIsSuperAdmin`
- **Acciones API**:
  - GET `/api/empresas-reportes`: Obtiene empresas para reportes
  - PATCH `/api/empresas-reportes/{company}/authorize-exporter`: Autoriza exportador

#### Documentos PDF
- **Controlador**: `PDFController`
- **Middleware**: `auth`
- **Rutas**:
  - GET `/download-indicators-pdf`: Descarga PDF de indicadores
  - GET `/download-company-documentation`: Descarga documentación de empresa
  - GET `/download-evaluation-pdf/{companyId?}`: Descarga PDF de evaluación

### 🔄 API Routes

#### Autenticación API
- **Ruta**: `/api/user`
- **Middleware**: `auth:sanctum`
- **Acciones**:
  - GET: Obtiene usuario actual

#### Gestión de Usuarios API
- **Base**: `/api/users/company`
- **Controlador**: `UserController`
- **Middleware**: `auth:sanctum, web`
- **Acciones**:
  - GET: Lista usuarios de empresa
  - POST: Crea usuario
  - PUT `/{user}`: Actualiza usuario
  - DELETE `/{user}`: Elimina usuario

#### Datos Geográficos API
- **Ruta**: `/api/provincias`
- **Middleware**: Ninguno
- **Acciones**:
  - GET: Obtiene lista de provincias

### 🔒 Middleware Utilizados
- `auth`: Autenticación básica
- `verified`: Usuario verificado
- `EnsureUserHasCompany`: Usuario tiene empresa asignada
- `EnsureUserIsAdmin`: Usuario es administrador
- `EnsureUserIsSuperAdmin`: Usuario es super administrador
- `EnsureUserIsEvaluador`: Usuario es evaluador
- `EnsureCompanyIsAuthorized`: Empresa está autorizada
- `EnsureApplicationSended`: Aplicación enviada