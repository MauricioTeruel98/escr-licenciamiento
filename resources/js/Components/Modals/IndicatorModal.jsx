import { useState, useEffect } from 'react';
import { X, Plus, Trash, Check } from 'lucide-react';
import axios from 'axios';
import Switch from '../Switch';

export default function IndicatorModal({
    isOpen,
    onClose,
    onSubmit,
    indicator = null,
    relatedData = {
        values: [],
        subcategories: [],
        homologations: []
    }
}) {
    const initialFormData = {
        name: '',
        homologation_ids: [],
        binding: false,
        self_evaluation_question: '',
        value_id: '',
        subcategory_id: '',
        evaluation_questions: [''],
        guide: '',
        is_active: true
    };

    const [formData, setFormData] = useState(initialFormData);
    const [availableSubcategories, setAvailableSubcategories] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (indicator) {
                setFormData({
                    name: indicator.name,
                    homologation_ids: indicator.homologations?.map(h => h.id) || [],
                    binding: indicator.binding,
                    self_evaluation_question: indicator.self_evaluation_question || '',
                    value_id: indicator.value_id,
                    subcategory_id: indicator.subcategory_id,
                    evaluation_questions: indicator.evaluation_questions || [''],
                    guide: indicator.guide,
                    is_active: indicator.is_active
                });

                if (indicator.value_id) {
                    loadSubcategories(indicator.value_id);
                }
            } else {
                setFormData(initialFormData);
                setAvailableSubcategories([]);
            }
        }
    }, [isOpen, indicator]);

    const loadSubcategories = async (valueId) => {
        if (!valueId) {
            setAvailableSubcategories([]);
            return;
        }

        try {
            const response = await axios.get(`/api/values/${valueId}/subcategories`);
            setAvailableSubcategories(response.data);
        } catch (error) {
            console.error('Error al cargar subcategorías:', error);
        }
    };

    const handleValueChange = async (valueId) => {
        setFormData(prev => ({
            ...prev,
            value_id: valueId,
            subcategory_id: ''
        }));

        await loadSubcategories(valueId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData(initialFormData);
        onClose();
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            evaluation_questions: [...prev.evaluation_questions, '']
        }));
    };

    const removeQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            evaluation_questions: prev.evaluation_questions.filter((_, i) => i !== index)
        }));
    };

    const updateQuestion = (index, value) => {
        setFormData(prev => ({
            ...prev,
            evaluation_questions: prev.evaluation_questions.map((q, i) =>
                i === index ? value : q
            )
        }));
    };

    const HomologationSelector = () => {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Homologaciones asociadas
                </label>
                <div className="mt-1 border border-gray-300 rounded-lg divide-y">
                    {relatedData.homologations.map((homologation) => (
                        <div
                            key={homologation.id}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                const newIds = formData.homologation_ids.includes(homologation.id)
                                    ? formData.homologation_ids.filter(id => id !== homologation.id)
                                    : [...formData.homologation_ids, homologation.id];

                                setFormData({ ...formData, homologation_ids: newIds });
                            }}
                        >
                            <div className="flex items-center h-5">
                                <div className={`
                                    w-5 h-5 border rounded flex items-center justify-center
                                    ${formData.homologation_ids.includes(homologation.id)
                                        ? 'bg-green-600 border-green-600'
                                        : 'border-gray-300 bg-white'}
                                `}>
                                    {formData.homologation_ids.includes(homologation.id) && (
                                        <Check className="h-3.5 w-3.5 text-white" />
                                    )}
                                </div>
                            </div>
                            <div className="ml-3 flex flex-col">
                                <span className="text-sm font-medium text-gray-700">
                                    {homologation.nombre}
                                </span>
                                {homologation.descripcion && (
                                    <span className="text-xs text-gray-500">
                                        {homologation.descripcion}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {formData.homologation_ids.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                        Debe seleccionar al menos una homologación
                    </p>
                )}
            </div>
        );
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
                                {indicator ? 'Editar indicador' : 'Crear nuevo indicador'}
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
                                        Nombre (E1, E2,...)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                {/* Homologaciones (Múltiples) */}
                                <HomologationSelector />

                                {/* Vinculante */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vinculante
                                    </label>
                                    <Switch
                                        checked={formData.binding}
                                        onChange={(value) => setFormData({ ...formData, binding: value })}
                                        label={formData.binding ? 'Sí' : 'No'}
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Indica si este indicador es vinculante para la evaluación
                                    </p>
                                </div>

                                {/* Valor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valor al que pertenece *
                                    </label>
                                    <select
                                        value={formData.value_id}
                                        onChange={(e) => handleValueChange(e.target.value)}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Seleccione un valor</option>
                                        {relatedData.values.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subcategoría */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sub-categoría *
                                    </label>
                                    <select
                                        value={formData.subcategory_id}
                                        onChange={(e) => setFormData({...formData, subcategory_id: e.target.value})}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        required
                                        disabled={!formData.value_id}
                                    >
                                        <option value="">
                                            {formData.value_id 
                                                ? 'Seleccione una subcategoría'
                                                : 'Primero seleccione un valor'}
                                        </option>
                                        {availableSubcategories.map((subcategory) => (
                                            <option key={subcategory.id} value={subcategory.id}>
                                                {subcategory.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.value_id && availableSubcategories.length === 0 && (
                                        <p className="mt-1 text-sm text-red-500">
                                            No hay subcategorías disponibles para este valor
                                        </p>
                                    )}
                                </div>

                                {/* Pregunta de Auto-evaluación */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pregunta (Auto-evaluación)
                                    </label>
                                    <textarea
                                        value={formData.self_evaluation_question}
                                        onChange={(e) => setFormData({ ...formData, self_evaluation_question: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        rows="2"
                                    />
                                </div>

                                {/* Preguntas de Evaluación */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Preguntas de Evaluación
                                    </label>
                                    {formData.evaluation_questions.map((question, index) => (
                                        <div key={index} className="flex gap-2">
                                            <textarea
                                                value={question}
                                                onChange={(e) => updateQuestion(index, e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                rows="2"
                                                required
                                            />
                                            {formData.evaluation_questions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Nueva Pregunta
                                    </button>
                                </div>

                                {/* Guía */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Guía
                                    </label>
                                    <textarea
                                        value={formData.guide}
                                        onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        rows="3"
                                        required
                                    />
                                </div>

                                {/* Estado */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
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
                                    {indicator ? 'Guardar cambios' : 'Crear indicador'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 