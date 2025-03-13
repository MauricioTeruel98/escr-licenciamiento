import React from 'react';
import { TrashIcon } from '@heroicons/react/20/solid';
import InputError from '@/Components/InputError';

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
    company
}) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200" data-seccion="productos">
            {/* Cabecera de la sección */}
            <button
                type="button"
                onClick={() => toggleSeccion('productos')}
                className="w-full p-6 flex justify-between items-center text-left"
            >
                <div>
                    <h2 className="text-xl font-semibold">Licencia de producto</h2>
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
                            onClick={() => pasarSiguienteSeccion('productos')}
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
    );
} 