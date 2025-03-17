import { useState, useEffect } from 'react';
import { X, Plus, Trash, Check, AlertCircle, AlertTriangle, Search } from 'lucide-react';
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
    const [validationError, setValidationError] = useState(null);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [homologationSearch, setHomologationSearch] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (indicator) {
                if (indicator.value_id) {
                    loadSubcategories(indicator.value_id);
                }
                
                // Extraer las preguntas, sus valores binarios y sus IDs
                const evaluationQuestions = indicator.evaluation_questions.map(question => question.question);
                const evaluationQuestionsBinary = indicator.evaluation_questions.map(question => question.is_binary || false);
                const evaluationQuestionIds = indicator.evaluation_questions.map(question => question.id);
                
                setFormData({
                    ...indicator,
                    homologation_ids: indicator.homologations.map((homologation) => homologation.id),
                    evaluation_questions: evaluationQuestions,
                    evaluation_questions_binary: evaluationQuestionsBinary,
                    evaluation_question_ids: evaluationQuestionIds,
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
        
        // Validar que haya al menos una pregunta de evaluación
        if (!formData.evaluation_questions.length || formData.evaluation_questions.every(q => !q.trim())) {
            setValidationError('Debe agregar al menos una pregunta de evaluación');
            return;
        }

        // Validar que no haya preguntas vacías
        const hasEmptyQuestions = formData.evaluation_questions.some(q => !q.trim());
        if (hasEmptyQuestions) {
            setValidationError('No puede haber preguntas vacías');
            return;
        }

        // Filtrar preguntas vacías (por si acaso)
        const filteredQuestions = formData.evaluation_questions.filter(q => q.trim());
        const filteredBinary = formData.evaluation_questions_binary.filter((_, i) => formData.evaluation_questions[i].trim());

        // Crear una copia del formData con las preguntas filtradas
        const submissionData = {
            ...formData,
            evaluation_questions: filteredQuestions,
            evaluation_questions_binary: filteredBinary
        };

        // Enviar los datos al componente padre con un tipo de evento
        if (indicator) {
            // Si estamos editando, enviamos un evento de actualización
            onSubmit({ 
                type: 'indicator_updated', 
                indicatorId: indicator.id, 
                data: submissionData 
            });
        } else {
            // Si estamos creando, enviamos un evento de creación
            onSubmit({ 
                type: 'indicator_created', 
                data: submissionData 
            });
        }
        
        // Cerrar el modal
        handleClose();
    };

    const handleClose = () => {
        setFormData(initialFormData);
        setValidationError(null);
        onClose();
    };

    const addQuestion = () => {
        setValidationError(null);
        setFormData(prev => ({
            ...prev,
            evaluation_questions: [...prev.evaluation_questions, ''],
            evaluation_questions_binary: [...prev.evaluation_questions_binary, true]
        }));
        
        // Hacer scroll a la última pregunta añadida
        setTimeout(() => {
            const questionElements = document.querySelectorAll('.question-item');
            if (questionElements.length > 0) {
                const lastQuestion = questionElements[questionElements.length - 1];
                lastQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Enfocar el último input de pregunta
                const lastInput = lastQuestion.querySelector('input[type="text"]');
                if (lastInput) {
                    lastInput.focus();
                }
            }
        }, 100);
    };

    const handleDeleteQuestion = (index) => {
        setQuestionToDelete(index);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteQuestion = () => {
        if (questionToDelete !== null) {
            removeQuestion(questionToDelete);
            setQuestionToDelete(null);
            setShowDeleteConfirmation(false);
        }
    };

    const cancelDeleteQuestion = () => {
        setQuestionToDelete(null);
        setShowDeleteConfirmation(false);
    };

    const removeQuestion = (index) => {
        setValidationError(null);
        if (indicator?.evaluation_questions?.[index]?.id) {
            const questionId = indicator.evaluation_questions[index].id;
            axios.delete(`/api/indicators/${indicator.id}/questions/${questionId}`)
                .then(() => {
                    setFormData(prev => ({
                        ...prev,
                        evaluation_questions: prev.evaluation_questions.filter((_, i) => i !== index),
                        evaluation_questions_binary: prev.evaluation_questions_binary.filter((_, i) => i !== index),
                        // Si hay un array de IDs de preguntas, también lo actualizamos
                        evaluation_question_ids: prev.evaluation_question_ids 
                            ? prev.evaluation_question_ids.filter((_, i) => i !== index)
                            : undefined
                    }));
                    
                    // Notificar al componente padre que se ha eliminado una pregunta
                    if (onSubmit) {
                        // Enviamos un evento personalizado para indicar que se eliminó una pregunta
                        onSubmit({ type: 'question_deleted', indicatorId: indicator.id, questionId });
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar la pregunta:', error);
                });
        } else {
            // La pregunta no existe en la base de datos, solo la eliminamos del estado
            setFormData(prev => ({
                ...prev,
                evaluation_questions: prev.evaluation_questions.filter((_, i) => i !== index),
                evaluation_questions_binary: prev.evaluation_questions_binary.filter((_, i) => i !== index)
            }));
        }
    };

    const updateQuestion = (index, value) => {
        // Si el valor anterior estaba vacío y ahora tiene contenido, limpiar el error de validación
        if (formData.evaluation_questions[index].trim() === '' && value.trim() !== '') {
            setValidationError(null);
        }
        
        setFormData((prevData) => {
            const evaluationQuestions = [...prevData.evaluation_questions];
            evaluationQuestions[index] = value;
            
            // Si la pregunta se ha vaciado y tiene un ID, marcarla para eliminación
            if (value.trim() === '' && 
                prevData.evaluation_question_ids && 
                index < prevData.evaluation_question_ids.length && 
                prevData.evaluation_question_ids[index]) {
                
                // Mostrar mensaje de validación
                if (validationError === null) {
                    setValidationError('Hay preguntas de evaluación vacías. Por favor, complételas o elimínelas antes de continuar.');
                }
            }
            
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
        // Filtrar homologaciones basadas en la búsqueda
        const filteredHomologations = relatedData.homologations.filter(homologation => 
            homologation.nombre.toLowerCase().includes(homologationSearch.toLowerCase())
        );

        // Obtener las homologaciones seleccionadas
        const selectedHomologations = relatedData.homologations.filter(
            homologation => formData.homologation_ids.includes(homologation.id)
        );

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                        Homologaciones asociadas (opcional)
                    </label>
                    {formData.homologation_ids.length > 0 && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {formData.homologation_ids.length} seleccionada(s)
                        </span>
                    )}
                </div>
                
                {/* Barra de búsqueda */}
                {/* <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={homologationSearch}
                        onChange={(e) => setHomologationSearch(e.target.value)}
                        placeholder="Buscar homologaciones..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div> */}
                
                <div className="mt-1 border border-gray-300 rounded-lg max-h-48 overflow-y-auto scrollbar-custom">
                    {filteredHomologations.length > 0 ? (
                        <div className="divide-y">
                            {filteredHomologations.map((homologation) => (
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
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No se encontraron homologaciones con ese criterio
                        </div>
                    )}
                </div>
                
                {selectedHomologations.length > 0 && (
                    <div className="mt-3">
                        <div className="text-xs font-medium text-gray-500 mb-2">Homologaciones seleccionadas:</div>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto scrollbar-custom p-1">
                            {selectedHomologations.map(homologation => (
                                <div 
                                    key={homologation.id}
                                    className="flex items-center bg-gray-50 text-xs px-2 py-1 rounded-md border border-gray-200"
                                >
                                    <span className="text-gray-700">{homologation.nombre}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleHomologation(homologation.id);
                                        }}
                                        className="ml-1 text-gray-400 hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Componente de diálogo de confirmación
    const DeleteConfirmationDialog = () => {
        if (!showDeleteConfirmation || questionToDelete === null) return null;
        
        // Obtener la pregunta que se va a eliminar
        const questionText = formData.evaluation_questions[questionToDelete] || '';
        const truncatedQuestion = questionText.length > 50 
            ? questionText.substring(0, 50) + '...' 
            : questionText;
        
        // Usar un portal para renderizar el diálogo fuera del modal principal
        return (
            <div className="fixed inset-0 z-[70] overflow-y-auto backdrop-blur-sm transition-opacity">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Confirmar eliminación
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Está seguro de que desea eliminar esta pregunta de evaluación?
                                        </p>
                                        {questionText && (
                                            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                                <p className="text-sm font-medium text-gray-700">
                                                    "{truncatedQuestion}"
                                                </p>
                                            </div>
                                        )}
                                        <p className="mt-2 text-sm text-red-500">
                                            Esta acción no se puede deshacer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={confirmDeleteQuestion}
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Eliminar
                            </button>
                            <button
                                type="button"
                                onClick={cancelDeleteQuestion}
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <>
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
                                                Descalificatório
                                            </label>
                                            <Switch
                                                checked={formData.binding}
                                                onChange={(value) => setFormData({ ...formData, binding: value })}
                                                label={formData.binding ? 'Sí' : 'No'}
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Indica si este indicador es descalificatório para la evaluación
                                            </p>
                                        </div>

                                        {/* Es por SI o NO? */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
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

                                        {/* Preguntas de evaluación */}
                                        <div className="sm:col-span-2 evaluation-questions-section">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Preguntas de evaluación
                                            </label>
                                            
                                            {validationError && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-red-600">{validationError}</p>
                                                </div>
                                            )}
                                            
                                            {formData.evaluation_questions.map((question, index) => (
                                                <div key={index} className="flex flex-col mb-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex-grow">
                                                            <input
                                                                type="text"
                                                                value={question}
                                                                onChange={(e) => updateQuestion(index, e.target.value)}
                                                                className={`block w-full rounded-lg border-${question.trim() === '' ? 'red-300' : 'gray-300'} shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm`}
                                                            />
                                                            {question.trim() === '' && (
                                                                <p className="mt-1 text-sm text-red-500">
                                                                    Debe completar la pregunta o eliminarla
                                                                </p>
                                                            )}
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
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteQuestion(index)}
                                                                className="flex items-center px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                                title="Eliminar pregunta"
                                                            >
                                                                <Trash className="h-3.5 w-3.5 mr-1" />
                                                                Eliminar
                                                            </button>
                                                        </div>
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
            
            {/* Renderizar el diálogo de confirmación fuera del modal principal */}
            <DeleteConfirmationDialog />
        </>
    );
} 