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
        evaluation_questions: [],
        evaluation_questions_binary: [],
        guide: '',
        is_active: true,
        is_binary: true
    };

    const [formData, setFormData] = useState(initialFormData);
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [availableRequisitos, setAvailableRequisitos] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (indicator) {
                if (indicator.value_id) {
                    loadSubcategories(indicator.value_id);
                }
                
                setFormData({
                    ...indicator,
                    homologation_ids: indicator.homologations.map((homologation) => homologation.id),
                    evaluation_questions: indicator.evaluation_questions.map((question) => question.question),
                    evaluation_questions_binary: indicator.evaluation_questions.map((question) => question.is_binary || false),
                    value_id: indicator.value_id,
                    subcategory_id: indicator.subcategory?.id || '',
                    is_binary: indicator.is_binary !== undefined ? indicator.is_binary : true
                });
                loadRequisitos(indicator.subcategory_id);
            } else {
                setFormData(initialFormData);
                setAvailableSubcategories([]);
                setAvailableRequisitos([]);
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
            setAvailableSubcategories([]);
        }
    };

    const loadRequisitos = async (subcategoryId) => {
        if (!subcategoryId) {
            setAvailableRequisitos([]);
            return;
        }

        try {
            const response = await axios.get(`/api/subcategories/${subcategoryId}/requisitos`);
            setAvailableRequisitos(response.data);
        } catch (error) {
            console.error('Error al cargar requisitos:', error);
            setAvailableRequisitos([]);
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

    const handleSubcategoryChange = async (subcategoryId) => {
        setFormData(prev => ({
            ...prev,
            subcategory_id: subcategoryId,
            requisito_id: ''
        }));

        await loadRequisitos(subcategoryId);
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
            evaluation_questions: [...prev.evaluation_questions, ''],
            evaluation_questions_binary: [...prev.evaluation_questions_binary, true]
        }));
    };

    const removeQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            evaluation_questions: prev.evaluation_questions.filter((_, i) => i !== index),
            evaluation_questions_binary: prev.evaluation_questions_binary.filter((_, i) => i !== index)
        }));
    };

    const updateQuestion = (index, value) => {
        setFormData((prevData) => {
            const evaluationQuestions = [...prevData.evaluation_questions];
            evaluationQuestions[index] = value;
            return {
                ...prevData,
                evaluation_questions: evaluationQuestions,
            };
        });
    };

    const updateQuestionBinary = (index, value) => {
        setFormData((prevData) => {
            const evaluationQuestionsBinary = [...prevData.evaluation_questions_binary];
            evaluationQuestionsBinary[index] = value;
            return {
                ...prevData,
                evaluation_questions_binary: evaluationQuestionsBinary,
            };
        });
    };

    const toggleHomologation = (homologationId) => {
        setFormData((prevData) => {
            const homologationIds = prevData.homologation_ids || [];
            const index = homologationIds.indexOf(homologationId);
            if (index > -1) {
                homologationIds.splice(index, 1);
            } else {
                homologationIds.push(homologationId);
            }
            return {
                ...prevData,
                homologation_ids: homologationIds,
            };
        });
    };

    const HomologationSelector = () => {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Homologaciones asociadas (opcional)
                </label>
                <div className="mt-1 border border-gray-300 rounded-lg divide-y">
                    {relatedData.homologations.map((homologation) => (
                        <div
                            key={homologation.id}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleHomologation(homologation.id)}
                        >
                            <input
                                type="checkbox"
                                checked={formData.homologation_ids.includes(homologation.id)}
                                readOnly
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{homologation.nombre}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
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
                            <div className="px-6 py-4">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

                                    {/* Es por SI o NO? */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            Es por SI o NO?
                                            <span className="ml-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Por defecto: Sí
                                            </span>
                                        </label>
                                        <Switch
                                            checked={formData.is_binary}
                                            onChange={(value) => setFormData({ ...formData, is_binary: value })}
                                            label={formData.is_binary ? 'Sí' : 'No'}
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Indica si este indicador es por SI o NO. Si está activado, se mostrarán botones de SI/NO. 
                                            Si está desactivado, se mostrará un campo de texto para justificación.
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
                                            onChange={(e) => handleSubcategoryChange(e.target.value)}
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

                                    {/* Requisito */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Requisito *
                                        </label>
                                        <select
                                            value={formData.requisito_id}
                                            onChange={(e) => setFormData({ ...formData, requisito_id: e.target.value })}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                            disabled={!formData.subcategory_id}
                                        >
                                            <option value="">
                                                {formData.subcategory_id
                                                    ? 'Seleccione un requisito'
                                                    : 'Primero seleccione una subcategoría'}
                                            </option>
                                            {availableRequisitos.map((requisito) => (
                                                <option key={requisito.id} value={requisito.id}>
                                                    {requisito.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formData.subcategory_id && availableRequisitos.length === 0 && (
                                            <p className="mt-1 text-sm text-red-500">
                                                No hay requisitos disponibles para esta subcategoría
                                            </p>
                                        )}
                                    </div>

                                    {/* Pregunta de autoevaluación */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pregunta de autoevaluación
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.self_evaluation_question}
                                            onChange={(e) => setFormData({ ...formData, self_evaluation_question: e.target.value })}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Preguntas de evaluación (opcional) */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Preguntas de evaluación (opcional)
                                        </label>
                                        {formData.evaluation_questions.map((question, index) => (
                                            <div key={index} className="flex items-center space-x-2 mb-4">
                                                <div className="flex-grow">
                                                    <input
                                                        type="text"
                                                        value={question}
                                                        onChange={(e) => updateQuestion(index, e.target.value)}
                                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center">
                                                        <label className="mr-2 text-sm text-gray-700 flex items-center">
                                                            ¿Es SI/NO?
                                                            <span className="ml-1 inline-flex items-center rounded-md bg-green-50 px-1 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                Por defecto
                                                            </span>
                                                        </label>
                                                        <Switch
                                                            checked={formData.evaluation_questions_binary[index] || false}
                                                            onChange={(value) => updateQuestionBinary(index, value)}
                                                            label={formData.evaluation_questions_binary[index] ? 'Sí' : 'No'}
                                                        />
                                                    </div>
                                                    {formData.evaluation_questions.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeQuestion(index)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addQuestion}
                                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Agregar pregunta
                                        </button>
                                    </div>

                                    {/* Guía (opcional) */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Guía (opcional)
                                        </label>
                                        <textarea
                                            value={formData.guide}
                                            onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Homologaciones (Múltiples) */}
                                    <div className="sm:col-span-2">
                                        <HomologationSelector />
                                    </div>

                                    {/* Estado */}
                                    <div className="sm:col-span-2">
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