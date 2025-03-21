import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid';
import InputError from '@/Components/InputError';
import axios from 'axios';
import { router } from '@inertiajs/react';
import Toast from '@/Components/ToastAdmin';

/**
 * Componente para gestionar la sección de productos en el formulario de empresa.
 * 
 * Este componente permite:
 * - Visualizar los productos existentes
 * - Añadir nuevos productos
 * - Eliminar productos
 * - Subir imágenes para cada producto
 * - Gestionar la validación de los campos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos del formulario
 * @param {Object} props.errors - Errores de validación
 * @param {Object} props.imagenes - Imágenes seleccionadas
 * @param {Object} props.seccionesExpandidas - Estado de expansión de las secciones
 * @param {boolean} props.processing - Indica si el formulario está procesándose
 * @param {boolean} props.loading - Indica si hay una carga en proceso
 * @param {Function} props.toggleSeccion - Función para expandir/contraer secciones
 * @param {Function} props.handleChange - Manejador de cambios en los campos
 * @param {Function} props.handleDragOver - Manejador para el evento de arrastrar sobre
 * @param {Function} props.handleDragLeave - Manejador para el evento de salir del área de arrastre
 * @param {Function} props.handleDrop - Manejador para el evento de soltar
 * @param {Function} props.handleImagenChange - Manejador para cambios en las imágenes
 * @param {Function} props.removeExistingImage - Función para eliminar imágenes existentes
 * @param {Function} props.removeImagen - Función para eliminar imágenes nuevas
 * @param {Function} props.handleDeleteProducto - Función para eliminar productos
 * @param {Function} props.agregarProducto - Función para agregar nuevos productos
 * @param {Function} props.pasarSiguienteSeccion - Función para pasar a la siguiente sección
 * @param {Object} props.dataAutoEvaluationResult - Datos de la autoevaluación
 * @param {Object} props.autoEvaluationResult - Resultado de la autoevaluación
 * @param {Object} props.company - Datos de la empresa
 * @param {Function} props.setData - Función para actualizar los datos del formulario
 * @param {Function} props.setLoading - Función para actualizar el estado de carga
 * @param {Object} props.infoAdicional - Información adicional del formulario
 * @param {Function} props.submit - Función para ejecutar el submit del formulario principal
 */
