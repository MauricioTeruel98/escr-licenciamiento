import DashboardLayout from '@/Layouts/DashboardLayout';
import StepIndicator from '@/Components/StepIndicator';
import FileManager from '@/Components/FileManager';
import Toast from '@/Components/Toast';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Evaluacion({ valueData, userName, savedAnswers, isEvaluador = false }) {
    const [currentSubcategoryIndex, setCurrentSubcategoryIndex] = useState(0);
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
    const [approvals, setApprovals] = useState(() => {
        const initialApprovals = {};
        if (savedAnswers) {
            Object.entries(savedAnswers).forEach(([questionId, answerData]) => {
                initialApprovals[questionId] = answerData.approved || false;
            });
        }
        return initialApprovals;
    });

    const subcategories = valueData.subcategories;
    const isLastSubcategory = currentSubcategoryIndex === subcategories.length - 1;

    // Configuración de steps igual que en Indicadores
    const steps = subcategories.map(subcategory => ({
        title: subcategory.name.split(' ')[0],
        subtitle: subcategory.name.split(' ').slice(1).join(' ')
    }));

    const handleStepClick = (index) => {
        setCurrentSubcategoryIndex(index);
    };

    const handleContinue = () => {
        if (currentSubcategoryIndex < subcategories.length - 1) {
            setCurrentSubcategoryIndex(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentSubcategoryIndex > 0) {
            setCurrentSubcategoryIndex(prev => prev - 1);
        }
    };

    const handleAnswer = (questionId, value, description = '', files = [], evaluator_comment = '') => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: {
                value: value || prev[questionId]?.value,
                description: description || prev[questionId]?.description,
                files: files || prev[questionId]?.files || [],
                evaluator_comment: evaluator_comment || prev[questionId]?.evaluator_comment || ''
            }
        }));
    };

    const handleFinish = () => {
        setShowConfirmModal(true);
    };

    const handleApproval = (questionId, value) => {
        setApprovals(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleConfirmSubmit = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            
            Object.entries(answers).forEach(([questionId, answerData]) => {
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

            const response = await axios.post(route('evaluacion.store-answers'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setNotification({
                    type: 'success',
                    message: response.data.message
                });
                setShowConfirmModal(false);
                
                if (response.data.savedAnswers) {
                    setAnswers(response.data.savedAnswers);
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

    return (
        <DashboardLayout userName={userName} title="Evaluación">
            <div className="space-y-8">
                {/* Encabezado y Métricas */}
                <div className="lg:flex justify-between items-center gap-8">
                    <div className="lg:w-1/2">
                        <div className="flex items-center mt-5">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-blue-600/20 flex items-center gap-2">
                                Evaluación en Proceso
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold mt-3">Proceso de Evaluación</h1>
                        <p className="text-gray-500 mt-2">
                            Complete cada paso del proceso de evaluación para continuar.
                        </p>
                    </div>

                    <div className="lg:w-1/2 mt-5 lg:mt-0">
                        <div>
                            <div className="flex">
                                <div className="w-1/2 rounded-l-xl px-6 p-4 bg-blue-100/50 text-blue-700">
                                    <h2 className="text-lg font-semibold mb-2 text-blue-700">
                                        Progreso actual
                                    </h2>
                                    <p className="text-2xl font-bold text-blue-500">
                                        33%
                                    </p>
                                </div>
                                <div className="w-1/2 rounded-e-xl bg-blue-800 px-6 p-4">
                                    <h2 className="text-lg text-blue-200 font-semibold mb-2">Total pasos</h2>
                                    <p className="text-2xl text-blue-200 font-bold">
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
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

                                                {/* Opciones Si/No */}
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value="1"
                                                            checked={answers[question.id]?.value === "1"}
                                                            onChange={(e) => handleAnswer(question.id, e.target.value)}
                                                            disabled={isEvaluador}
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
                                                            disabled={isEvaluador}
                                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                        />
                                                        <span className="text-gray-900">No</span>
                                                    </label>
                                                </div>

                                                {/* Descripción */}
                                                <div className='flex flex-col md:flex-row md:items-start gap-4'>
                                                    <div className="w-full md:w-1/2 space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Describa su respuesta <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            rows={4}
                                                            value={answers[question.id]?.description || ''}
                                                            onChange={(e) => handleAnswer(
                                                                question.id,
                                                                answers[question.id]?.value,
                                                                e.target.value,
                                                                answers[question.id]?.files
                                                            )}
                                                            disabled={isEvaluador}
                                                            maxLength={100}
                                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 resize-none disabled:bg-gray-100 disabled:text-gray-500"
                                                            placeholder="Escriba aquí..."
                                                        />
                                                    </div>

                                                    {/* FileManager con archivos existentes */}
                                                    <div className="w-full md:w-1/2 space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Documentos de evidencia <span className="text-red-500">*</span>
                                                        </label>
                                                        <FileManager
                                                            files={answers[question.id]?.files || []}
                                                            questionId={question.id}
                                                            onFileSelect={(file) => {
                                                                if (!isEvaluador) {
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
                                                                if (!isEvaluador) {
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
                                                            readOnly={isEvaluador}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Checkbox de aprobación para evaluadores */}
                                                {isEvaluador && (
                                                    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-4">
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
                                                                    className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                                                                />
                                                                <span className="text-gray-900">Sí</span>
                                                            </label>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`approval-${question.id}`}
                                                                    checked={approvals[question.id] === false}
                                                                    onChange={() => handleApproval(question.id, false)}
                                                                    className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
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
                                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 resize-none"
                                                                placeholder="Agregue un comentario sobre su evaluación..."
                                                            />
                                                        </div>
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
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                >
                                    {isLastSubcategory ? 'Finalizar' : 'Continuar'}
                                </button>
                            </div>
                        </div>
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