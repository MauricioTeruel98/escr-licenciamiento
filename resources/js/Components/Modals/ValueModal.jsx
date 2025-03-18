import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ValueModal({ isOpen, onClose, onSubmit, value = null }) {
    const initialFormData = {
        name: '',
        slug: '',
        minimum_score: 0,
        is_active: true
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (isOpen) {
            if (value) {
                setFormData({
                    name: value.name,
                    slug: value.slug,
                    minimum_score: value.minimum_score,
                    is_active: value.is_active
                });
            } else {
                setFormData(initialFormData);
            }
        }
    }, [isOpen, value]);

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
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            {/* Modal */}
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {value ? 'Editar valor' : 'Crear nuevo valor'}
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

                                {/* Slug */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        required
                                    />
                                </div> */}

                                {/* Puntaje mínimo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Puntaje mínimo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.minimum_score}
                                        onChange={(e) => setFormData({...formData, minimum_score: parseInt(e.target.value)})}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        required
                                        min="0"
                                    />
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
                                    {value ? 'Guardar cambios' : 'Crear valor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 