export default function ProductosForm({
    data,
    errors,
    imagenes,
    seccionesExpandidas,
    processing,
    loading,
    toggleSeccion,
    handleChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleImagenChange,
    removeExistingImage,
    removeImagen,
    handleDeleteProducto,
    agregarProducto,
    pasarSiguienteSeccion,
    dataAutoEvaluationResult,
    autoEvaluationResult,
    company,
    setData,
    setLoading,
    infoAdicional,
    submit,
}) {
    // Agregar estado para el toast
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Función para verificar si todos los campos requeridos están completos
    const verificarCamposCompletos = () => {
        // Verificar campos básicos requeridos
        const camposRequeridos = {
            nombre_comercial: data.nombre_comercial,
            nombre_legal: data.nombre_legal,
            descripcion_es: data.descripcion_es,
            descripcion_en: data.descripcion_en,
            anio_fundacion: data.anio_fundacion,
            sitio_web: data.sitio_web,
            tamano_empresa: data.tamano_empresa,
            actividad_comercial: data.actividad_comercial,
            razon_licenciamiento_es: data.razon_licenciamiento_es,
            razon_licenciamiento_en: data.razon_licenciamiento_en,
            proceso_licenciamiento: data.proceso_licenciamiento,
            contacto_notificacion_nombre: data.contacto_notificacion_nombre,
            contacto_notificacion_email: data.contacto_notificacion_email,
            contacto_notificacion_puesto: data.contacto_notificacion_puesto,
            contacto_notificacion_telefono: data.contacto_notificacion_telefono,
            contacto_notificacion_celular: data.contacto_notificacion_celular,
            asignado_proceso_nombre: data.asignado_proceso_nombre,
            asignado_proceso_email: data.asignado_proceso_email,
            asignado_proceso_puesto: data.asignado_proceso_puesto,
            asignado_proceso_telefono: data.asignado_proceso_telefono,
            asignado_proceso_celular: data.asignado_proceso_celular,
            representante_nombre: data.representante_nombre,
            representante_email: data.representante_email,
            representante_puesto: data.representante_puesto,
            representante_cedula: data.representante_cedula,
            representante_telefono: data.representante_telefono,
            representante_celular: data.representante_celular,
        };

        // Verificar si todos los campos requeridos tienen valor
        const camposCompletos = Object.values(camposRequeridos).every(valor => valor && valor.trim() !== '');

        // Verificar si hay al menos un producto con nombre y descripción
        const tieneProductoValido = data.productos && data.productos.some(
            producto => producto.nombre?.trim() && producto.descripcion?.trim()
        );

        // Verificar si hay logo y fotografías
        const tieneLogo = data.logo_path || (imagenes.logo && imagenes.logo instanceof File);
        const tieneFotografias = (data.fotografias_paths && JSON.parse(data.fotografias_paths).length > 0) ||
            (imagenes.fotografias && imagenes.fotografias.length > 0);

        return camposCompletos && tieneProductoValido && tieneLogo && tieneFotografias;
    };

    // Función para actualizar form_sended
    const actualizarFormSended = async () => {
        try {
            await axios.post(route('company.profile.update-form-sended'));

            // Actualizar el estado local
            if (autoEvaluationResult) {
                setData(prevData => ({
                    ...prevData,
                    autoEvaluationResult: {
                        ...autoEvaluationResult,
                        form_sended: 1
                    }
                }));
            }
        } catch (error) {
            console.error('Error al actualizar form_sended:', error);
        }
    };

    // Función para subir productos
    const uploadProductos = async () => {
        if (!data.productos || data.productos.length === 0) return null;

        setLoading(true);
        const formData = new FormData();

        // Agregar cada producto al FormData
        data.productos.forEach((producto, index) => {
            formData.append(`productos[${index}][nombre]`, producto.nombre || '');
            formData.append(`productos[${index}][descripcion]`, producto.descripcion || '');

            if (producto.id) {
                formData.append(`productos[${index}][id]`, producto.id);
            }

            // Agregar imagen principal si existe
            if (imagenes.productos && imagenes.productos[index] instanceof File) {
                formData.append(`productos[${index}][imagen]`, imagenes.productos[index]);
            } else if (producto.imagen) {
                // Si hay una imagen existente, enviar su ruta
                formData.append(`productos[${index}][imagen_existente]`, producto.imagen);
            }

            // Agregar imagen adicional 1 si existe
            if (imagenes.productos_2 && imagenes.productos_2[index] instanceof File) {
                formData.append(`productos[${index}][imagen_2]`, imagenes.productos_2[index]);
            } else if (producto.imagen_2) {
                // Si hay una imagen existente, enviar su ruta
                formData.append(`productos[${index}][imagen_2_existente]`, producto.imagen_2);
            }

            // Agregar imagen adicional 2 si existe
            if (imagenes.productos_3 && imagenes.productos_3[index] instanceof File) {
                formData.append(`productos[${index}][imagen_3]`, imagenes.productos_3[index]);
            } else if (producto.imagen_3) {
                // Si hay una imagen existente, enviar su ruta
                formData.append(`productos[${index}][imagen_3_existente]`, producto.imagen_3);
            }
        });

        try {
            const response = await axios.post(route('company.profile.upload-productos'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                // Actualizar el estado con los productos actualizados
                if (response.data.productos) {
                    // Log para depuración

                    // Asegurarnos de que los productos recibidos contengan todas las propiedades necesarias
                    const productosActualizados = response.data.productos.map(producto => ({
                        ...producto,
                        // Asegurarnos de que estos campos existan, aunque sea como null
                        imagen_2: producto.imagen_2 || null,
                        imagen_3: producto.imagen_3 || null,
                        // Si las URLs no vienen del servidor, construirlas aquí si existe la imagen
                        imagen_url: producto.imagen_url || (producto.imagen ? `storage/${producto.imagen}` : null),
                        imagen_2_url: producto.imagen_2_url || (producto.imagen_2 ? `storage/${producto.imagen_2}` : null),
                        imagen_3_url: producto.imagen_3_url || (producto.imagen_3 ? `storage/${producto.imagen_3}` : null)
                    }));

                    setData('productos', productosActualizados);
                }

                // Mostrar mensaje de éxito
                setToast({
                    show: true,
                    message: response.data.message || 'Productos guardados correctamente',
                    type: 'success'
                });

                // Verificar si todos los campos están completos y actualizar form_sended
                if (verificarCamposCompletos()) {
                    await actualizarFormSended();
                }

                // Si hay advertencias, mostrarlas después del mensaje de éxito
                if (response.data.warnings && response.data.warnings.length > 0) {
                    setTimeout(() => {
                        setToast({
                            show: true,
                            message: response.data.warnings.join('\n'),
                            type: 'warning'
                        });
                    }, 3000);
                }

                // Recargar datos necesarios
                router.reload({ only: ['autoEvaluationResult'] });
                router.reload({ only: ['company'] });

                // Pasar a la siguiente sección si es necesario
                pasarSiguienteSeccion('productos');
            }

            return response.data.success ? response.data.productos : null;
        } catch (error) {
            console.error('Error al subir los productos:', error);
            setToast({
                show: true,
                message: error.response?.data?.message || 'Error al guardar los productos',
                type: 'error'
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Manejador para el botón de guardar productos
    const handleGuardarProductos = async (e) => {
        e.preventDefault();
        
        // Primero guardar los productos
        await uploadProductos();
        
        // Luego ejecutar el submit del formulario principal
        await submit(e);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200" data-seccion="productos">
                {/* Cabecera de la sección */}
                <button
                    type="button"
                    onClick={() => toggleSeccion('productos')}
                    className="w-full p-6 flex justify-between items-center text-left"
                >
                    <div>
                        <div className="flex items-center">
                            <h2 className="text-xl font-semibold">Licencia de producto</h2>
                            <p className="text-xs text-gray-600 ml-3"><span className="text-red-500">*</span>(Debe subir al menos un producto para poder continuar)</p>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Si su empresa desea utilizar el sello de esencial COSTA RICA en sus productos, complete la siguiente información</p>
                    </div>
                    <svg
                        className={`w-6 h-6 transform transition-transform ${seccionesExpandidas.productos ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Contenido de la sección (visible solo cuando está expandida) */}
                {seccionesExpandidas.productos && (
                    <div className="p-6 pt-0">
                        {/* Lista de productos */}
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
                                                Nombre del producto<span className="text-red-500">*</span>
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
                                                Descripción<span className="text-red-500">*</span>
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
                                            Fotografía producto<span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            {/* Área para arrastrar y soltar imágenes */}
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
                                                            src={producto.imagen_url ? producto.imagen_url : `storage/${producto.imagen}`}
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

                                        <div className="lg:flex gap-4">
                                            {/* NUEVA SECCIÓN: Fotografía adicional 1 (opcional) */}
                                            <div className="mt-4 w-full lg:w-1/2">
                                                <div className="mt-1">
                                                    <label
                                                        htmlFor={`producto-input-2-${index}`}
                                                        className="border border-gray-300 rounded-md p-4 block cursor-pointer"
                                                        onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave}
                                                        onDrop={(e) => handleDrop(e, 'producto_2', index)}
                                                    >
                                                        <div className="text-center text-gray-600">
                                                            <p className="text-sm mt-1">Imagen opcional. Solo formatos jpg, jpeg o png.</p>
                                                        </div>
                                                        <input
                                                            id={`producto-input-2-${index}`}
                                                            type="file"
                                                            className="hidden"
                                                            accept=".png,.jpg,.jpeg"
                                                            onChange={(e) => handleImagenChange(e, 'producto_2', index)}
                                                        />
                                                    </label>

                                                    {/* Mostrar imagen adicional 1 existente */}
                                                    {producto.imagen_2 && (
                                                        <div className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                            <div className="flex items-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeExistingImage('producto_2', producto.imagen_2, index)}
                                                                    className="mr-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                                <span className="text-sm">Imagen adicional 1</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <img
                                                                    src={producto.imagen_2_url ? producto.imagen_2_url : `storage/${producto.imagen_2}`}
                                                                    alt={`Producto ${index + 1} - Adicional 1`}
                                                                    className="w-10 h-10 object-cover rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Mostrar nueva imagen adicional 1 si se ha seleccionado */}
                                                    {imagenes.productos_2 && imagenes.productos_2[index] && !producto.imagen_2 && (
                                                        <div className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                            <div className="flex items-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImagen('producto_2', null, index)}
                                                                    className="mr-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                                <span className="text-sm">{imagenes.productos_2[index].name}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-sm mr-2">{Math.round(imagenes.productos_2[index].size / 1024)} KB</span>
                                                                <img
                                                                    src={URL.createObjectURL(imagenes.productos_2[index])}
                                                                    alt={`Producto ${index + 1} - Adicional 1`}
                                                                    className="w-10 h-10 object-cover rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* NUEVA SECCIÓN: Fotografía adicional 2 (opcional) */}
                                            <div className="mt-4 w-full lg:w-1/2">
                                                <div className="mt-1">
                                                    <label
                                                        htmlFor={`producto-input-3-${index}`}
                                                        className="border border-gray-300 rounded-md p-4 block cursor-pointer"
                                                        onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave}
                                                        onDrop={(e) => handleDrop(e, 'producto_3', index)}
                                                    >
                                                        <div className="text-center text-gray-600">
                                                            <p className="text-sm mt-1">Imagen opcional. Solo formatos jpg, jpeg o png.</p>
                                                        </div>
                                                        <input
                                                            id={`producto-input-3-${index}`}
                                                            type="file"
                                                            className="hidden"
                                                            accept=".png,.jpg,.jpeg"
                                                            onChange={(e) => handleImagenChange(e, 'producto_3', index)}
                                                        />
                                                    </label>

                                                    {/* Mostrar imagen adicional 2 existente */}
                                                    {producto.imagen_3 && (
                                                        <div className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                            <div className="flex items-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeExistingImage('producto_3', producto.imagen_3, index)}
                                                                    className="mr-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                                <span className="text-sm">Imagen adicional 2</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <img
                                                                    src={producto.imagen_3_url ? producto.imagen_3_url : `storage/${producto.imagen_3}`}
                                                                    alt={`Producto ${index + 1} - Adicional 2`}
                                                                    className="w-10 h-10 object-cover rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Mostrar nueva imagen adicional 2 si se ha seleccionado */}
                                                    {imagenes.productos_3 && imagenes.productos_3[index] && !producto.imagen_3 && (
                                                        <div className="mt-2 bg-gray-500 rounded-md text-white flex justify-between items-center px-3 py-2">
                                                            <div className="flex items-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImagen('producto_3', null, index)}
                                                                    className="mr-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                                <span className="text-sm">{imagenes.productos_3[index].name}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-sm mr-2">{Math.round(imagenes.productos_3[index].size / 1024)} KB</span>
                                                                <img
                                                                    src={URL.createObjectURL(imagenes.productos_3[index])}
                                                                    alt={`Producto ${index + 1} - Adicional 2`}
                                                                    className="w-10 h-10 object-cover rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
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
                                disabled={processing || loading || !infoAdicional}
                                onClick={handleGuardarProductos}
                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white ${!infoAdicional ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800 z-50`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </>
                                ) : !infoAdicional ? (
                                    'Complete la información de la empresa primero'
                                ) : (
                                    'Guardar productos'
                                )}
                            </button>
                            {
                                ((dataAutoEvaluationResult && dataAutoEvaluationResult.form_sended == 1) || (!dataAutoEvaluationResult && autoEvaluationResult && autoEvaluationResult.form_sended == 1)) && company.estado_eval == "auto-evaluacion" && (
                                    <div>

                                    </div>
                                )
                            }
                        </div>
                    </div>
                )}
            </div>

            {/* Agregar el componente Toast */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </>
    );
}