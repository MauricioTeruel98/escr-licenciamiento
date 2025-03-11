import { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import InputError from '@/Components/InputError';
import axios from 'axios';
import Toast from '@/Components/ToastAdmin';
import { TrashIcon } from '@heroicons/react/20/solid';
import DeleteModal from '@/Components/Modals/DeleteModal';
import EvaluacionProcessing from '@/Components/Modals/EvaluacionProcessing';

/**
 * Mejoras implementadas:
 * 1. Validación de campos con mensajes de error mostrados directamente en los campos correspondientes
 * 2. Eliminación de alertas intrusivas y reemplazo por mensajes de error inline
 * 3. Manejo de errores del backend mostrándolos en los campos correspondientes
 * 4. Limpieza de errores cuando los campos son corregidos
 * 5. Mantenimiento del toast solo para mensajes generales de éxito o error no específicos de un campo
 */

export default function CompanyProfile({ userName, infoAdicional }) {
    const { data, setData, post, processing, errors: backendErrors } = useForm({
        nombre_comercial: infoAdicional?.nombre_comercial || '',
        nombre_legal: infoAdicional?.nombre_legal || '',
        descripcion_es: infoAdicional?.descripcion_es || '',
        descripcion_en: infoAdicional?.descripcion_en || '',
        sitio_web: infoAdicional?.sitio_web || '',
        facebook: infoAdicional?.facebook || '',
        linkedin: infoAdicional?.linkedin || '',
        instagram: infoAdicional?.instagram || '',
        otra_red_social: infoAdicional?.otra_red_social || '',
        sector: infoAdicional?.sector || '',
        tamano_empresa: infoAdicional?.tamano_empresa || '',
        anio_fundacion: infoAdicional?.anio_fundacion || '',
        cantidad_hombres: infoAdicional?.cantidad_hombres || '',
        cantidad_mujeres: infoAdicional?.cantidad_mujeres || '',
        cantidad_otros: infoAdicional?.cantidad_otros || '',
        telefono_1: infoAdicional?.telefono_1 || '',
        telefono_2: infoAdicional?.telefono_2 || '',
        es_exportadora: infoAdicional?.es_exportadora || false,
        paises_exportacion: infoAdicional?.paises_exportacion || '',

        // Estos datos ahora vienen de la tabla companies
        provincia: infoAdicional?.provincia_id || '',
        canton: infoAdicional?.canton_id || '',
        distrito: infoAdicional?.distrito_id || '',
        direccion_empresa: infoAdicional?.direccion_empresa || '',

        cedula_juridica: infoAdicional?.cedula_juridica || '',
        actividad_comercial: infoAdicional?.actividad_comercial || '',
        producto_servicio: infoAdicional?.producto_servicio || '',
        rango_exportaciones: infoAdicional?.rango_exportaciones || '',
        planes_expansion: infoAdicional?.planes_expansion || '',

        razon_licenciamiento_es: infoAdicional?.razon_licenciamiento_es || '',
        razon_licenciamiento_en: infoAdicional?.razon_licenciamiento_en || '',
        proceso_licenciamiento: infoAdicional?.proceso_licenciamiento || '',
        recomienda_marca_pais: infoAdicional?.recomienda_marca_pais || false,
        observaciones: infoAdicional?.observaciones || '',

        // Contacto para recibir notificaciones de la Marca País
        contacto_notificacion_nombre: infoAdicional?.contacto_notificacion_nombre || '',
        contacto_notificacion_email: infoAdicional?.contacto_notificacion_email || '',
        contacto_notificacion_puesto: infoAdicional?.contacto_notificacion_puesto || '',
        contacto_notificacion_cedula: infoAdicional?.contacto_notificacion_cedula || '',
        contacto_notificacion_telefono: infoAdicional?.contacto_notificacion_telefono || '',
        contacto_notificacion_celular: infoAdicional?.contacto_notificacion_celular || '',

        // Contacto asignado para llevar el proceso del licenciamiento
        asignado_proceso_nombre: infoAdicional?.asignado_proceso_nombre || '',
        asignado_proceso_email: infoAdicional?.asignado_proceso_email || '',
        asignado_proceso_puesto: infoAdicional?.asignado_proceso_puesto || '',
        asignado_proceso_cedula: infoAdicional?.asignado_proceso_cedula || '',
        asignado_proceso_telefono: infoAdicional?.asignado_proceso_telefono || '',
        asignado_proceso_celular: infoAdicional?.asignado_proceso_celular || '',

        mercadeo_nombre: infoAdicional?.mercadeo_nombre || '',
        mercadeo_email: infoAdicional?.mercadeo_email || '',
        mercadeo_puesto: infoAdicional?.mercadeo_puesto || '',
        mercadeo_telefono: infoAdicional?.mercadeo_telefono || '',
        mercadeo_celular: infoAdicional?.mercadeo_celular || '',

        micrositio_nombre: infoAdicional?.micrositio_nombre || '',
        micrositio_email: infoAdicional?.micrositio_email || '',
        micrositio_puesto: infoAdicional?.micrositio_puesto || '',
        micrositio_telefono: infoAdicional?.micrositio_telefono || '',
        micrositio_celular: infoAdicional?.micrositio_celular || '',

        vocero_nombre: infoAdicional?.vocero_nombre || '',
        vocero_email: infoAdicional?.vocero_email || '',
        vocero_puesto: infoAdicional?.vocero_puesto || '',
        vocero_telefono: infoAdicional?.vocero_telefono || '',
        vocero_celular: infoAdicional?.vocero_celular || '',

        representante_nombre: infoAdicional?.representante_nombre || '',
        representante_email: infoAdicional?.representante_email || '',
        representante_puesto: infoAdicional?.representante_puesto || '',
        representante_cedula: infoAdicional?.representante_cedula || '',
        representante_telefono: infoAdicional?.representante_telefono || '',
        representante_celular: infoAdicional?.representante_celular || '',

        productos: infoAdicional?.productos
            ? infoAdicional.productos.map(p => ({
                id: p.id,
                nombre: p.nombre,
                descripcion: p.descripcion,
                imagen: p.imagen
            }))
            : []
    });

    const [loading, setLoading] = useState(false);
    const [clientErrors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [camposFaltantes, setCamposFaltantes] = useState([]);

    // Combinar errores del backend y del cliente para mostrarlos en los campos
    const errors = { ...backendErrors, ...clientErrors };

    // Estado inicial para las imágenes existentes
    const [imagenes, setImagenes] = useState({
        logo: null,
        fotografias: [],
        certificaciones: [],
        productos: []
    });

    // Cargar datos iniciales
    useEffect(() => {
        if (infoAdicional) {
            // Inicializar imágenes
            const productosImagenes = [];

            // Si hay productos con imágenes, inicializar el array de imágenes de productos
            if (infoAdicional.productos && infoAdicional.productos.length > 0) {
                infoAdicional.productos.forEach((producto, index) => {
                    if (producto.imagen) {
                        productosImagenes[index] = producto.imagen;
                    }
                });
            }

            setImagenes({
                logo: infoAdicional.logo || null,
                fotografias: infoAdicional.fotografias_urls || [],
                certificaciones: infoAdicional.certificaciones_urls || [],
                productos: productosImagenes
            });
        }
    }, [infoAdicional]);

    // Función para eliminar archivo existente
    const removeExistingImage = async (tipo, path, productoIndex = null) => {
        try {
            // Para el logo, no es necesario modificar la ruta
            const adjustedPath = tipo === 'logo' ? path : path.replace('/storage/', '');

            const response = await axios.post(route('company.profile.delete-file'), {
                type: tipo,
                path: adjustedPath,
                productoIndex: productoIndex
            });

            if (response.data.success) {
                setImagenes(prev => {
                    switch (tipo) {
                        case 'logo':
                            // También actualizar el estado de data para reflejar que el logo ha sido eliminado
                            setData(prevData => ({
                                ...prevData,
                                logo_existente: null
                            }));
                            return { ...prev, logo: null };
                        case 'fotografias':
                            return {
                                ...prev,
                                fotografias: prev.fotografias.filter(p => p !== path)
                            };
                        case 'certificaciones':
                            return {
                                ...prev,
                                certificaciones: prev.certificaciones.filter(p => p !== path)
                            };
                        case 'producto':
                            const newExistingProductos = [...prev.productos];
                            newExistingProductos[productoIndex] = null;
                            return {
                                ...prev,
                                productos: newExistingProductos
                            };
                        default:
                            return prev;
                    }
                });
            }
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
        }
    };

    // Renderizar imágenes existentes
    const renderExistingImages = (tipo) => {
        const images = tipo === 'logo' ?
            [imagenes.logo] :
            (tipo === 'fotografias' ? imagenes.fotografias : imagenes.certificaciones);

        return images.filter(Boolean).map((url, index) => (
            <div key={index} className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={() => removeExistingImage(tipo, url)}
                        className="mr-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <span className="text-sm">Imagen existente</span>
                </div>
                <div className="flex items-center">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </a>
                </div>
            </div>
        ));
    };

    // Estado para manejar el arrastre de archivos
    const [isDragging, setIsDragging] = useState(false);

    // Manejadores de eventos de arrastre
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e, tipo) => {
        e.preventDefault();
        setIsDragging(false);

        // Validar tipos de archivos permitidos
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const files = Array.from(e.dataTransfer.files).filter(
            file => allowedTypes.includes(file.type)
        );

        // Mostrar mensaje si hay archivos no permitidos
        if (files.length < e.dataTransfer.files.length) {
            alert('Solo se permiten archivos de tipo: jpg, jpeg o png. Los archivos no válidos han sido ignorados.');
        }

        // Si no hay archivos válidos, salir
        if (files.length === 0) {
            return;
        }

        // Definir límites por tipo de archivo
        const maxFiles = {
            logo: 1,
            fotografias: 3,
            certificaciones: 5,
            productos: 1
        };

        if (tipo === 'logo') {
            if (files.length > 0) {
                // Generar URL de vista previa para el logo
                const fileWithPreview = files[0];
                fileWithPreview.preview = URL.createObjectURL(files[0]);
                setImagenes(prev => ({
                    ...prev,
                    logo: fileWithPreview
                }));
            }
        } else if (tipo === 'fotografias') {
            // Verificar si se excede el límite de fotografías
            const currentCount = (imagenes.fotografias || []).length;
            const availableSlots = maxFiles.fotografias - currentCount;

            if (availableSlots <= 0) {
                alert(`Ya has alcanzado el límite máximo de ${maxFiles.fotografias} fotografías.`);
                return;
            }

            // Tomar solo los archivos que caben dentro del límite
            const filesToAdd = files.slice(0, availableSlots);

            if (filesToAdd.length < files.length) {
                alert(`Solo se han añadido ${filesToAdd.length} fotografías. El límite máximo es de ${maxFiles.fotografias} fotografías.`);
            }

            // Generar URLs de vista previa para las fotografías
            const filesWithPreviews = filesToAdd.map(file => {
                file.preview = URL.createObjectURL(file);
                return file;
            });

            setImagenes(prev => ({
                ...prev,
                fotografias: [...(prev.fotografias || []), ...filesWithPreviews]
            }));
        } else if (tipo === 'certificaciones') {
            // Verificar si se excede el límite de certificaciones
            const currentCount = (imagenes.certificaciones || []).length;
            const availableSlots = maxFiles.certificaciones - currentCount;

            if (availableSlots <= 0) {
                alert(`Ya has alcanzado el límite máximo de ${maxFiles.certificaciones} certificaciones.`);
                return;
            }

            // Tomar solo los archivos que caben dentro del límite
            const filesToAdd = files.slice(0, availableSlots);

            if (filesToAdd.length < files.length) {
                alert(`Solo se han añadido ${filesToAdd.length} certificaciones. El límite máximo es de ${maxFiles.certificaciones} certificaciones.`);
            }

            // Generar URLs de vista previa para las certificaciones
            const filesWithPreviews = filesToAdd.map(file => {
                file.preview = URL.createObjectURL(file);
                return file;
            });

            setImagenes(prev => ({
                ...prev,
                certificaciones: [...(prev.certificaciones || []), ...filesWithPreviews]
            }));
        } else {
            // Para productos, solo se permite 1 imagen por producto
            if (files.length > maxFiles.productos) {
                alert(`Solo se permite ${maxFiles.productos} imagen por producto.`);
                files = [files[0]]; // Tomar solo el primer archivo
            }

            setImagenes(prev => ({
                ...prev,
                [tipo]: [...(prev[tipo] || []), ...files]
            }));
        }
    };

    // Agregar estado para controlar las secciones expandidas
    const [seccionesExpandidas, setSeccionesExpandidas] = useState({
        informacion: true,
        contactos: true,
        productos: true,
        logos: true,
        licenciamiento: true,
    });

    const toggleSeccion = (seccion) => {
        setSeccionesExpandidas(prev => ({
            ...prev,
            [seccion]: !prev[seccion]
        }));
    };

    const handleImagenChange = (e, tipo, productoIndex = null) => {
        const files = Array.from(e.target.files);

        // Validar tipos de archivos permitidos
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            alert('Solo se permiten archivos de tipo: jpg, jpeg o png.');
            e.target.value = null; // Limpiar el input
            return;
        }

        // Validar tamaño máximo de 2 MB
        const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB en bytes
        const oversizedFiles = files.filter(file => file.size > maxSizeInBytes);

        if (oversizedFiles.length > 0) {
            alert('El tamaño máximo permitido por imagen es de 2 MB.');
            e.target.value = null; // Limpiar el input
            return;
        }

        // Definir límites por tipo de archivo
        const maxFiles = {
            logo: 1,
            fotografias: 3,
            certificaciones: 5,
            productos: 1
        };

        if (tipo === 'logo') {
            // Generar URL de vista previa para el logo
            const fileWithPreview = files[0];
            fileWithPreview.preview = URL.createObjectURL(files[0]);
            setImagenes(prev => ({ ...prev, logo: fileWithPreview }));
        } else if (tipo === 'fotografias') {
            // Verificar si se excede el límite de fotografías
            const currentCount = (imagenes.fotografias || []).length;
            const availableSlots = maxFiles.fotografias - currentCount;

            if (availableSlots <= 0) {
                alert(`Ya has alcanzado el límite máximo de ${maxFiles.fotografias} fotografías.`);
                e.target.value = null; // Limpiar el input
                return;
            }

            // Tomar solo los archivos que caben dentro del límite
            const filesToAdd = files.slice(0, availableSlots);

            if (filesToAdd.length < files.length) {
                alert(`Solo se han añadido ${filesToAdd.length} fotografías. El límite máximo es de ${maxFiles.fotografias} fotografías.`);
            }

            // Generar URLs de vista previa para las fotografías
            const filesWithPreviews = filesToAdd.map(file => {
                file.preview = URL.createObjectURL(file);
                return file;
            });

            setImagenes(prev => ({
                ...prev,
                fotografias: [...(prev.fotografias || []), ...filesWithPreviews]
            }));
        } else if (tipo === 'certificaciones') {
            // Verificar si se excede el límite de certificaciones
            const currentCount = (imagenes.certificaciones || []).length;
            const availableSlots = maxFiles.certificaciones - currentCount;

            if (availableSlots <= 0) {
                alert(`Ya has alcanzado el límite máximo de ${maxFiles.certificaciones} certificaciones.`);
                return;
            }

            // Tomar solo los archivos que caben dentro del límite
            const filesToAdd = files.slice(0, availableSlots);

            if (filesToAdd.length < files.length) {
                alert(`Solo se han añadido ${filesToAdd.length} certificaciones. El límite máximo es de ${maxFiles.certificaciones} certificaciones.`);
            }

            // Generar URLs de vista previa para las certificaciones
            const filesWithPreviews = filesToAdd.map(file => {
                file.preview = URL.createObjectURL(file);
                return file;
            });

            setImagenes(prev => ({
                ...prev,
                certificaciones: [...(prev.certificaciones || []), ...filesWithPreviews]
            }));
        } else if (tipo === 'producto') {
            // Para productos, solo se permite 1 imagen por producto
            if (files.length > maxFiles.productos) {
                alert(`Solo se permite ${maxFiles.productos} imagen por producto.`);
                files = [files[0]]; // Tomar solo el primer archivo
            }

            setImagenes(prev => {
                const newProductos = [...(prev.productos || [])];
                if (!newProductos[productoIndex]) {
                    newProductos[productoIndex] = [];
                }
                newProductos[productoIndex] = files[0];
                return { ...prev, productos: newProductos };
            });

            // También actualizar la referencia en el estado de data para mantener la consistencia
            setData(prevData => {
                const newProductos = [...prevData.productos];
                if (newProductos[productoIndex]) {
                    // Marcar que este producto tiene una nueva imagen
                    newProductos[productoIndex] = {
                        ...newProductos[productoIndex],
                        imagen_cambiada: true
                    };
                }
                return {
                    ...prevData,
                    productos: newProductos
                };
            });
        } else {
            setImagenes(prev => ({ ...prev, [tipo]: [...(prev[tipo] || []), ...files] }));
        }
    };

    const removeImagen = (tipo, index = null, productoIndex = null) => {
        if (tipo === 'logo') {
            setImagenes(prev => ({ ...prev, logo: null }));
        } else if (tipo === 'producto') {
            setImagenes(prev => {
                const newProductos = [...prev.productos];
                newProductos[productoIndex] = null;
                return { ...prev, productos: newProductos };
            });
        } else {
            setImagenes(prev => ({
                ...prev,
                [tipo]: prev[tipo].filter((_, i) => i !== index)
            }));
        }
    };

    const uploadLogo = async () => {
        if (!imagenes.logo) return null;

        const formData = new FormData();

        // Agregar logo si existe
        if (imagenes.logo instanceof File) {
            formData.append('logo', imagenes.logo);
        } else if (imagenes.logo) {
            // Si hay un logo existente, enviar su ruta
            formData.append('logo_existente', imagenes.logo);
        }

        try {
            const response = await axios.post(route('company.profile.upload-logo'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return response.data.success ? response.data.path : null;
        } catch (error) {
            console.error('Error al subir el logo:', error);
            throw error;
        }
    };

    const uploadFotografias = async () => {
        if (!imagenes.fotografias || imagenes.fotografias.length === 0) return null;

        const formData = new FormData();

        // Separar fotografías existentes de las nuevas
        const existingPhotos = [];

        imagenes.fotografias.forEach((foto, index) => {
            if (foto instanceof File) {
                formData.append(`fotografias[]`, foto);
            } else if (foto) {
                // Si es una foto existente (URL o path), guardar su ruta
                existingPhotos.push(foto.path || foto);
            }
        });

        // Enviar las rutas de las fotografías existentes
        if (existingPhotos.length > 0) {
            formData.append('fotografias_existentes', JSON.stringify(existingPhotos));
        }

        try {
            const response = await axios.post(route('company.profile.upload-fotografias'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return response.data.success ? response.data.paths : null;
        } catch (error) {
            console.error('Error al subir las fotografías:', error);
            throw error;
        }
    };

    const uploadCertificaciones = async () => {
        if (!imagenes.certificaciones || imagenes.certificaciones.length === 0) return null;

        const formData = new FormData();

        // Separar certificaciones existentes de las nuevas
        const existingCerts = [];

        imagenes.certificaciones.forEach((cert, index) => {
            if (cert instanceof File) {
                formData.append(`certificaciones[]`, cert);
            } else if (cert) {
                // Si es una certificación existente (URL o path), guardar su ruta
                existingCerts.push(cert.path || cert);
            }
        });

        // Enviar las rutas de las certificaciones existentes
        if (existingCerts.length > 0) {
            formData.append('certificaciones_existentes', JSON.stringify(existingCerts));
        }

        try {
            const response = await axios.post(route('company.profile.upload-certificaciones'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return response.data.success ? response.data.paths : null;
        } catch (error) {
            console.error('Error al subir las certificaciones:', error);
            throw error;
        }
    };

    const uploadProductos = async () => {
        if (!data.productos || data.productos.length === 0) return null;

        const formData = new FormData();

        // Agregar productos
        data.productos.forEach((producto, index) => {
            formData.append(`productos[${index}][id]`, producto.id || '');
            formData.append(`productos[${index}][nombre]`, producto.nombre || '');
            formData.append(`productos[${index}][descripcion]`, producto.descripcion || '');

            // Agregar imagen del producto si existe y es un nuevo archivo
            if (imagenes.productos && imagenes.productos[index] instanceof File) {
                formData.append(`productos[${index}][imagen]`, imagenes.productos[index]);
            } else if (producto.imagen) {
                // Mantener la imagen existente si no se sube una nueva
                formData.append(`productos[${index}][imagen_existente]`, producto.imagen);
            }
        });

        try {
            const response = await axios.post(route('company.profile.upload-productos'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return response.data.success ? response.data.productos : null;
        } catch (error) {
            console.error('Error al subir los productos:', error);
            throw error;
        }
    };

    const submit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setErrors({});
        setCamposFaltantes([]);

        try {
            // Subir imágenes por separado
            let logoPath = null;
            let fotografiasPaths = null;
            let certificacionesPaths = null;
            let productosData = null;

            try {
                // Subir logo
                logoPath = await uploadLogo();

                // Subir fotografías
                fotografiasPaths = await uploadFotografias();

                // Subir certificaciones
                certificacionesPaths = await uploadCertificaciones();

                // Subir productos
                productosData = await uploadProductos();
            } catch (error) {
                console.error('Error al subir archivos:', error);

                if (error.response && error.response.data && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    setToast({
                        show: true,
                        message: 'Error al subir archivos: ' + (error.response?.data?.message || error.message),
                        type: 'error'
                    });
                }

                setLoading(false);
                return;
            }

            // Crear FormData para los datos principales
            const formData = new FormData();

            // Agregar referencias a las imágenes subidas
            if (logoPath) {
                formData.append('logo_path', logoPath);
            }

            if (fotografiasPaths) {
                formData.append('fotografias_paths', JSON.stringify(fotografiasPaths));
            }

            if (certificacionesPaths) {
                formData.append('certificaciones_paths', JSON.stringify(certificacionesPaths));
            }

            if (productosData) {
                formData.append('productos_data', JSON.stringify(productosData));
            }

            // Agregar el resto de datos
            Object.keys(data).forEach(key => {
                if (key !== 'productos') {
                    formData.append(key, data[key] || '');
                }
            });

            // Agregar información de depuración para ubicación
            console.log('Enviando datos de ubicación:', {
                provincia: data.provincia,
                canton: data.canton,
                distrito: data.distrito
            });

            const response = await axios.post(route('company.profile.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                // Mensaje de éxito básico
                let mensaje = '¡Datos guardados exitosamente!';
                let tipo = 'success';

                // Si el formulario no está completo, mostrar un mensaje adicional
                if (response.data.formulario_completo === false) {
                    const camposFaltantesArray = Object.keys(response.data.campos_faltantes);
                    setCamposFaltantes(camposFaltantesArray);

                    /*const numCamposFaltantes = camposFaltantesArray.length;
                    mensaje += ` Sin embargo, aún faltan ${numCamposFaltantes} campos obligatorios por completar para que el formulario se considere enviado completamente.`;
                    tipo = 'warning';*/

                    const numCamposFaltantes = camposFaltantesArray.length;
                    mensaje += ``;
                    tipo = 'success';
                }

                setToast({
                    show: true,
                    message: mensaje,
                    type: tipo
                });

                // Limpiar errores del cliente si la operación fue exitosa
                setErrors({});

                // Mostrar información sobre los datos de ubicación guardados
                console.log('Datos de ubicación guardados:', {
                    provincia: response.data.data.provincia_nombre || response.data.data.provincia,
                    canton: response.data.data.canton_nombre || response.data.data.canton,
                    distrito: response.data.data.distrito_nombre || response.data.data.distrito
                });
            } else {
                // Si hay errores en la respuesta, mostrarlos en los campos correspondientes
                if (response.data.errors) {
                    // Guardar los errores del backend en el estado de errores del cliente
                    setErrors(response.data.errors);
                } else {
                    setToast({
                        show: true,
                        message: 'Error al guardar los datos',
                        type: 'error'
                    });
                }
            }
            setLoading(false);

            //Redirigir al home sin navigate
            window.location.href = route('dashboard');
        } catch (error) {
            console.error('Error en la petición:', error);

            // Capturar errores de validación del backend
            if (error.response && error.response.status === 422 && error.response.data.errors) {
                // Establecer los errores en el estado para que se muestren en los campos
                setErrors(error.response.data.errors);
            } else {
                // Para otros tipos de errores, mostrar un mensaje general
                setToast({
                    show: true,
                    message: 'Error al guardar los datos. Por favor, intente nuevamente.',
                    type: 'error'
                });
            }
            setLoading(false);
        }
    };

    const agregarContacto = () => {
        setData('contactos', [...data.contactos, {
            nombre_completo: '',
            puesto: '',
            telefono: '',
            correo: '',
            celular: ''
        }]);
    };

    const agregarProducto = () => {
        setData('productos', [...data.productos, {
            nombre: '',
            descripcion: '',
            imagen: null
        }]);
    };

    // Agregar estados para las opciones de ubicación
    const [ubicaciones, setUbicaciones] = useState({
        provincias: [],
        cantones: [],
        distritos: []
    });

    // Cargar datos de ubicaciones al montar el componente
    useEffect(() => {
        const fetchLugares = async () => {
            try {
                const response = await axios.get(route('api.lugares'));
                const lugares = response.data[0]; // Tomamos el primer elemento que contiene Costa Rica
                setUbicaciones(prev => ({
                    ...prev,
                    provincias: lugares.provincias
                }));

                console.log('Datos de ubicación cargados:', {
                    provincias: lugares.provincias.length,
                    provinciaSeleccionada: data.provincia,
                    cantonSeleccionado: data.canton,
                    distritoSeleccionado: data.distrito
                });
            } catch (error) {
                console.error('Error al cargar lugares:', error);
            }
        };

        fetchLugares();
    }, []);

    // Actualizar cantones cuando cambia la provincia
    useEffect(() => {
        if (data.provincia) {
            const provinciaSeleccionada = ubicaciones.provincias.find(p => p.id === data.provincia);

            if (provinciaSeleccionada) {
                console.log('Provincia seleccionada:', {
                    id: provinciaSeleccionada.id,
                    name: provinciaSeleccionada.name,
                    cantones: provinciaSeleccionada.cantones?.length || 0
                });

                setUbicaciones(prev => ({
                    ...prev,
                    cantones: provinciaSeleccionada.cantones || [],
                    // No resetear distritos si ya hay un cantón seleccionado que coincide con los nuevos cantones
                    distritos: data.canton && provinciaSeleccionada.cantones.some(c => c.id === data.canton)
                        ? prev.distritos
                        : []
                }));

                // Solo resetear cantón si no existe en la nueva lista de cantones
                if (data.canton && !provinciaSeleccionada.cantones.some(c => c.id === data.canton)) {
                    console.log('Reseteando cantón porque no existe en la nueva lista de cantones');
                    setData('canton', '');
                    setData('distrito', '');
                }
            }
        }
    }, [data.provincia, ubicaciones.provincias]);

    // Actualizar distritos cuando cambia el cantón
    useEffect(() => {
        if (data.canton && data.provincia) {
            const provinciaSeleccionada = ubicaciones.provincias.find(p => p.id === data.provincia);
            const cantonSeleccionado = provinciaSeleccionada?.cantones.find(c => c.id === data.canton);

            if (cantonSeleccionado) {
                console.log('Cantón seleccionado:', {
                    id: cantonSeleccionado.id,
                    name: cantonSeleccionado.name,
                    distritos: cantonSeleccionado.distritos?.length || 0
                });

                setUbicaciones(prev => ({
                    ...prev,
                    distritos: cantonSeleccionado.distritos || []
                }));

                // Solo resetear distrito si no existe en la nueva lista de distritos
                if (data.distrito && !cantonSeleccionado.distritos.some(d => d.id === data.distrito)) {
                    console.log('Reseteando distrito porque no existe en la nueva lista de distritos');
                    setData('distrito', '');
                }
            }
        }
    }, [data.canton, data.provincia, ubicaciones.provincias]);

    // Efecto para cargar los cantones y distritos iniciales si ya hay valores seleccionados
    useEffect(() => {
        const initializeLocationData = async () => {
            // Solo ejecutar si tenemos provincia y no tenemos cantones cargados
            if (data.provincia && ubicaciones.provincias.length > 0 && ubicaciones.cantones.length === 0) {
                console.log('Inicializando datos de ubicación con valores existentes:', {
                    provincia: data.provincia,
                    canton: data.canton,
                    distrito: data.distrito
                });

                const provinciaSeleccionada = ubicaciones.provincias.find(p => p.id === data.provincia);

                if (provinciaSeleccionada) {
                    // Cargar cantones
                    setUbicaciones(prev => ({
                        ...prev,
                        cantones: provinciaSeleccionada.cantones || []
                    }));

                    // Si también hay cantón seleccionado, cargar distritos
                    if (data.canton) {
                        const cantonSeleccionado = provinciaSeleccionada.cantones.find(c => c.id === data.canton);

                        if (cantonSeleccionado) {
                            setUbicaciones(prev => ({
                                ...prev,
                                distritos: cantonSeleccionado.distritos || []
                            }));
                        }
                    }
                }
            }
        };

        initializeLocationData();
    }, [data.provincia, data.canton, ubicaciones.provincias]);

    const handleFileDownload = async (path) => {
        try {
            window.open(route('company.profile.download-file', { path }), '_blank');
        } catch (error) {
            console.error('Error al descargar archivo:', error);
        }
    };

    const handleFileDelete = async (path, type) => {
        try {
            const response = await axios.post(route('company.profile.delete-file'), {
                path,
                type
            });

            if (response.data.success) {
                // Actualizar el estado según el tipo de archivo eliminado
                switch (type) {
                    case 'logo':
                        setImagenes(prev => ({ ...prev, logo: null }));
                        break;
                    case 'fotografias':
                        setImagenes(prev => ({
                            ...prev,
                            fotografias: prev.fotografias.filter(f => f.path !== path)
                        }));
                        break;
                    case 'certificaciones':
                        setImagenes(prev => ({
                            ...prev,
                            certificaciones: prev.certificaciones.filter(c => c.path !== path)
                        }));
                        break;
                }
            }
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
        }
    };

    // Agregar estados para el modal de confirmación de eliminación
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);

    // Modificar la función para manejar el inicio del proceso de eliminación
    const handleDeleteProducto = (producto, index) => {
        if (producto.id) {
            // Si el producto ya existe en la base de datos, mostrar modal de confirmación
            setProductoToDelete({ producto, index });
            setDeleteModalOpen(true);
        } else {
            // Si el producto es nuevo y no está guardado, eliminarlo directamente
            eliminarProductoNuevo(index);
        }
    };

    // Función para eliminar productos nuevos (no guardados en la base de datos)
    const eliminarProductoNuevo = (index) => {
        setData('productos', data.productos.filter((_, i) => i !== index));
        setToast({
            show: true,
            message: 'Producto eliminado correctamente',
            type: 'success'
        });
    };

    // Función para confirmar la eliminación de un producto existente
    const confirmarEliminarProducto = async () => {
        if (!productoToDelete) return;

        try {
            const response = await axios.delete(route('company.product.destroy', { productId: productoToDelete.producto.id }));

            if (response.data.success) {
                setData('productos', data.productos.filter(p => p.id !== productoToDelete.producto.id));
                setToast({
                    show: true,
                    message: 'Producto eliminado correctamente',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            setToast({
                show: true,
                message: 'Error al eliminar el producto',
                type: 'error'
            });
        } finally {
            // Cerrar el modal y limpiar el estado
            setDeleteModalOpen(false);
            setProductoToDelete(null);
        }
    };

    // Reemplazar la función eliminarProducto existente
    const eliminarProducto = async (productId) => {
        // Esta función ya no se usa directamente, se mantiene por compatibilidad
        console.warn('La función eliminarProducto está obsoleta. Use handleDeleteProducto en su lugar.');
    };

    // Función para validar campos
    const validarCampo = (valor, tipo = 'texto') => {
        // Eliminar espacios al inicio para todos los campos
        const valorSinEspaciosInicio = valor.trimStart();

        // Expresiones regulares para diferentes tipos de campos
        const regexComunes = /["'\\;]/g; // Comillas simples, dobles, punto-coma y barras invertidas (prohibidos en todos los campos)

        // Expresiones regulares mejoradas para permitir todos los caracteres acentuados
        // Incluye todas las vocales con acentos (á, é, í, ó, ú, à, è, ì, ò, ù, â, ê, î, ô, û, ä, ë, ï, ö, ü) y otros caracteres especiales
        const regexSoloLetras = /[^a-zA-ZáàâäéèêëíìîïóòôöúùûüÁÀÂÄÉÈÊËÍÌÎÏÓÒÔÖÚÙÛÜñÑçÇ\s]/g; // Solo letras y espacios
        const regexLetrasNumerosPunto = /[^a-zA-ZáàâäéèêëíìîïóòôöúùûüÁÀÂÄÉÈÊËÍÌÎÏÓÒÔÖÚÙÛÜñÑçÇ0-9\s.,]/g; // Letras, números, punto y coma
        const regexLetrasNumerosPuntoDoble = /[^a-zA-ZáàâäéèêëíìîïóòôöúùûüÁÀÂÄÉÈÊËÍÌÎÏÓÒÔÖÚÙÛÜñÑçÇ0-9\s.:,]/g; // Letras, números, punto, doble punto y coma
        const regexSoloNumeros = /[^0-9]/g; // Solo números
        const regexURL = /["'\\;]/g; // Caracteres prohibidos en URLs

        // Aplicar validación según el tipo de campo
        switch (tipo) {
            case 'nombre_comercial':
            case 'nombre_legal':
                return valorSinEspaciosInicio.replace(regexComunes, '').replace(regexLetrasNumerosPunto, '');

            case 'descripcion':
                return valorSinEspaciosInicio.replace(regexComunes, '').replace(regexLetrasNumerosPuntoDoble, '');

            case 'url':
                return valorSinEspaciosInicio.replace(regexURL, '');

            case 'solo_letras':
                return valorSinEspaciosInicio.replace(regexComunes, '').replace(regexSoloLetras, '');

            case 'solo_numeros':
                return valorSinEspaciosInicio.replace(regexSoloNumeros, '');

            case 'numeros_sin_e':
                // Primero eliminamos todos los caracteres que no son números
                let resultado = valorSinEspaciosInicio.replace(regexSoloNumeros, '');
                // Luego eliminamos específicamente la letra 'e' (que podría ser ingresada en campos numéricos)
                resultado = resultado.replace(/e/gi, '');
                return resultado;

            case 'email':
                return valorSinEspaciosInicio.replace(regexComunes, '');

            case 'texto_con_puntos':
                return valorSinEspaciosInicio.replace(regexComunes, '').replace(regexLetrasNumerosPuntoDoble, '');

            default: // 'texto' - validación básica
                return valorSinEspaciosInicio.replace(regexComunes, '');
        }
    };

    // Función para manejar cambios en campos de texto
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si es un campo de radio button, manejar de forma especial
        if (e.target.type === 'radio') {
            const newValue = value === 'true' ? true : value === 'false' ? false : value;
            setData(name, newValue);
            return;
        }

        // Si es el campo de países, usar la función específica
        if (name === 'paises_exportacion' && e.target.multiple) {
            handlePaisesChange(e);
            return;
        }

        // Verificar si es un campo de productos (nombre o descripción)
        if (name.includes('productos[')) {
            // Extraer el índice y el campo del nombre
            const matches = name.match(/productos\[(\d+)\]\.(\w+)/);
            if (matches && matches.length === 3) {
                const index = parseInt(matches[1]);
                const field = matches[2];

                // Determinar el tipo de validación según el campo
                let tipoValidacion = 'texto';
                if (field === 'nombre') {
                    tipoValidacion = 'solo_letras';
                } else if (field === 'descripcion') {
                    tipoValidacion = 'descripcion';
                }

                // Validar el valor según el tipo de campo
                const valorValidado = validarCampo(value, tipoValidacion);

                // Verificar si se filtraron caracteres no permitidos
                if (valorValidado !== value.trimStart()) {
                    // Establecer un error para este campo
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        [`productos.${index}.${field}`]: 'Se han eliminado caracteres no permitidos.'
                    }));
                } else {
                    // Limpiar el error si el valor es válido
                    setErrors(prevErrors => {
                        const newErrors = { ...prevErrors };
                        delete newErrors[`productos.${index}.${field}`];
                        return newErrors;
                    });
                }

                // Crear una copia del array de productos
                const nuevosProductos = [...data.productos];

                // Actualizar el campo específico del producto
                if (nuevosProductos[index]) {
                    nuevosProductos[index] = {
                        ...nuevosProductos[index],
                        [field]: valorValidado
                    };

                    // Actualizar el estado con los productos modificados
                    setData('productos', nuevosProductos);
                }
                return;
            }
        }

        // Determinar el tipo de validación según el campo
        let tipoValidacion;
        switch (name) {
            // Campos que solo permiten letras, números y punto
            case 'nombre_comercial':
            case 'nombre_legal':
                tipoValidacion = 'nombre_comercial';
                break;

            // Campos que solo permiten letras, números, punto y doble punto
            case 'descripcion_es':
            case 'descripcion_en':
            case 'razon_licenciamiento_es':
            case 'razon_licenciamiento_en':
            case 'proceso_licenciamiento':
            case 'observaciones':
            case 'planes_expansion':
            case 'direccion_empresa':
                tipoValidacion = 'descripcion';
                break;

            // Campos que solo permiten letras
            case 'sector':
            case 'actividad_comercial':
            case 'producto_servicio':
            case 'mercadeo_nombre':
            case 'mercadeo_puesto':
            case 'micrositio_nombre':
            case 'micrositio_puesto':
            case 'vocero_nombre':
            case 'vocero_puesto':
            case 'representante_nombre':
            case 'representante_puesto':
            case 'asignado_proceso_nombre':
            case 'asignado_proceso_puesto':
            case 'contacto_notificacion_nombre':
            case 'contacto_notificacion_puesto':
                tipoValidacion = 'solo_letras';
                break;

            // Campos que solo permiten números sin la letra e
            case 'anio_fundacion':
            case 'cantidad_hombres':
            case 'cantidad_mujeres':
            case 'cantidad_otros':
                tipoValidacion = 'numeros_sin_e';
                break;

            // Campos que solo permiten números
            case 'telefono_1':
            case 'telefono_2':
            case 'mercadeo_telefono':
            case 'mercadeo_celular':
            case 'micrositio_telefono':
            case 'micrositio_celular':
            case 'vocero_telefono':
            case 'vocero_celular':
            case 'representante_telefono':
            case 'representante_celular':
            case 'asignado_proceso_telefono':
            case 'asignado_proceso_celular':
            case 'contacto_notificacion_telefono':
            case 'contacto_notificacion_celular':
                tipoValidacion = 'solo_numeros';
                break;

            // Campos de email
            case 'mercadeo_email':
            case 'micrositio_email':
            case 'vocero_email':
            case 'representante_email':
                tipoValidacion = 'email';
                break;

            // Campos de URL
            case 'sitio_web':
            case 'facebook':
            case 'linkedin':
            case 'instagram':
            case 'otra_red_social':
                // Estos se manejan con handleURLChange, pero por si acaso
                tipoValidacion = 'url';
                break;

            default:
                tipoValidacion = 'texto';
        }

        // Validar el valor según el tipo de campo
        const valorValidado = validarCampo(value, tipoValidacion);

        // Verificar si se filtraron caracteres no permitidos
        if (valorValidado !== value.trimStart()) {
            // Establecer un error para este campo
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: 'Se han eliminado caracteres no permitidos.'
            }));

            // Limpiar el error después de 3 segundos
            setTimeout(() => {
                setErrors(prevErrors => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[name];
                    return newErrors;
                });
            }, 3000);
        }

        // Actualizar el estado con el valor validado
        setData(name, valorValidado);
    };

    // Función para manejar cambios en campos de URL
    const handleURLChange = (e) => {
        const { name, value } = e.target;

        // Eliminar espacios al inicio y caracteres no permitidos
        let valorLimpio = value.trimStart().replace(/["'\\;]/g, '');

        // Verificar si la URL tiene el protocolo, si no, agregar https://
        if (valorLimpio && !valorLimpio.match(/^https?:\/\//i)) {
            // Solo agregar el protocolo si el usuario ha escrito algo más que solo www.
            if (valorLimpio.length > 4) {
                valorLimpio = 'https://' + valorLimpio;
            }
        }

        // Verificar si se filtraron caracteres no permitidos o se modificó el valor
        if (valorLimpio !== value) {
            // Establecer un error para este campo
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: 'Se ha modificado el formato de la URL para cumplir con los estándares.'
            }));

            // Limpiar el error después de 3 segundos
            setTimeout(() => {
                setErrors(prevErrors => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[name];
                    return newErrors;
                });
            }, 3000);
        }

        // Actualizar el estado con el valor limpio y formateado
        setData(name, valorLimpio);
    };

    // Función específica para manejar el año de fundación
    const handleAnioFundacionChange = (e) => {
        const { name, value } = e.target;

        // Eliminar espacios al inicio
        const valorSinEspacios = value.trimStart();

        // Permitir campo vacío
        if (valorSinEspacios === '') {
            setData(name, valorSinEspacios);
            // Limpiar el error si existe
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
            return;
        }

        // Usar la función validarCampo con el tipo 'numeros_sin_e'
        const valorNumerico = validarCampo(valorSinEspacios, 'numeros_sin_e');

        // Si se filtraron caracteres, mostrar un error
        if (valorNumerico !== valorSinEspacios) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: 'Por favor ingrese solo números.'
            }));

            // Limpiar el error después de 3 segundos
            setTimeout(() => {
                setErrors(prevErrors => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[name];
                    return newErrors;
                });
            }, 3000);
        }

        setData(name, valorNumerico);
    };

    const [paises, setPaises] = useState([]);

    // Cargar la lista de países al montar el componente
    useEffect(() => {
        const fetchPaises = async () => {
            try {
                const response = await fetch('/storage/paises.json');
                const data = await response.json();
                setPaises(data.countries);
            } catch (error) {
                console.error('Error al cargar la lista de países:', error);
            }
        };

        fetchPaises();
    }, []);

    // Función para manejar la selección múltiple de países
    const handlePaisesChange = (e) => {
        const options = e.target.options;
        const selectedValues = [];

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }

        setData('paises_exportacion', selectedValues.join(','));
    };

    // Función para renderizar las opciones de países
    const renderPaisesOptions = () => {
        return paises.map(pais => (
            <option key={pais.name} value={pais.es_name}>
                {pais.es_name}
            </option>
        ));
    };

    // Función para verificar si un campo está en la lista de campos faltantes
    const esCampoFaltante = (nombreCampo) => {
        return camposFaltantes.includes(nombreCampo);
    };

    return (
        <DashboardLayout userName={userName} title="Perfil de Empresa">
            <h1 className="text-4xl font-bold mt-3">Perfil de Empresa</h1>
            <div className="mx-auto py-6">
                <form onSubmit={submit} encType="multipart/form-data" className="space-y-8">
                    {/* Sección de Información de Empresa */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSeccion('informacion')}
                            className="w-full p-6 flex justify-between items-center text-left"
                        >
                            <h2 className="text-xl font-semibold">Información de Empresa</h2>
                            <svg
                                className={`w-6 h-6 transform transition-transform ${seccionesExpandidas.informacion ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {seccionesExpandidas.informacion && (
                            <div className="p-6 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombre comercial */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nombre comercial de la empresa<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nombre_comercial}
                                            onChange={handleChange}
                                            name="nombre_comercial"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                        />
                                        <InputError message={errors.nombre_comercial} />
                                    </div>

                                    {/* Nombre legal */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nombre de la razón social de la empresa<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nombre_legal}
                                            onChange={handleChange}
                                            name="nombre_legal"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                        />
                                        <InputError message={errors.nombre_legal} />
                                    </div>

                                    {/* Descripción Español */}
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Descripción de la empresa (Español)<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.descripcion_es}
                                            onChange={handleChange}
                                            name="descripcion_es"
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                        />
                                        <InputError message={errors.descripcion_es} />
                                    </div>

                                    {/* Descripción Inglés */}
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Descripción de la empresa (Inglés)<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.descripcion_en}
                                            onChange={handleChange}
                                            name="descripcion_en"
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.descripcion_en} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿En que año se fundó su organización?<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.anio_fundacion}
                                            onChange={handleAnioFundacionChange}
                                            name="anio_fundacion"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            maxLength={4}

                                        />
                                        <InputError message={errors.anio_fundacion} />
                                    </div>

                                    {/* Sitio web */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Sitio web <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={data.sitio_web}
                                            onChange={handleURLChange}
                                            name="sitio_web"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                        />
                                        <InputError message={errors.sitio_web} />
                                    </div>

                                    {/* Dirección (Cada item como selects separados): Provincia (Select) - Canton (Select) - Distrito (Select) */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Dirección</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Provincia
                                                </label>
                                                <select
                                                    value={data.provincia}
                                                    onChange={handleChange}
                                                    name="provincia"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                >
                                                    <option value="">Selecciona una provincia</option>
                                                    {ubicaciones.provincias.map(provincia => (
                                                        <option key={provincia.id} value={provincia.id}>
                                                            {provincia.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.provincia} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Cantón
                                                </label>
                                                <select
                                                    value={data.canton}
                                                    onChange={handleChange}
                                                    name="canton"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                    disabled={!data.provincia}
                                                >
                                                    <option value="">Selecciona un cantón</option>
                                                    {ubicaciones.cantones.map(canton => (
                                                        <option key={canton.id} value={canton.id}>
                                                            {canton.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.canton} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Distrito
                                                </label>
                                                <select
                                                    value={data.distrito}
                                                    onChange={handleChange}
                                                    name="distrito"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                    disabled={!data.canton}
                                                >
                                                    <option value="">Selecciona un distrito</option>
                                                    {ubicaciones.distritos.map(distrito => (
                                                        <option key={distrito.id} value={distrito.id}>
                                                            {distrito.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.distrito} />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Dirección Detallada
                                            </label>
                                            <textarea
                                                value={data.direccion_empresa}
                                                onChange={handleChange}
                                                name="direccion_empresa"
                                                rows="3"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                placeholder="Ingrese la dirección detallada (calle, número, referencias, etc.)"
                                                maxLength="150"

                                            ></textarea>
                                            <InputError message={errors.direccion_empresa} />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Incluya detalles como calle, número, edificio, piso, oficina y referencias para ubicar fácilmente su empresa.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Redes Sociales */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociales</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Facebook
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data.facebook}
                                                    onChange={handleURLChange}
                                                    name="facebook"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.facebook} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    LinkedIn
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data.linkedin}
                                                    onChange={handleURLChange}
                                                    name="linkedin"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.linkedin} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Instagram
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data.instagram}
                                                    onChange={handleURLChange}
                                                    name="instagram"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.instagram} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Otra red social
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data.otra_red_social}
                                                    onChange={handleURLChange}
                                                    name="otra_red_social"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.otra_red_social} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sector y Tamaño */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Sector
                                        </label>
                                        <select
                                            value={data.sector}
                                            onChange={handleChange}
                                            name="sector"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Escoger sector</option>
                                            <option value="agricola">Agricola</option>
                                            <option value="alimentos">Alimentos</option>
                                            <option value="industria-especializada">Industria especializada</option>
                                            <option value="servicios">Servicios</option>
                                        </select>
                                        <InputError message={errors.sector} />
                                    </div>

                                    {/* Tamaño de la empresa */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tamaño de la empresa<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.tamano_empresa}
                                            onChange={handleChange}
                                            name="tamano_empresa"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Selecciona un tamaño</option>
                                            <option value="1-10">1-10</option>
                                            <option value="11-50">11-50</option>
                                            <option value="51-200">51-200</option>
                                            <option value="201-500">201-500</option>
                                            <option value="501-1000">501-1000</option>
                                            <option value="1001-5000">1001-5000</option>
                                        </select>
                                    </div>

                                    {/* Cantidad de empleados */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">¿Cuantas personas emplea?</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600">Cantidad de Hombres<span className="text-red-500">*</span></label>
                                                <input
                                                    type="number"
                                                    value={data.cantidad_hombres}
                                                    onChange={handleChange}
                                                    name="cantidad_hombres"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600">Cantidad de mujeres<span className="text-red-500">*</span></label>
                                                <input
                                                    type="number"
                                                    value={data.cantidad_mujeres}
                                                    onChange={handleChange}
                                                    name="cantidad_mujeres"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600">Cantidad de otros<span className="text-red-500">*</span></label>
                                                <input
                                                    type="number"
                                                    value={data.cantidad_otros}
                                                    onChange={handleChange}
                                                    name="cantidad_otros"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cédula jurídica */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cédula jurídica<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.cedula_juridica}
                                            disabled={true}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed"

                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Para cambiar la cédula jurídica, favor comunicarse con
                                            <a href="#" className="text-green-600 hover:text-green-700"> soporte técnico</a>
                                        </p>
                                        <InputError message={errors.cedula_juridica} />
                                    </div>

                                    {/* Actividad comercial */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Actividad comercial<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.actividad_comercial}
                                            onChange={handleChange}
                                            name="actividad_comercial"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                        />
                                        <InputError message={errors.actividad_comercial} />
                                    </div>

                                    {/* Teléfonos */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Teléfono fijo
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.telefono_1}
                                            onChange={handleChange}
                                            name="telefono_1"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.telefono_1} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Teléfono celular
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.telefono_2}
                                            onChange={handleChange}
                                            name="telefono_2"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.telefono_2} />
                                    </div>

                                    {/* Empresa exportadora */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿Es una empresa exportadora?<span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-2 flex gap-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="es_exportadora"
                                                    value="true"
                                                    checked={data.es_exportadora === true}
                                                    onChange={handleChange}
                                                    className="form-radio text-green-600 focus:ring-green-500"
                                                />
                                                <span className="ml-2">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="es_exportadora"
                                                    value="false"
                                                    checked={data.es_exportadora === false}
                                                    onChange={handleChange}
                                                    className="form-radio text-green-600 focus:ring-green-500"
                                                />
                                                <span className="ml-2">No</span>
                                            </label>
                                        </div>
                                        <InputError message={errors.es_exportadora} />
                                    </div>

                                    {/* Países de exportación */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿A qué países?
                                        </label>
                                        <select
                                            value={data.paises_exportacion ? data.paises_exportacion.split(',') : []}
                                            onChange={handlePaisesChange}
                                            name="paises_exportacion"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            multiple
                                            size="5"
                                        >
                                            {renderPaisesOptions()}
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Mantenga presionada la tecla Ctrl (o Cmd en Mac) para seleccionar múltiples países.
                                        </p>
                                        <InputError message={errors.paises_exportacion} />
                                    </div>

                                    {/* Producto o servicio */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mencione el producto o servicio
                                        </label>
                                        <input
                                            type="text"
                                            value={data.producto_servicio}
                                            onChange={handleChange}
                                            name="producto_servicio"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Producto o servicio"
                                        />
                                        <InputError message={errors.producto_servicio} />
                                    </div>

                                    {/* Rango de exportaciones */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿En qué rango se ubica su empresa en exportaciones anuales medidas en dólares?
                                        </label>
                                        <select
                                            value={data.rango_exportaciones}
                                            onChange={handleChange}
                                            name="rango_exportaciones"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Seleccione un rango</option>
                                            <option value="0-10000">$0 - $10,000</option>
                                            <option value="10001-50000">$10,001 - $50,000</option>
                                            <option value="50001-100000">$50,001 - $100,000</option>
                                            <option value="100001-500000">$100,001 - $500,000</option>
                                            <option value="500001+">Más de $500,001</option>
                                        </select>
                                        <InputError message={errors.rango_exportaciones} />
                                    </div>

                                    {/* Planes de expansión */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿Cuáles son los planes de la empresa en los próximos 5 años para la expansión y/o internacionalización?
                                        </label>
                                        <textarea
                                            value={data.planes_expansion}
                                            onChange={handleChange}
                                            name="planes_expansion"
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Respuesta"
                                        />
                                        <InputError message={errors.planes_expansion} />
                                    </div>
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing || loading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            'Guardar Información'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección de Logos y Fotografías */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSeccion('logos')}
                            className="w-full p-6 flex justify-between items-center text-left"
                        >
                            <h2 className="text-xl font-semibold">Logos y fotografías</h2>
                            <svg
                                className={`w-6 h-6 transform transition-transform ${seccionesExpandidas.logos ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {seccionesExpandidas.logos && (
                            <div className="p-6 pt-0">
                                <div className="block lg:flex gap-2">
                                    {/* Fotografías de la empresa */}
                                    <div className="mb-6 w-full lg:w-1/2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fotografías de la empresa (máximo 3)<span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <label
                                                htmlFor="fotografias-input"
                                                className="border border-gray-300 rounded-md p-4 block cursor-pointer"
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => handleDrop(e, 'fotografias')}
                                            >
                                                <div className="text-center text-gray-600">
                                                    Arrastre o <span className="text-green-600">Cargar</span>
                                                    <p className="text-xs mt-1">Máximo 3 fotografías. Solo formatos jpg, jpeg o png.</p>
                                                </div>
                                                <input
                                                    id="fotografias-input"
                                                    type="file"
                                                    className="hidden"
                                                    accept=".png,.jpg,.jpeg"
                                                    multiple
                                                    onChange={(e) => handleImagenChange(e, 'fotografias')}
                                                />
                                            </label>
                                            {/* Archivos cargados */}
                                            <div className="">
                                                {imagenes.fotografias?.map((foto, index) => (
                                                    <div key={index} className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                        <div className="flex items-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setImagenes(prev => ({
                                                                        ...prev,
                                                                        fotografias: prev.fotografias.filter((_, i) => i !== index)
                                                                    }));
                                                                    if (foto.path) {
                                                                        handleFileDelete(foto.path, 'fotografias');
                                                                    }
                                                                }}
                                                                className="mr-2"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                            <span className="text-sm">
                                                                {foto.name || 'Fotografía'}
                                                            </span>
                                                        </div>
                                                        {/* Vista previa de la imagen */}
                                                        {(foto.preview || foto.path) && (
                                                            <div className="w-12 h-12 overflow-hidden rounded-md ml-2">
                                                                <img
                                                                    src={foto.preview || (foto.path ? `/storage/${foto.path}` : '')}
                                                                    alt="Vista previa"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logo de la empresa */}
                                    <div className="mb-6 w-full lg:w-1/2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Logo de la empresa<span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <label
                                                htmlFor="logo-input"
                                                className="border border-gray-300 rounded-md p-4 block cursor-pointer"
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => handleDrop(e, 'logo')}
                                            >
                                                <div className="text-center text-gray-600">
                                                    Arrastre o <span className="text-green-600">Cargar</span>
                                                    <p className="text-xs mt-1">Máximo 1 logo. Solo formatos jpg, jpeg o png.</p>
                                                </div>
                                                <input
                                                    id="logo-input"
                                                    type="file"
                                                    className="hidden"
                                                    accept=".png,.jpg,.jpeg"
                                                    onChange={(e) => handleImagenChange(e, 'logo')}
                                                />
                                            </label>

                                            {/* Vista previa del logo existente */}
                                            {infoAdicional?.logo_url && !imagenes.logo && data.logo_existente !== null && (
                                                <div className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                    <div className="flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage('logo', infoAdicional.logo_path)}
                                                            className="mr-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                        <span className="text-sm">Logo actual</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDownload(infoAdicional.logo_path)}
                                                            className="download-button"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                        </button>
                                                        <img
                                                            src={infoAdicional.logo_url}
                                                            alt="Logo preview"
                                                            className="w-10 h-10 object-cover ml-2 rounded"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Vista previa del nuevo logo */}
                                            {imagenes.logo instanceof File && (
                                                <div className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                    <div className="flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagenes(prev => ({
                                                                    ...prev,
                                                                    logo: null
                                                                }));
                                                            }}
                                                            className="mr-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                        <span className="text-sm">{imagenes.logo?.name}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm mr-2">{imagenes.logo ? Math.round(imagenes.logo.size / 1024) : 0} KB</span>
                                                        <img
                                                            src={imagenes.logo.preview || URL.createObjectURL(imagenes.logo)}
                                                            alt="Logo preview"
                                                            className="w-10 h-10 object-cover ml-2 rounded"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Logos de certificaciones */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Logos de certificaciones<span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <label
                                            htmlFor="certificaciones-input"
                                            className="border border-gray-300 rounded-md p-4 block cursor-pointer"
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, 'certificaciones')}
                                        >
                                            <div className="text-center text-gray-600">
                                                Arrastre o <span className="text-green-600">Cargar</span>
                                                <p className="text-xs mt-1">Máximo 5 certificaciones. Solo formatos jpg, jpeg o png.</p>
                                            </div>
                                            <input
                                                id="certificaciones-input"
                                                type="file"
                                                className="hidden"
                                                accept=".png,.jpg,.jpeg"
                                                multiple
                                                onChange={(e) => handleImagenChange(e, 'certificaciones')}
                                            />
                                        </label>
                                        {/* Archivos cargados */}
                                        <div className="grid xl:grid-cols-2 gap-2">
                                            {imagenes.certificaciones?.map((cert, index) => (
                                                <div key={index} className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                    <div className="flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagenes(prev => ({
                                                                    ...prev,
                                                                    certificaciones: prev.certificaciones.filter((_, i) => i !== index)
                                                                }));
                                                                if (cert.path) {
                                                                    handleFileDelete(cert.path, 'certificaciones');
                                                                }
                                                            }}
                                                            className="mr-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                        <span className="text-sm">{cert.name || (cert instanceof File ? cert.name : 'Certificación')}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm mr-2">
                                                            {cert instanceof File
                                                                ? Math.round(cert.size / 1024)
                                                                : Math.round((cert.size || 0) / 1024)} KB
                                                        </span>
                                                        {cert.url && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleFileDownload(cert.path)}
                                                                className="download-button"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                        {/* Vista previa de la imagen */}
                                                        {(cert.preview || cert.path) && (
                                                            <div className="w-10 h-10 overflow-hidden rounded-md ml-2">
                                                                <img
                                                                    src={cert.preview || (cert.path ? `/storage/${cert.path}` : '')}
                                                                    alt="Vista previa"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing || loading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            'Guardar Imagenes'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección de Licenciamiento */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSeccion('licenciamiento')}
                            className="w-full p-6 flex justify-between items-center text-left"
                        >
                            <h2 className="text-xl font-semibold">Licenciamiento</h2>
                            <svg
                                className={`w-6 h-6 transform transition-transform ${seccionesExpandidas.licenciamiento ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {seccionesExpandidas.licenciamiento && (
                            <div className="p-6 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Razón licenciamiento español */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿Por qué razón decidieron licenciarse Marca País (Español)?<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.razon_licenciamiento_es}
                                            onChange={handleChange}
                                            name="razon_licenciamiento_es"
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Respuesta"

                                        />
                                    </div>

                                    {/* Razón licenciamiento inglés */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿Por qué razón decidieron licenciarse Marca País (Inglés)?<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.razon_licenciamiento_en}
                                            onChange={handleChange}
                                            name="razon_licenciamiento_en"
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Answer"

                                        />
                                    </div>

                                    {/* Proceso de licenciamiento */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿Cómo fue el proceso para obtener el licenciamiento?<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.proceso_licenciamiento}
                                            onChange={handleChange}
                                            name="proceso_licenciamiento"
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Respuesta"

                                        />
                                    </div>

                                    {/* Recomendación y Observaciones */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                ¿Recomendaría a otras empresas obtener la Marca País?<span className="text-red-500">*</span>
                                            </label>
                                            <div className="mt-2 flex gap-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="recomienda_marca_pais"
                                                        value="true"
                                                        checked={data.recomienda_marca_pais === true}
                                                        onChange={handleChange}
                                                        className="form-radio text-green-600 focus:ring-green-500"
                                                    />
                                                    <span className="ml-2">Sí</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="recomienda_marca_pais"
                                                        value="false"
                                                        checked={data.recomienda_marca_pais === false}
                                                        onChange={handleChange}
                                                        className="form-radio text-green-600 focus:ring-green-500"
                                                    />
                                                    <span className="ml-2">No</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Observaciones<span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={data.observaciones}
                                                onChange={handleChange}
                                                name="observaciones"
                                                rows={4}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                placeholder="Respuesta"

                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing || loading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            'Guardar datos'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección de Contactos */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSeccion('contactos')}
                            className="w-full p-6 flex justify-between items-center text-left"
                        >
                            <h2 className="text-xl font-semibold">Contactos</h2>
                            <svg
                                className={`w-6 h-6 transform transition-transform ${seccionesExpandidas.contactos ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {seccionesExpandidas.contactos && (
                            <div className="p-6 pt-0 space-y-8">
                                {/* Contacto para recibir notificaciones de la Marca País */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto para recibir notificaciones de la Marca País <span className="text-red-500">*</span></h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre Completo <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.contacto_notificacion_nombre}
                                                onChange={handleChange}
                                                name="contacto_notificacion_nombre"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.contacto_notificacion_nombre} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico <span className="text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                value={data.contacto_notificacion_email}
                                                onChange={handleChange}
                                                name="contacto_notificacion_email"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.contacto_notificacion_email} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.contacto_notificacion_puesto}
                                                onChange={handleChange}
                                                name="contacto_notificacion_puesto"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.contacto_notificacion_puesto} />
                                        </div>
                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700">Cédula <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.contacto_notificacion_cedula}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const valorSinEspacios = value.replace(/\s/g, '');
                                                    const valorNumerico = validarCampo(valorSinEspacios, 'solo_numeros');
                                                    setData('contacto_notificacion_cedula', valorNumerico);
                                                }}
                                                name="contacto_notificacion_cedula"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                
                                            />
                                            <InputError message={errors.contacto_notificacion_cedula} />
                                        </div> */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Teléfono <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={data.contacto_notificacion_telefono}
                                                    onChange={handleChange}
                                                    name="contacto_notificacion_telefono"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${esCampoFaltante('contacto_notificacion_telefono') ? 'border-red-500 bg-red-50' : ''}`}
                                                />
                                                {esCampoFaltante('contacto_notificacion_telefono') && (
                                                    <p className="mt-1 text-sm text-red-500">Este campo es obligatorio para completar el formulario</p>
                                                )}
                                                <InputError message={errors.contacto_notificacion_telefono} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={data.contacto_notificacion_celular}
                                                    onChange={handleChange}
                                                    name="contacto_notificacion_celular"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${esCampoFaltante('contacto_notificacion_celular') ? 'border-red-500 bg-red-50' : ''}`}
                                                />
                                                {esCampoFaltante('contacto_notificacion_celular') && (
                                                    <p className="mt-1 text-sm text-red-500">Este campo es obligatorio para completar el formulario</p>
                                                )}
                                                <InputError message={errors.contacto_notificacion_celular} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contacto asignado para llevar el proceso del licenciamiento */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto asignado para llevar el proceso del licenciamiento <span className="text-red-500">*</span></h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre Completo <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.asignado_proceso_nombre}
                                                onChange={handleChange}
                                                name="asignado_proceso_nombre"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.asignado_proceso_nombre} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico <span className="text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                value={data.asignado_proceso_email}
                                                onChange={handleChange}
                                                name="asignado_proceso_email"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.asignado_proceso_email} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.asignado_proceso_puesto}
                                                onChange={handleChange}
                                                name="asignado_proceso_puesto"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.asignado_proceso_puesto} />
                                        </div>
                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700">Cédula <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.asignado_proceso_cedula}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const valorSinEspacios = value.replace(/\s/g, '');
                                                    const valorNumerico = validarCampo(valorSinEspacios, 'solo_numeros');
                                                    setData('asignado_proceso_cedula', valorNumerico);
                                                }}
                                                name="asignado_proceso_cedula"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                
                                            />
                                            <InputError message={errors.asignado_proceso_cedula} />
                                        </div> */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Teléfono <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={data.asignado_proceso_telefono}
                                                    onChange={handleChange}
                                                    name="asignado_proceso_telefono"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                                />
                                                <InputError message={errors.asignado_proceso_telefono} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={data.asignado_proceso_celular}
                                                    onChange={handleChange}
                                                    name="asignado_proceso_celular"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                                />
                                                <InputError message={errors.asignado_proceso_celular} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Representante Legal */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto del Representante Legal de su organización o Gerente General <span className="text-red-500">*</span></h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre Completo <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.representante_nombre}
                                                onChange={handleChange}
                                                name="representante_nombre"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.representante_nombre} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico <span className="text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                value={data.representante_email}
                                                onChange={handleChange}
                                                name="representante_email"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.representante_email} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.representante_puesto}
                                                onChange={handleChange}
                                                name="representante_puesto"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.representante_puesto} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cédula <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.representante_cedula}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const valorSinEspacios = value.replace(/\s/g, '');
                                                    const valorNumerico = validarCampo(valorSinEspacios, 'solo_numeros');
                                                    setData('representante_cedula', valorNumerico);
                                                }}
                                                name="representante_cedula"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.representante_cedula} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Teléfono <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.representante_telefono}
                                                onChange={handleChange}
                                                name="representante_telefono"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.representante_telefono} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Celular <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.representante_celular}
                                                onChange={handleChange}
                                                name="representante_celular"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"

                                            />
                                            <InputError message={errors.representante_celular} />
                                        </div>
                                    </div>
                                </div>

                                {/* Contacto de su área de Mercadeo */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto de su área de Mercadeo</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={data.mercadeo_nombre}
                                                onChange={handleChange}
                                                name="mercadeo_nombre"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <InputError message={errors.mercadeo_nombre} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={data.mercadeo_email}
                                                onChange={handleChange}
                                                name="mercadeo_email"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <InputError message={errors.mercadeo_email} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto</label>
                                            <input
                                                type="text"
                                                value={data.mercadeo_puesto}
                                                onChange={handleChange}
                                                name="mercadeo_puesto"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <InputError message={errors.mercadeo_puesto} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    value={data.mercadeo_telefono}
                                                    onChange={handleChange}
                                                    name="mercadeo_telefono"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.mercadeo_telefono} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular</label>
                                                <input
                                                    type="tel"
                                                    value={data.mercadeo_celular}
                                                    onChange={handleChange}
                                                    name="mercadeo_celular"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.mercadeo_celular} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contacto Micrositio en web esencial */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto Micrositio en web esencial</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={data.micrositio_nombre}
                                                onChange={handleChange}
                                                name="micrositio_nombre"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <InputError message={errors.micrositio_nombre} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={data.micrositio_email}
                                                onChange={handleChange}
                                                name="micrositio_email"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <InputError message={errors.micrositio_email} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto</label>
                                            <input
                                                type="text"
                                                value={data.micrositio_puesto}
                                                onChange={handleChange}
                                                name="micrositio_puesto"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <InputError message={errors.micrositio_puesto} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    value={data.micrositio_telefono}
                                                    onChange={handleChange}
                                                    name="micrositio_telefono"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.micrositio_telefono} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular</label>
                                                <input
                                                    type="tel"
                                                    value={data.micrositio_celular}
                                                    onChange={handleChange}
                                                    name="micrositio_celular"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.micrositio_celular} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contacto del Vocero */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto del Vocero</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={data.vocero_nombre}
                                                onChange={handleChange}
                                                name="vocero_nombre"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <InputError message={errors.vocero_nombre} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={data.vocero_email}
                                                onChange={handleChange}
                                                name="vocero_email"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <InputError message={errors.vocero_email} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto</label>
                                            <input
                                                type="text"
                                                value={data.vocero_puesto}
                                                onChange={handleChange}
                                                name="vocero_puesto"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <InputError message={errors.vocero_puesto} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    value={data.vocero_telefono}
                                                    onChange={handleChange}
                                                    name="vocero_telefono"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.vocero_telefono} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular</label>
                                                <input
                                                    type="tel"
                                                    value={data.vocero_celular}
                                                    onChange={handleChange}
                                                    name="vocero_celular"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.vocero_celular} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing || loading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            'Guardar datos de contacto'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección de Productos */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSeccion('productos')}
                            className="w-full p-6 flex justify-between items-center text-left"
                        >
                            <h2 className="text-xl font-semibold">Licencia de producto</h2>
                            <svg
                                className={`w-6 h-6 transform transition-transform ${seccionesExpandidas.productos ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {seccionesExpandidas.productos && (
                            <div className="p-6 pt-0">
                                {data.productos.map((producto, index) => (
                                    <div key={index} className="mb-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">Producto {index + 1}</h3>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProducto(producto, index)}
                                                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                                title="Eliminar Producto"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                {/* Nombre del producto */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Nombre del producto
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={producto.nombre || ''}
                                                        onChange={handleChange}
                                                        name={`productos[${index}].nombre`}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                        placeholder=""
                                                    />
                                                    <InputError message={errors[`productos.${index}.nombre`]} />
                                                </div>

                                                {/* Descripción */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Descripción
                                                    </label>
                                                    <textarea
                                                        value={producto.descripcion || ''}
                                                        onChange={handleChange}
                                                        name={`productos[${index}].descripcion`}
                                                        rows={6}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                        placeholder="Lorem Ipsum"
                                                    />
                                                    <InputError message={errors[`productos.${index}.descripcion`]} />
                                                </div>
                                            </div>

                                            {/* Fotografía del producto */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Fotografía producto
                                                </label>
                                                <div className="mt-1">
                                                    <label
                                                        htmlFor={`producto-input-${index}`}
                                                        className="border border-gray-300 rounded-md p-4 block cursor-pointer"
                                                        onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave}
                                                        onDrop={(e) => handleDrop(e, 'producto', index)}
                                                    >
                                                        <div className="text-center text-gray-600">
                                                            Arrastre o <span className="text-green-600">Cargar</span>
                                                            <p className="text-xs mt-1">Máximo 1 imagen por producto. Solo formatos jpg, jpeg o png.</p>
                                                        </div>
                                                        <input
                                                            id={`producto-input-${index}`}
                                                            type="file"
                                                            className="hidden"
                                                            accept=".png,.jpg,.jpeg"
                                                            onChange={(e) => handleImagenChange(e, 'producto', index)}
                                                        />
                                                    </label>

                                                    {/* Mostrar imagen existente */}
                                                    {producto.imagen && (
                                                        <div className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                            <div className="flex items-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeExistingImage('producto', producto.imagen, index)}
                                                                    className="mr-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                                <span className="text-sm">Imagen existente</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <img
                                                                    src={`storage/${producto.imagen}`}
                                                                    alt={`Producto ${index + 1}`}
                                                                    className="w-10 h-10 object-cover rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Mostrar nueva imagen si se ha seleccionado */}
                                                    {imagenes.productos[index] && !producto.imagen && (
                                                        <div className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                            <div className="flex items-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImagen('producto', null, index)}
                                                                    className="mr-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                                <span className="text-sm">{imagenes.productos[index].name}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-sm mr-2">{Math.round(imagenes.productos[index].size / 1024)} KB</span>
                                                                <img
                                                                    src={URL.createObjectURL(imagenes.productos[index])}
                                                                    alt={`Producto ${index + 1}`}
                                                                    className="w-10 h-10 object-cover rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Botón para agregar nuevo producto */}
                                <div className="flex mt-6">
                                    <button
                                        type="button"
                                        onClick={agregarProducto}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Agregar Producto
                                    </button>
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing || loading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            'Guardar productos'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>


                </form>
            </div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {
                loading && (
                    <EvaluacionProcessing
                        caso={'form-empresa'}
                    />
                )
            }

            {/* Agregar el modal de confirmación al final del componente */}
            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setProductoToDelete(null);
                }}
                onConfirm={confirmarEliminarProducto}
                title="Eliminar Producto"
                description={`¿Está seguro de que desea eliminar el producto "${productoToDelete?.producto?.nombre || 'seleccionado'}"? Esta acción no se puede deshacer.`}
            />
        </DashboardLayout>
    );
}