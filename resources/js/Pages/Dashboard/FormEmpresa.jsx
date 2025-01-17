import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import InputError from '@/Components/InputError';
import axios from 'axios';

export default function CompanyProfile({ userName, infoAdicional }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre_comercial: infoAdicional?.nombre_comercial || '',
        nombre_legal: infoAdicional?.nombre_legal || '',
        descripcion_es: infoAdicional?.descripcion_es || '',
        descripcion_en: infoAdicional?.descripcion_en || '',
        sitio_web: infoAdicional?.sitio_web || '',
        facebook: infoAdicional?.facebook || '',
        linkedin: infoAdicional?.linkedin || '',
        instagram: infoAdicional?.instagram || '',
        sector: infoAdicional?.sector || '',
        tamano_empresa: infoAdicional?.tamano_empresa || '',
        cantidad_hombres: infoAdicional?.cantidad_hombres || '',
        cantidad_mujeres: infoAdicional?.cantidad_mujeres || '',
        cantidad_otros: infoAdicional?.cantidad_otros || '',
        telefono_1: infoAdicional?.telefono_1 || '',
        telefono_2: infoAdicional?.telefono_2 || '',
        es_exportadora: infoAdicional?.es_exportadora || false,
        paises_exportacion: infoAdicional?.paises_exportacion || '',
        
        provincia: infoAdicional?.provincia || '',
        canton: infoAdicional?.canton || '',
        distrito: infoAdicional?.distrito || '',
        
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
        representante_telefono: infoAdicional?.representante_telefono || '',
        representante_celular: infoAdicional?.representante_celular || '',
        
        productos: infoAdicional?.productos || [{}, {}, {}],
    });

    // Estado inicial para las imágenes existentes
    const [imagenes, setImagenes] = useState({
        fotografias: [],
        logo: null,
        certificaciones: [],
        productos: [], // Inicializar array vacío para imágenes de productos
        // URLs de imágenes existentes
        existingLogo: infoAdicional?.logo_path ? `/storage/${infoAdicional.logo_path}` : null,
        existingFotografias: infoAdicional?.fotografias_paths?.map(path => `/storage/${path}`) || [],
        existingCertificaciones: infoAdicional?.certificaciones_paths?.map(path => `/storage/${path}`) || [],
        existingProductos: infoAdicional?.productos?.map(producto => 
            producto.imagen_path ? `/storage/${producto.imagen_path}` : null
        ) || []
    });

    // Función para eliminar archivo existente
    const removeExistingImage = async (tipo, path, productoIndex = null) => {
        try {
            const response = await axios.post(route('company.profile.delete-file'), {
                tipo: tipo,
                path: path.replace('/storage/', ''),
                productoIndex: productoIndex
            });

            if (response.data.success) {
                setImagenes(prev => {
                    switch (tipo) {
                        case 'logo':
                            return { ...prev, existingLogo: null };
                        case 'fotografias':
                            return {
                                ...prev,
                                existingFotografias: prev.existingFotografias.filter(p => p !== path)
                            };
                        case 'certificaciones':
                            return {
                                ...prev,
                                existingCertificaciones: prev.existingCertificaciones.filter(p => p !== path)
                            };
                        case 'producto':
                            const newExistingProductos = [...prev.existingProductos];
                            newExistingProductos[productoIndex] = null;
                            return {
                                ...prev,
                                existingProductos: newExistingProductos
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
            [imagenes.existingLogo] : 
            (tipo === 'fotografias' ? imagenes.existingFotografias : imagenes.existingCertificaciones);

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
        
        const files = Array.from(e.dataTransfer.files).filter(
            file => file.type.startsWith('image/')
        );

        if (tipo === 'logo') {
            if (files.length > 0) {
                setImagenes(prev => ({
                    ...prev,
                    logo: files[0]
                }));
            }
        } else {
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
        if (tipo === 'logo') {
            setImagenes(prev => ({ ...prev, logo: files[0] }));
        } else if (tipo === 'producto') {
            setImagenes(prev => {
                const newProductos = [...(prev.productos || [])];
                if (!newProductos[productoIndex]) {
                    newProductos[productoIndex] = [];
                }
                newProductos[productoIndex] = files[0];
                return { ...prev, productos: newProductos };
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        // Agregar todos los campos del formulario al FormData
        Object.keys(data).forEach(key => {
            if (key === 'productos' || key === 'contactos') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });

        // Agregar imágenes
        if (imagenes.logo) {
            formData.append('logo', imagenes.logo);
        }
        imagenes.productos.forEach((producto, index) => {
            if (producto) {
                formData.append(`producto_imagen_${index}`, producto);
            }
        });

        // Indicar que el formulario ha sido enviado
        formData.append('form_sended', true);

        post(route('company.profile.store'), formData);
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

    return (
        <DashboardLayout userName={userName} title="Perfil de Empresa">
            <h1 className="text-4xl font-bold mt-3">Perfil de Empresa</h1>
            <div className="mx-auto py-6">
                <form onSubmit={handleSubmit} className="space-y-8">
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
                                            onChange={e => setData('nombre_comercial', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
                                        />
                                        <InputError message={errors.nombre_comercial} />
                                    </div>

                                    {/* Nombre legal */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nombre legal de la empresa<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nombre_legal}
                                            onChange={e => setData('nombre_legal', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
                                        />
                                        <InputError message={errors.nombre_legal} />
                                    </div>

                                    {/* Descripción Español */}
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Descripción (Español)
                                        </label>
                                        <textarea
                                            value={data.descripcion_es}
                                            onChange={e => setData('descripcion_es', e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.descripcion_es} />
                                    </div>

                                    {/* Descripción Inglés */}
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Descripción (Inglés)
                                        </label>
                                        <textarea
                                            value={data.descripcion_en}
                                            onChange={e => setData('descripcion_en', e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.descripcion_en} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿En que año se fundó su organización?
                                        </label>
                                        <input
                                            type="number"
                                            value={data.anio_fundacion}
                                            onChange={e => setData('anio_fundacion', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.anio_fundacion} />
                                    </div>

                                    {/* Sitio web */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Sitio web
                                        </label>
                                        <input
                                            type="url"
                                            value={data.sitio_web}
                                            onChange={e => setData('sitio_web', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>

                                    {/* Dirección (Cada item como selects separados): Provincia (Select) - Canton (Select) - Distrito (Select) */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Dirección</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Provincia<span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={data.provincia}
                                                    onChange={e => setData('provincia', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                >
                                                    <option value="">Selecciona una provincia</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Cantón<span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={data.canton}
                                                    onChange={e => setData('canton', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                >
                                                    <option value="">Selecciona un cantón</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Distrito<span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={data.distrito}
                                                    onChange={e => setData('distrito', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                >
                                                    <option value="">Selecciona un distrito</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Redes Sociales */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociales</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Facebook
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data.facebook}
                                                    onChange={e => setData('facebook', e.target.value)}
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
                                                    onChange={e => setData('linkedin', e.target.value)}
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
                                                    onChange={e => setData('instagram', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                                <InputError message={errors.instagram} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sector y Tamaño */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Sector<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.sector}
                                            onChange={e => setData('sector', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
                                        />
                                        <InputError message={errors.sector} />
                                    </div>

                                    {/* Tamaño de la empresa */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tamaño de la empresa<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.tamano_empresa}
                                            onChange={e => setData('tamano_empresa', e.target.value)}
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
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Cantidad de personas empleadas</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600">Hombres</label>
                                                <input
                                                    type="number"
                                                    value={data.cantidad_hombres}
                                                    onChange={e => setData('cantidad_hombres', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600">Mujeres</label>
                                                <input
                                                    type="number"
                                                    value={data.cantidad_mujeres}
                                                    onChange={e => setData('cantidad_mujeres', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600">Otros</label>
                                                <input
                                                    type="number"
                                                    value={data.cantidad_otros}
                                                    onChange={e => setData('cantidad_otros', e.target.value)}
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
                                            onChange={e => setData('cedula_juridica', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
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
                                            onChange={e => setData('actividad_comercial', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
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
                                            onChange={e => setData('telefono_1', e.target.value)}
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
                                            onChange={e => setData('telefono_2', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.telefono_2} />
                                    </div>

                                    {/* Empresa exportadora */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿Es una empresa exportadora?
                                        </label>
                                        <div className="mt-2 flex gap-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="es_exportadora"
                                                    value="true"
                                                    checked={data.es_exportadora === true}
                                                    onChange={e => setData('es_exportadora', true)}
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
                                                    onChange={e => setData('es_exportadora', false)}
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
                                            value={data.paises_exportacion}
                                            onChange={e => setData('paises_exportacion', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Seleccione países</option>
                                            {/* Aquí puedes agregar las opciones de países */}
                                        </select>
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
                                            onChange={e => setData('producto_servicio', e.target.value)}
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
                                            onChange={e => setData('rango_exportaciones', e.target.value)}
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
                                            onChange={e => setData('planes_expansion', e.target.value)}
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
                                        disabled={processing}
                                        className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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
                                className={`w-6 h-6 transform transition-transform ${
                                    seccionesExpandidas.contactos ? 'rotate-180' : ''
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
                                {/* Contacto de su área de Mercadeo */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto de su área de Mercadeo</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={data.mercadeo_nombre}
                                                onChange={e => setData('mercadeo_nombre', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={data.mercadeo_email}
                                                onChange={e => setData('mercadeo_email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto</label>
                                            <input
                                                type="text"
                                                value={data.mercadeo_puesto}
                                                onChange={e => setData('mercadeo_puesto', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    value={data.mercadeo_telefono}
                                                    onChange={e => setData('mercadeo_telefono', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular</label>
                                                <input
                                                    type="tel"
                                                    value={data.mercadeo_celular}
                                                    onChange={e => setData('mercadeo_celular', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
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
                                                onChange={e => setData('micrositio_nombre', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={data.micrositio_email}
                                                onChange={e => setData('micrositio_email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto</label>
                                            <input
                                                type="text"
                                                value={data.micrositio_puesto}
                                                onChange={e => setData('micrositio_puesto', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    value={data.micrositio_telefono}
                                                    onChange={e => setData('micrositio_telefono', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular</label>
                                                <input
                                                    type="tel"
                                                    value={data.micrositio_celular}
                                                    onChange={e => setData('micrositio_celular', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
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
                                                onChange={e => setData('vocero_nombre', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={data.vocero_email}
                                                onChange={e => setData('vocero_email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto</label>
                                            <input
                                                type="text"
                                                value={data.vocero_puesto}
                                                onChange={e => setData('vocero_puesto', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    value={data.vocero_telefono}
                                                    onChange={e => setData('vocero_telefono', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular</label>
                                                <input
                                                    type="tel"
                                                    value={data.vocero_celular}
                                                    onChange={e => setData('vocero_celular', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contacto del Representante Legal */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto del Representante Legal de su organización o Gerente General</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={data.representante_nombre}
                                                onChange={e => setData('representante_nombre', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={data.representante_email}
                                                onChange={e => setData('representante_email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Puesto</label>
                                            <input
                                                type="text"
                                                value={data.representante_puesto}
                                                onChange={e => setData('representante_puesto', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    value={data.representante_telefono}
                                                    onChange={e => setData('representante_telefono', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular</label>
                                                <input
                                                    type="tel"
                                                    value={data.representante_celular}
                                                    onChange={e => setData('representante_celular', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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
                            <h2 className="text-xl font-semibold">Productos</h2>
                            <svg
                                className={`w-6 h-6 transform transition-transform ${
                                    seccionesExpandidas.productos ? 'rotate-180' : ''
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
                                {[1, 2, 3].map((num, index) => (
                                    <div key={index} className="mb-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Producto {num}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                {/* Nombre del producto */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Nombre del producto
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.productos[index]?.nombre || ''}
                                                        onChange={e => {
                                                            const newProductos = [...data.productos];
                                                            if (!newProductos[index]) newProductos[index] = {};
                                                            newProductos[index].nombre = e.target.value;
                                                            setData('productos', newProductos);
                                                        }}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                        placeholder=""
                                                    />
                                                </div>

                                                {/* Descripción */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Descripción
                                                    </label>
                                                    <textarea
                                                        value={data.productos[index]?.descripcion || ''}
                                                        onChange={e => {
                                                            const newProductos = [...data.productos];
                                                            if (!newProductos[index]) newProductos[index] = {};
                                                            newProductos[index].descripcion = e.target.value;
                                                            setData('productos', newProductos);
                                                        }}
                                                        rows={6}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                        placeholder="Lorem Ipsum"
                                                    />
                                                </div>
                                            </div>

                                            {/* Fotografía del producto */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Fotografía producto
                                                </label>
                                                <div className="mt-1">
                                                    <div className="border border-gray-300 rounded-md p-4">
                                                        <div className="text-center text-gray-600">
                                                            Arrastre png, jpg o <span className="text-green-600">Cargar</span>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept=".png,.jpg,.jpeg"
                                                                onChange={e => handleImagenChange(e, 'producto', index)}
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Mostrar imagen existente si hay */}
                                                    {imagenes.existingProductos[index] && (
                                                        <div className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                            <div className="flex items-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeExistingImage('producto', imagenes.existingProductos[index], index)}
                                                                    className="mr-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                                <span className="text-sm">Imagen existente</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <a 
                                                                    href={imagenes.existingProductos[index]} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="text-white hover:text-gray-200"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Mostrar nueva imagen si se ha seleccionado */}
                                                    {imagenes.productos[index] && (
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
                                                            <span className="text-sm">{Math.round(imagenes.productos[index].size / 1024)} KB</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Botón de guardar */}
                                <div className="flex mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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
                                className={`w-6 h-6 transform transition-transform ${
                                    seccionesExpandidas.logos ? 'rotate-180' : ''
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
                                {/* Fotografías de la empresa */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Fotografías de la empresa (máximo 3)<span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <label className="border border-gray-300 rounded-md p-4 block cursor-pointer">
                                            <div className="text-center text-gray-600">
                                                Arrastre png, jpg o <span className="text-green-600 cursor-pointer">Cargar</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".png,.jpg,.jpeg"
                                                    multiple
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || []);
                                                        if (files.length + (imagenes.fotografias?.length || 0) > 3) {
                                                            alert('Solo se permiten máximo 3 fotografías');
                                                            return;
                                                        }
                                                        setImagenes(prev => ({
                                                            ...prev,
                                                            fotografias: [...(prev.fotografias || []), ...files]
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </label>
                                        {/* Archivos cargados */}
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
                                                        }}
                                                        className="mr-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                    <span className="text-sm">{foto.name}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-sm mr-2">{Math.round(foto.size / 1024)} KB</span>
                                                    <button type="button" className="download-button">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Logo de la empresa */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Logo de la empresa<span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <label className="border border-gray-300 rounded-md p-4 block cursor-pointer">
                                            <div className="text-center text-gray-600">
                                                Arrastre png, jpg o <span className="text-green-600">Cargar</span>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".png,.jpg,.jpeg"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setImagenes(prev => ({
                                                            ...prev,
                                                            logo: file
                                                        }));
                                                    }
                                                }}
                                            />
                                        </label>
                                        {/* Archivo cargado */}
                                        {imagenes.logo && (
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
                                                    <span className="text-sm">{imagenes.logo.name}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-sm mr-2">{Math.round(imagenes.logo.size / 1024)} KB</span>
                                                    <button type="button" className="download-button">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Logos de certificaciones */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Logos de certificaciones
                                    </label>
                                    <div className="mt-2">
                                        <div className="border border-gray-300 rounded-md p-4">
                                            <div className="text-center text-gray-600">
                                                Arrastre png, jpg o <span className="text-green-600 cursor-pointer">Cargar</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleImagenChange(e, 'certificaciones')}
                                                />
                                            </div>
                                        </div>
                                        {/* Archivos cargados */}
                                        {imagenes.certificaciones?.map((cert, index) => (
                                            <div key={index} className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                <div className="flex items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImagen('certificaciones', index)}
                                                        className="mr-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                    <span className="text-sm">{cert.name}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-sm mr-2">{Math.round(cert.size / 1024)} KB</span>
                                                    <button type="button" className="download-button">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex justify mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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
                                className={`w-6 h-6 transform transition-transform ${
                                    seccionesExpandidas.licenciamiento ? 'rotate-180' : ''
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
                                            onChange={e => setData('razon_licenciamiento_es', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Respuesta"
                                            required
                                        />
                                    </div>

                                    {/* Razón licenciamiento inglés */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿Por qué razón decidieron licenciarse Marca País (Inglés)?<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.razon_licenciamiento_en}
                                            onChange={e => setData('razon_licenciamiento_en', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Answer"
                                            required
                                        />
                                    </div>

                                    {/* Proceso de licenciamiento */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ¿Cómo fue el proceso para obtener el licenciamiento?<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.proceso_licenciamiento}
                                            onChange={e => setData('proceso_licenciamiento', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Respuesta"
                                            required
                                        />
                                    </div>

                                    {/* Recomendación y Observaciones */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                ¿Recomendaría a otras empresas obtener la Marca País?
                                            </label>
                                            <div className="mt-2 flex gap-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="recomienda_marca_pais"
                                                        value="1"
                                                        checked={data.recomienda_marca_pais === true}
                                                        onChange={e => setData('recomienda_marca_pais', true)}
                                                        className="form-radio text-green-600 focus:ring-green-500"
                                                    />
                                                    <span className="ml-2">Sí</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="recomienda_marca_pais"
                                                        value="0"
                                                        checked={data.recomienda_marca_pais === false}
                                                        onChange={e => setData('recomienda_marca_pais', false)}
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
                                                onChange={e => setData('observaciones', e.target.value)}
                                                rows={4}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                placeholder="Respuesta"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
