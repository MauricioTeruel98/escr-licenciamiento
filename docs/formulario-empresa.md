# Documentación del Formulario de Empresa

## Descripción General
El formulario de empresa es una parte crucial del proceso de licenciamiento de Marca País. Permite a las empresas registrar su información detallada y es un requisito previo para completar la autoevaluación.

## Funciones Principales

### Manejo de Estado y Datos
- `handleChange(e)`: Gestiona los cambios en los campos del formulario, incluyendo validaciones específicas para cada tipo de campo.
- `handleURLChange(e)`: Maneja específicamente los cambios en campos de URL, asegurando el formato correcto.
- `handleAnioFundacionChange(e)`: Gestiona el formato y validación de la fecha de fundación en formato DD/MM/AAAA.
- `handlePaisesChange(e)`: Maneja la selección múltiple de países para empresas exportadoras.

### Validación y Procesamiento
- `validarCampo(valor, tipo)`: Realiza validaciones específicas según el tipo de campo (texto, números, email, etc.).
- `isValidEmail(email)`: Valida el formato correcto de direcciones de correo electrónico.
- `obtenerLimitesEmpleados(tamanoEmpresa)`: Define los límites de empleados según el tamaño de la empresa.

### Manejo de Imágenes
- `handleImagenChange(e, tipo)`: Procesa la carga de imágenes (logo, fotografías, certificaciones).
- `uploadLogo()`: Gestiona la subida del logo de la empresa.
- `uploadFotografias()`: Maneja la subida de fotografías de la empresa.
- `uploadCertificaciones()`: Procesa la subida de certificaciones.
- `removeImagen(tipo, index)`: Elimina imágenes del formulario.
- `removeExistingImage(tipo, path)`: Elimina imágenes existentes del servidor.

### Gestión de Productos
- `agregarProducto()`: Añade un nuevo producto al formulario.
- `handleDeleteProducto(producto, index)`: Maneja la eliminación de productos.
- `eliminarProductoNuevo(index)`: Elimina productos que aún no han sido guardados.
- `confirmarEliminarProducto()`: Confirma y procesa la eliminación de productos existentes.

### Navegación y UI
- `toggleSeccion(seccion)`: Controla la expansión/contracción de secciones del formulario.
- `pasarSiguienteSeccion(seccionActual)`: Navega automáticamente a la siguiente sección.
- `openFinalizarModal()`: Abre el modal de finalización de autoevaluación.
- `confirmFinalizarAutoevaluacion()`: Procesa la finalización de la autoevaluación.

## Campos Requeridos para el Licenciamiento

### Información General de la Empresa
- Nombre comercial*
- Nombre legal (razón social)*
- Descripción en español*
- Descripción en inglés*
- Año de fundación*
- Sitio web*
- Tamaño de empresa*
- Cédula jurídica*
- Actividad comercial*

### Imágenes y Multimedia
- Logo de la empresa*
- Fotografías de la empresa (mínimo 1, máximo 3)*
- Certificaciones (opcional)

### Información de Licenciamiento
- Razón de licenciamiento (español)*
- Razón de licenciamiento (inglés)*
- Proceso de licenciamiento*
- Recomendación de marca país*

### Contactos Requeridos
1. **Contacto para Notificaciones***
   - Nombre completo
   - Email
   - Puesto
   - Teléfono
   - Celular

2. **Contacto para Proceso de Licenciamiento***
   - Nombre completo
   - Email
   - Puesto
   - Teléfono
   - Celular

3. **Representante Legal***
   - Nombre completo
   - Email
   - Puesto
   - Cédula
   - Teléfono
   - Celular

### Contactos Opcionales
1. **Contacto de Mercadeo**
   - Nombre completo
   - Email
   - Puesto
   - Teléfono
   - Celular

2. **Contacto Micrositio**
   - Nombre completo
   - Email
   - Puesto
   - Teléfono
   - Celular

3. **Contacto Vocero**
   - Nombre completo
   - Email
   - Puesto
   - Teléfono
   - Celular

### Información Adicional para Empresas Exportadoras
Si la empresa es exportadora, se requiere:
- Países de exportación
- Producto o servicio exportado
- Rango de exportaciones
- Planes de expansión

## Notas Importantes
- Los campos marcados con * son obligatorios
- Las imágenes tienen restricciones específicas de tamaño y formato
- El formulario debe estar completo para poder finalizar la autoevaluación
- La información puede ser guardada parcialmente para completar posteriormente
- Una vez finalizada la autoevaluación, la información no podrá ser modificada hasta la revisión por parte de la Marca País

## Validaciones y Restricciones
- Imágenes: solo formatos JPG, JPEG, PNG
- Logo: máximo 1MB
- Fotografías: máximo 3MB cada una
- Certificaciones: máximo 1MB cada una
- Campos de texto: límites específicos de caracteres
- Emails: formato válido requerido
- Teléfonos: solo números
- Fechas: formato DD/MM/AAAA 