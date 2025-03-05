import DashboardLayout from '@/Layouts/DashboardLayout';
import StepIndicator from '@/Components/StepIndicator';
import FileManager from '@/Components/FileManager';
import Toast from '@/Components/Toast';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';

export default function Evaluacion({ valueData, userName, savedAnswers, isEvaluador = false, progress, totalSteps, value_id, company }) {
    const { auth } = usePage().props;
    const [currentSubcategoryIndex, setCurrentSubcategoryIndex] = useState(0);
    const [approvals, setApprovals] = useState(() => {
        const initialApprovals = {};
        if (savedAnswers) {
            Object.entries(savedAnswers).forEach(([questionId, answerData]) => {
                initialApprovals[questionId] = answerData.approved || false;
            });
        }
        return initialApprovals;
    });
    const [answers, setAnswers] = useState(() => {
        const initialAnswers = {};
        if (savedAnswers) {
            Object.entries(savedAnswers).forEach(([questionId, answerData]) => {
                initialAnswers[questionId] = {
                    value: answerData.value,
                    description: answerData.description || '',
                    files: answerData.files || [],
                    evaluator_comment: answerData.evaluator_comment || ''
                };
            });
        }
        return initialAnswers;
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [evaluatorProgress, setEvaluatorProgress] = useState(0);
    const [validationErrors, setValidationErrors] = useState({});
    
    // Verificar si la empresa es exportadora
    const isExporter = auth.user.company?.is_exporter === true;

    const subcategories = valueData.subcategories;
    const isLastSubcategory = currentSubcategoryIndex === subcategories.length - 1;

    // Configuración de steps igual que en Indicadores
    const steps = subcategories.map(subcategory => ({
        title: subcategory.name.split(' ')[0],
        subtitle: subcategory.name.split(' ').slice(1).join(' ')
    }));

    const handleStepClick = (index) => {
        setCurrentSubcategoryIndex(index);

        // Establecer automáticamente el valor "1" (Sí) para preguntas con is_binary = false
        if (!isEvaluador) {
            const newAnswers = { ...answers };
            let hasChanges = false;

            const subcategory = subcategories[index];
            subcategory.indicators.forEach(indicator => {
                indicator.evaluation_questions.forEach(question => {
                    if (question.is_binary === false || question.is_binary === 0) {
                        // Si la pregunta no es binaria, establecer automáticamente "Sí" y una descripción predeterminada
                        if (!newAnswers[question.id] || !newAnswers[question.id]?.description) {
                            newAnswers[question.id] = {
                                value: "1", // Establecer "Sí" como valor predeterminado
                                description: newAnswers[question.id]?.description || '',
                                files: newAnswers[question.id]?.files || []
                            };
                            hasChanges = true;
                        }
                    }
                });
            });

            if (hasChanges) {
                setAnswers(newAnswers);
            }
        }
    };

    console.log(company)

    const handleContinue = async () => {
        // Validar campos antes de continuar
        const errors = {};
        let hasErrors = false;

        // Verificar las preguntas de la subcategoría actual
        subcategories[currentSubcategoryIndex].indicators.forEach(indicator => {
            indicator.evaluation_questions.forEach(question => {
                // No validar descripción para preguntas no binarias
                if (question.is_binary === false || question.is_binary === 0) {
                    return;
                }
                
                // Verificar descripción
                if (!answers[question.id]?.description?.trim()) {
                    errors[`description-${question.id}`] = 'La descripción es obligatoria';
                    hasErrors = true;
                }
                
                // Verificar si hay archivos
                const hasFiles = answers[question.id]?.files && answers[question.id]?.files.length > 0;
                if (!hasFiles) {
                    errors[`files-${question.id}`] = 'Debe subir al menos un archivo como evidencia';
                    hasErrors = true;
                }
            });
        });
        
        setValidationErrors(errors);

        if (hasErrors) {
            setNotification({
                type: 'error',
                message: 'Debes completar todos los campos requeridos antes de continuar'
            });
            return;
        }
        
        if (!areCurrentSubcategoryQuestionsAnswered()) {
            setNotification({
                type: 'error',
                message: 'Debes completar todos los campos requeridos antes de continuar'
            });
            return;
        }

        try {
            setLoading(true);
            
            // Guardar respuestas por indicador para la subcategoría actual
            let hasError = false;
            
            for (const indicator of subcategories[currentSubcategoryIndex].indicators) {
                // Configurar como guardado parcial
                const result = await saveAnswersByIndicator(indicator, true);
                if (!result.success) {
                    hasError = true;
                    break;
                }
            }

            if (!hasError) {
                setNotification({
                    type: 'success',
                    message: 'Respuestas guardadas correctamente'
                });
                
                // Avanzar a la siguiente subcategoría
                if (currentSubcategoryIndex < subcategories.length - 1) {
                    setCurrentSubcategoryIndex(prev => prev + 1);
                    window.scrollTo(0, 0);
                } else {
                    // Si es la última subcategoría, avanzar a la siguiente categoría
                    if (currentCategoryIndex < categories.length - 1) {
                        setCurrentCategoryIndex(currentCategoryIndex + 1);
                        setCurrentSubcategoryIndex(0);
                        window.scrollTo(0, 0);
                    } else {
                        // Si es la última categoría y subcategoría, finalizar
                        handleFinish();
                    }
                }
            }
        } catch (error) {
            console.error('Error al guardar respuestas:', error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al guardar las respuestas'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (currentSubcategoryIndex > 0) {
            setCurrentSubcategoryIndex(prev => prev - 1);
        }
    };

    const calculateProgress = () => {
        // Solo para usuarios normales (no evaluadores)
        let totalQuestions = 0;
        let answeredQuestions = 0;

        subcategories.forEach(subcategory => {
            subcategory.indicators.forEach(indicator => {
                indicator.evaluation_questions.forEach(question => {
                    totalQuestions++;

                    // Si la pregunta no es binaria, considerarla como respondida automáticamente
                    if (question.is_binary === false || question.is_binary === 0) {
                        answeredQuestions++;
                        return;
                    }
                    
                    // Para empresas, verificar que el valor esté definido
                    const hasValue = answers[question.id]?.value !== undefined;

                    // Verificar que la descripción no esté vacía después de quitar espacios
                    const hasDescription = answers[question.id]?.description?.trim() !== '' &&
                        answers[question.id]?.description !== undefined;

                    // Verificar que haya al menos un archivo
                    const hasFiles = answers[question.id]?.files?.length > 0;

                    // Una pregunta se considera respondida si tiene valor y descripción
                    // Los archivos son opcionales en algunos casos
                    if (hasValue && hasDescription) {
                        answeredQuestions++;
                    }
                });
            });
        });

        // Calcular el porcentaje y redondear al entero más cercano
        return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    };

    // Nueva función para calcular el progreso específico de los evaluadores
    const calculateEvaluatorProgress = () => {
        let totalQuestions = 0;
        let answeredQuestions = 0;

        subcategories.forEach(subcategory => {
            subcategory.indicators.forEach(indicator => {
                indicator.evaluation_questions.forEach(question => {
                    totalQuestions++;

                    // Para evaluadores, verificar si se ha tomado una decisión (aprobado o no)
                    const hasApprovalDecision = approvals[question.id] !== undefined;

                    // Para evaluadores, solo necesitamos que haya tomado una decisión
                    if (hasApprovalDecision) {
                        answeredQuestions++;
                    }
                });
            });
        });

        // Calcular el porcentaje y redondear al entero más cercano
        return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    };

    const handleAnswer = (questionId, value, description = '', files = [], evaluator_comment = '') => {
        // Si la empresa no es exportadora y no es evaluador, no permitir cambios
        if (!isExporter && !isEvaluador) {
            setNotification({
                type: 'error',
                message: 'Su empresa debe ser exportadora para poder realizar la evaluación.'
            });
            return;
        }

        const newAnswers = { ...answers };
        newAnswers[questionId] = {
            value,
            description,
            files,
            evaluator_comment
        };
        setAnswers(newAnswers);

        // Validar si hay archivos
        if (files.length === 0) {
            setValidationErrors(prev => ({
                ...prev,
                [`files-${questionId}`]: 'Debe subir al menos un archivo como evidencia'
            }));
        } else {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`files-${questionId}`];
                return newErrors;
            });
        }
    };

    const handleApproval = (questionId, value) => {
        // Si la empresa no es exportadora y no es evaluador, no permitir cambios
        if (!isExporter && !isEvaluador) {
            setNotification({
                type: 'error',
                message: 'Su empresa debe ser exportadora para poder realizar la evaluación.'
            });
            return;
        }

        const newApprovals = { ...approvals };
        newApprovals[questionId] = value;
        setApprovals(newApprovals);
    };

    console.log(valueData)

    const areAllQuestionsAnswered = () => {
        if (isEvaluador) {
            // Para evaluadores, usar la misma lógica que calculateEvaluatorProgress
            let totalQuestions = 0;
            let answeredQuestions = 0;

            valueData.subcategories.forEach(subcategory => {
                subcategory.indicators.forEach(indicator => {
                    indicator.evaluation_questions.forEach(question => {
                        totalQuestions++;
                        
                        // Para evaluadores, verificar si se ha tomado una decisión (aprobado o no)
                        if (approvals[question.id] !== undefined) {
                            answeredQuestions++;
                        }
                    });
                });
            });

            return totalQuestions === answeredQuestions;
        } else {
            // Para usuarios normales, usar la misma lógica que calculateProgress
            let totalQuestions = 0;
            let answeredQuestions = 0;

            valueData.subcategories.forEach(subcategory => {
                subcategory.indicators.forEach(indicator => {
                    indicator.evaluation_questions.forEach(question => {
                        totalQuestions++;
                        
                        // Si la pregunta no es binaria, considerarla como respondida automáticamente
                        if (question.is_binary === false || question.is_binary === 0) {
                            answeredQuestions++;
                            return;
                        }
                        
                        // Para empresas, verificar que el valor esté definido
                        const hasValue = answers[question.id]?.value !== undefined;

                        // Verificar que la descripción no esté vacía después de quitar espacios
                        const hasDescription = answers[question.id]?.description?.trim() !== '' &&
                            answers[question.id]?.description !== undefined;

                        // Verificar que haya al menos un archivo subido
                        const hasFiles = answers[question.id]?.files && answers[question.id]?.files.length > 0;

                        // Una pregunta se considera respondida si tiene valor, descripción y al menos un archivo
                        if (hasValue && hasDescription && hasFiles) {
                            answeredQuestions++;
                        }
                    });
                });
            });

            return totalQuestions === answeredQuestions;
        }
    };

    const areCurrentSubcategoryQuestionsAnswered = () => {
        const currentSubcategory = subcategories[currentSubcategoryIndex];

        if (isEvaluador) {
            // Para evaluadores, verificar si todas las preguntas de la subcategoría actual tienen una decisión
            return currentSubcategory.indicators.every(indicator =>
                indicator.evaluation_questions.every(question =>
                    approvals[question.id] !== undefined
                )
            );
        } else {
            // Para empresas
            return currentSubcategory.indicators.every(indicator =>
                indicator.evaluation_questions.every(question => {
                    // Si la pregunta no es binaria, considerarla como respondida automáticamente
                    if (question.is_binary === false || question.is_binary === 0) {
                        return true;
                    }

                    // Verificar que el valor esté definido
                    const hasValue = answers[question.id]?.value !== undefined;

                    // Verificar que la descripción no esté vacía después de quitar espacios
                    const hasDescription = answers[question.id]?.description?.trim() !== '' &&
                        answers[question.id]?.description !== undefined;
                    
                    // Verificar que haya al menos un archivo subido
                    const hasFiles = answers[question.id]?.files && answers[question.id]?.files.length > 0;

                    return hasValue && hasDescription && hasFiles;
                })
            );
        }
    };

    const handleFinish = () => {
        // Si la empresa no es exportadora y no es evaluador, no permitir finalizar
        if (!isExporter && !isEvaluador) {
            setNotification({
                type: 'error',
                message: 'Su empresa debe ser exportadora para poder realizar la evaluación.'
            });
            return;
        }

        // Verificar si hay preguntas sin archivos
        let hasQuestionsWithoutFiles = false;
        const errors = {};
        
        valueData.subcategories.forEach(subcategory => {
            subcategory.indicators.forEach(indicator => {
                indicator.evaluation_questions.forEach(question => {
                    // Si la pregunta no es binaria, omitirla
                    if (question.is_binary === false || question.is_binary === 0) {
                        return;
                    }
                    
                    // Verificar si hay archivos
                    const hasFiles = answers[question.id]?.files && answers[question.id]?.files.length > 0;
                    
                    if (!hasFiles) {
                        hasQuestionsWithoutFiles = true;
                        errors[`files-${question.id}`] = 'Debe subir al menos un archivo como evidencia';
                    }
                });
            });
        });
        
        if (hasQuestionsWithoutFiles) {
            setValidationErrors(errors);
            setNotification({
                type: 'error',
                message: 'Debe subir al menos un archivo como evidencia para cada pregunta'
            });
            return;
        }

        if (!areAllQuestionsAnswered()) {
            setNotification({
                type: 'error',
                message: 'Debes completar todas las preguntas antes de finalizar.'
            });
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        try {
            setLoading(true);
            
            // Obtener todos los indicadores de todas las subcategorías
            const allIndicators = [];
            subcategories.forEach(subcategory => {
                subcategory.indicators.forEach(indicator => {
                    allIndicators.push(indicator);
                });
            });
            
            // Guardar respuestas por indicador
            let hasError = false;
            
            for (const indicator of allIndicators) {
                const result = await saveAnswersByIndicator(indicator);
                if (!result.success) {
                    hasError = true;
                    break;
                }
            }
            
            if (!hasError) {
                setNotification({
                    type: 'success',
                    message: 'Respuestas guardadas correctamente'
                });
                setShowConfirmModal(false);
                
                // Obtener el siguiente valor disponible
                try {
                    const valuesResponse = await axios.get('/api/active-values');
                    const values = valuesResponse.data;
                    const currentIndex = values.findIndex(v => v.id === valueData.id);
                    const nextValue = values[currentIndex + 1];

                    if (nextValue) {
                        // Redirigir al siguiente valor
                        router.visit(`/evaluacion/${nextValue.id}`);
                        setNotification({
                            type: 'success',
                            message: 'Respuestas guardadas. Pasando al siguiente valor...'
                        });
                    } else {
                        // Si no hay más valores, mostrar mensaje de finalización
                        setNotification({
                            type: 'success',
                            message: '¡Has completado todos los valores!'
                        });
                        // Opcional: redirigir a una página de resumen o dashboard
                        if (isEvaluador) {
                            router.visit(route('evaluador.dashboard'));
                        } else {
                            router.visit(route('dashboard'));
                        }
                    }
                } catch (error) {
                    console.error('Error al obtener siguiente valor:', error);
                    setNotification({
                        type: 'success',
                        message: 'Evaluación guardada correctamente'
                    });
                }
            }
        } catch (error) {
            console.error('Error al guardar evaluación:', error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al guardar la evaluación'
            });
        } finally {
            setLoading(false);
        }
    };
    
    // Modificar la función saveAnswersByIndicator para aceptar un parámetro isPartialSave
    const saveAnswersByIndicator = async (indicator, isPartialSave = false) => {
        try {
            const formData = new FormData();
            formData.append('isPartialSave', isPartialSave ? 'true' : 'false');
            formData.append('value_id', value_id);
            formData.append('indicator_id', indicator.id);
            
            // Obtener solo las respuestas del indicador actual
            const indicatorAnswers = {};
            indicator.evaluation_questions.forEach(question => {
                if (answers[question.id]) {
                    indicatorAnswers[question.id] = answers[question.id];
                }
            });
            
            // Si no hay respuestas para este indicador, omitirlo
            if (Object.keys(indicatorAnswers).length === 0) {
                return { success: true };
            }
            
            Object.entries(indicatorAnswers).forEach(([questionId, answerData]) => {
                formData.append(`answers[${questionId}][value]`, answerData.value);
                formData.append(`answers[${questionId}][description]`, answerData.description || '');

                if (answerData.files && answerData.files.length > 0) {
                    answerData.files.forEach(file => {
                        if (file instanceof File) {
                            formData.append(`answers[${questionId}][files][]`, file);
                        } else {
                            formData.append(`answers[${questionId}][existing_files][]`, JSON.stringify(file));
                        }
                    });
                }

                if (isEvaluador) {
                    formData.append(`answers[${questionId}][approved]`, approvals[questionId] ? '1' : '0');
                    formData.append(`answers[${questionId}][evaluator_comment]`, answerData.evaluator_comment || '');
                }
            });
            
            const response = await axios.post(route('evaluacion.store-answers-by-indicator'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success && response.data.savedAnswers) {
                // Actualizar las respuestas guardadas
                setAnswers(prevAnswers => ({
                    ...prevAnswers,
                    ...response.data.savedAnswers
                }));
            }
            
            return response.data;
        } catch (error) {
            console.error(`Error al guardar respuestas del indicador ${indicator.id}:`, error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || `Error al guardar respuestas del indicador ${indicator.name}`
            });
            return { success: false, error };
        }
    };

    // Efecto para establecer automáticamente el valor "1" (Sí) para preguntas con is_binary = false
    useEffect(() => {
        if (!isEvaluador) {
            const newAnswers = { ...answers };
            let hasChanges = false;

            valueData.subcategories.forEach(subcategory => {
                subcategory.indicators.forEach(indicator => {
                    indicator.evaluation_questions.forEach(question => {
                        if (question.is_binary === false || question.is_binary === 0) {
                            // Si la pregunta no es binaria, establecer automáticamente "Sí" y una descripción predeterminada
                            if (!newAnswers[question.id] || !newAnswers[question.id]?.description) {
                                newAnswers[question.id] = {
                                    value: "1", // Establecer "Sí" como valor predeterminado
                                    description: newAnswers[question.id]?.description || '',
                                    files: newAnswers[question.id]?.files || []
                                };
                                hasChanges = true;
                            }
                        }
                    });
                });
            });

            if (hasChanges) {
                setAnswers(newAnswers);
            }
        }
    }, [valueData, isEvaluador]);

    // Efecto para actualizar el progreso cuando cambian las respuestas o aprobaciones
    useEffect(() => {
        if (isEvaluador) {
            // Actualizar solo el progreso del evaluador
            const newEvaluatorProgress = calculateEvaluatorProgress();
            setEvaluatorProgress(newEvaluatorProgress);
        } else {
            // Actualizar solo el progreso normal
            const newProgress = calculateProgress();
            setCurrentProgress(newProgress);
        }
    }, [answers, approvals, isEvaluador]);

    return (
        <DashboardLayout userName={userName} title="Evaluación">
            <div className="space-y-8">
                {!isExporter && !isEvaluador && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    <strong>Atención:</strong> Su empresa debe ser exportadora para poder realizar la evaluación. Por favor, actualice la información de su empresa en su perfil.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Encabezado y Métricas */}
                <div className="lg:flex justify-between items-center gap-8">
                    <div className="lg:w-1/2">
                        <div className="flex items-center mt-5">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-blue-600/20 flex items-center gap-2">
                                Evaluación en Proceso
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold mt-3">{valueData.name}</h1>
                        <p className="text-gray-500 mt-2">
                            Complete cada paso del proceso de evaluación para continuar.
                        </p>
                    </div>

                    {/* Progreso para usuarios normales (no evaluadores) */}
                    {!isEvaluador && (
                        <div className="lg:w-1/2 mt-5 lg:mt-0">
                            <div>
                                <div className="flex">
                                    <div className="w-1/2 rounded-l-xl px-6 p-4 bg-blue-100/50 text-blue-700">
                                        <h2 className="text-lg font-semibold mb-2 text-blue-700">
                                            Progreso actual
                                        </h2>
                                        <p className="text-2xl font-bold text-blue-500">
                                            {currentProgress}%
                                        </p>
                                    </div>
                                    <div className="w-1/2 rounded-e-xl bg-blue-800 px-6 p-4">
                                        <h2 className="text-lg text-blue-200 font-semibold mb-2">Total pasos</h2>
                                        <p className="text-2xl text-blue-200 font-bold">
                                            {totalSteps}
                                        </p>
                                    </div>
                                </div>
                                {/* Barra de progreso */}
                                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${currentProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progreso específico para evaluadores */}
                    {/* {isEvaluador && (
                        <div className="lg:w-1/2 mt-5 lg:mt-0">
                            <div>
                                <div className="flex">
                                    <div className="w-1/2 rounded-l-xl px-6 p-4 bg-green-100/50 text-green-700">
                                        <h2 className="text-lg font-semibold mb-2 text-green-700">
                                            Progreso de evaluación
                                        </h2>
                                        <p className="text-2xl font-bold text-green-500">
                                            {evaluatorProgress}%
                                        </p>
                                    </div>
                                    <div className="w-1/2 rounded-e-xl bg-green-800 px-6 p-4">
                                        <h2 className="text-lg text-green-200 font-semibold mb-2">Total indicadores</h2>
                                        <p className="text-2xl text-green-200 font-bold">
                                            {totalSteps}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${evaluatorProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>

                {/* Contenido Principal */}
                <div className='bg-white shadow rounded-xl p-8'>
                    <div>
                        <StepIndicator
                            steps={steps}
                            currentStep={currentSubcategoryIndex}
                            onStepClick={handleStepClick}
                        />
                    </div>

                    <div className='mt-16'>
                        <h2 className='text-gray-500 font-semibold'>
                            {subcategories[currentSubcategoryIndex].name}
                        </h2>

                        <div className="mt-10 space-y-6">
                            {subcategories[currentSubcategoryIndex].indicators.map(indicator => (
                                <div key={indicator.id} className="space-y-8">
                                    {/* Cabecera del Indicador */}
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-8">
                                        <div className="space-y-2">
                                            <div className="inline-block">
                                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-green-600/20">
                                                    INDICADOR {indicator.name}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Preguntas de Evaluación */}
                                        {indicator.evaluation_questions.map((question, index) => (
                                            <div key={index} className="space-y-6 border-b border-gray-200 pb-6 last:border-b-0">
                                                <h3 className="text-gray-900 font-medium leading-6">
                                                    {question.question}
                                                </h3>

                                                {/* Opciones Si/No - Solo mostrar si is_binary es true */}
                                                {(question.is_binary === true || question.is_binary === 1) && (
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.id}`}
                                                                value="1"
                                                                checked={answers[question.id]?.value === "1"}
                                                                onChange={(e) => handleAnswer(question.id, e.target.value)}
                                                                disabled={isEvaluador || (!isExporter && !isEvaluador) || company.estado_eval === 'evaluacion-completada' || company.estado_eval === 'evaluado'}
                                                                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                            />
                                                            <span className="text-gray-900">Sí</span>
                                                        </label>

                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.id}`}
                                                                value="0"
                                                                checked={answers[question.id]?.value === "0"}
                                                                onChange={(e) => handleAnswer(question.id, e.target.value)}
                                                                disabled={isEvaluador || (!isExporter && !isEvaluador) || company.estado_eval === 'evaluacion-completada' || company.estado_eval === 'evaluado'}
                                                                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                            />
                                                            <span className="text-gray-900">No</span>
                                                        </label>
                                                    </div>
                                                )}

                                                {/* Descripción */}
                                                <div className='flex flex-col md:flex-row md:items-start gap-4'>
                                                    <div className="w-full md:w-1/2 space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Describa su respuesta <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            rows={4}
                                                            value={answers[question.id]?.description || ''}
                                                            onChange={(e) => {
                                                                handleAnswer(
                                                                    question.id,
                                                                    answers[question.id]?.value,
                                                                    e.target.value,
                                                                    answers[question.id]?.files
                                                                );

                                                                // Limpiar error de validación al escribir
                                                                if (e.target.value.trim() !== '') {
                                                                    setValidationErrors(prev => {
                                                                        const newErrors = { ...prev };
                                                                        delete newErrors[`description-${question.id}`];
                                                                        return newErrors;
                                                                    });
                                                                }
                                                            }}
                                                            disabled={isEvaluador || (!isExporter && !isEvaluador) || company.estado_eval === 'evaluacion-completada' || company.estado_eval === 'evaluado'}
                                                            maxLength={240}
                                                            className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 resize-none disabled:bg-gray-100 disabled:text-gray-500 ${validationErrors[`description-${question.id}`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                                                }`}
                                                            placeholder="Escriba aquí..."
                                                        />
                                                        {validationErrors[`description-${question.id}`] && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {validationErrors[`description-${question.id}`]}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* FileManager con archivos existentes */}
                                                    <div className="w-full md:w-1/2 space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Documentos de evidencia <span className="text-red-500">*</span>
                                                        </label>
                                                        <FileManager
                                                            files={answers[question.id]?.files || []}
                                                            questionId={question.id}
                                                            maxFiles={3}
                                                            maxSize={2097152} // 2MB
                                                            acceptedTypes=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                            errorMessages={{
                                                                maxFiles: 'Solo se permite subir hasta 3 archivos por pregunta',
                                                                maxSize: 'El archivo excede el tamaño máximo permitido (2MB)',
                                                                fileType: 'Tipo de archivo no permitido. Solo se permiten archivos jpg, jpeg, png, pdf, excel y word.'
                                                            }}
                                                            onFileSelect={(file) => {
                                                                if (!isEvaluador && isExporter) {
                                                                    const currentFiles = answers[question.id]?.files || [];
                                                                    handleAnswer(
                                                                        question.id,
                                                                        answers[question.id]?.value,
                                                                        answers[question.id]?.description,
                                                                        [...currentFiles, file]
                                                                    );
                                                                }
                                                            }}
                                                            onFileRemove={async (fileToRemove) => {
                                                                if (!isEvaluador && isExporter) {
                                                                    const currentFiles = answers[question.id]?.files || [];
                                                                    const updatedFiles = currentFiles.filter(f =>
                                                                        f.path ? f.path !== fileToRemove.path : f !== fileToRemove
                                                                    );

                                                                    handleAnswer(
                                                                        question.id,
                                                                        answers[question.id]?.value,
                                                                        answers[question.id]?.description,
                                                                        updatedFiles
                                                                    );
                                                                }
                                                            }}
                                                            readOnly={isEvaluador || (!isExporter && !isEvaluador) || company.estado_eval === 'evaluacion-completada' || company.estado_eval === 'evaluado'}
                                                        />
                                                        {validationErrors[`files-${question.id}`] && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {validationErrors[`files-${question.id}`]}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Checkbox de aprobación para evaluadores */}
                                                {isEvaluador && (
                                                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 space-y-4">
                                                        <label className="text-sm font-medium text-gray-900">
                                                            ¿Indicador aprobado?
                                                        </label>
                                                        <div className="flex gap-4">
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`approval-${question.id}`}
                                                                    checked={approvals[question.id] === true}
                                                                    onChange={() => handleApproval(question.id, true)}
                                                                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                                />
                                                                <span className="text-gray-900">Sí</span>
                                                            </label>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`approval-${question.id}`}
                                                                    checked={approvals[question.id] === false}
                                                                    onChange={() => handleApproval(question.id, false)}
                                                                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                                />
                                                                <span className="text-gray-900">No</span>
                                                            </label>
                                                        </div>

                                                        <div className="mt-4">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Comentario del evaluador
                                                            </label>
                                                            <textarea
                                                                rows={3}
                                                                value={answers[question.id]?.evaluator_comment || ''}
                                                                onChange={(e) => handleAnswer(
                                                                    question.id,
                                                                    answers[question.id]?.value,
                                                                    answers[question.id]?.description,
                                                                    answers[question.id]?.files,
                                                                    e.target.value
                                                                )}
                                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 resize-none"
                                                                placeholder="Agregue un comentario sobre su evaluación..."
                                                            />
                                                        </div>

                                                        {(approvals[question.id] !== undefined || answers[question.id]?.evaluator_comment) && (
                                                            <div className="mt-4 p-3 bg-white rounded-lg border border-green-100">
                                                                <div className="text-sm text-gray-600">
                                                                    <span className="font-medium">Estado del indicador: </span>
                                                                    {approvals[question.id] ? (
                                                                        <span className="text-green-600 font-medium">Aprobado</span>
                                                                    ) : (
                                                                        <span className="text-red-600 font-medium">No aprobado</span>
                                                                    )}
                                                                </div>
                                                                {answers[question.id]?.evaluator_comment && (
                                                                    <div className="mt-2">
                                                                        <span className="text-sm font-medium text-gray-600">Comentario previo: </span>
                                                                        <p className="mt-1 text-sm text-gray-600">
                                                                            {answers[question.id].evaluator_comment}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botones de navegación */}
                        <div className="mt-8 flex justify-between">
                            {currentSubcategoryIndex > 0 && (
                                <button
                                    onClick={handleBack}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                                >
                                    Anterior
                                </button>
                            )}
                            <div className="ml-auto">
                                <button
                                    onClick={isLastSubcategory ? handleFinish : handleContinue}
                                    disabled={(isLastSubcategory ? !areAllQuestionsAnswered() : !areCurrentSubcategoryQuestionsAnswered()) || loading}
                                    className={`inline-flex items-center px-4 py-2 rounded-md ${(isLastSubcategory ? !areAllQuestionsAnswered() : !areCurrentSubcategoryQuestionsAnswered()) || loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                        } text-white`}
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
                                        isLastSubcategory ? 'Finalizar' : 'Continuar'
                                    )}
                                </button>
                            </div>
                        </div>

                        {!areCurrentSubcategoryQuestionsAnswered() && (
                            <p className="text-sm text-red-600 mt-2">
                                Debes completar todos los campos requeridos de esta sección antes de continuar (respuesta, descripción y evidencias)
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Confirmar envío
                                    </h3>
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Contenido */}
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">
                                        ¿Estás seguro de que deseas finalizar y enviar tus respuestas?
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleConfirmSubmit}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        disabled={loading}
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
                                            'Confirmar'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast notification */}
            {notification && (
                <Toast
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </DashboardLayout>
    );
}