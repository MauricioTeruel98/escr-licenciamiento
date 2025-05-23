import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

export default function RequisitoModal({ isOpen, onClose, onSubmit, requisito = null, values }) {
    const initialFormData = {
        name: '',
        description: '',
        value_id: '',
        subcategory_id: '',
        is_active: true
    };

    const [formData, setFormData] = useState(initialFormData);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (requisito) {
                setFormData({
                    name: requisito.name,
                    description: requisito.description || '',
                    value_id: requisito.value_id,
                    subcategory_id: requisito.subcategory_id || '',
                    is_active: requisito.is_active
                });
            } else {
                setFormData(initialFormData);
            }
        }
    }, [isOpen, requisito]);

    useEffect(() => {
        if (formData.value_id) {
            // Realizar solicitud al backend para obtener subcategorías
            axios.get(`/api/requisitos/subcategories`, {
                params: { value_id: formData.value_id }
            })
            .then(response => {
                setFilteredSubcategories(response.data);
            })
            .catch(error => {
                console.error('Error al cargar subcategorías:', error);
            });
        } else {
            setFilteredSubcategories([]);
        }
    }, [formData.value_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData(initialFormData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {requisito ? 'Editar requisito' : 'Crear nuevo requisito'}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Contenido */}
                        <form onSubmit={handleSubmit}>
                            <div className="px-6 py-4 space-y-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        rows="3"
                                    />
                                </div>

                                {/* Valor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valor <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.value_id}
                                        onChange={(e) => setFormData({...formData, value_id: e.target.value})}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Seleccione un valor</option>
                                        {values.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subcategoría */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subcategoría <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.subcategory_id}
                                        onChange={(e) => setFormData({...formData, subcategory_id: e.target.value})}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Seleccione una subcategoría</option>
                                        {filteredSubcategories.map((subcategory) => (
                                            <option key={subcategory.id} value={subcategory.id}>
                                                {subcategory.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Estado */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">
                                        Activo
                                    </label>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    {requisito ? 'Guardar cambios' : 'Crear requisito'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 