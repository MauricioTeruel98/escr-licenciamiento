import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import StepIndicator from '@/Components/StepIndicator';
import IndicatorIndex from '@/Components/IndicatorIndex';
import Toast from '@/Components/Toast';
import axios from 'axios';

export default function Indicadores({ valueData, userName, savedAnswers, currentScore: initialScore }) {
    const [currentSubcategoryIndex, setCurrentSubcategoryIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [bindingWarning, setBindingWarning] = useState(false);
    const [currentScore, setCurrentScore] = useState(initialScore);

    const subcategories = valueData.subcategories;
    const isLastSubcategory = currentSubcategoryIndex === subcategories.length - 1;

    const steps = subcategories.map(subcategory => ({
        title: subcategory.name.split(' ')[0],
        subtitle: subcategory.name.split(' ').slice(1).join(' ')
    }));

    const checkBindingAnswers = (currentAnswers) => {
        const hasNegativeBinding = subcategories.some(subcategory =>
            subcategory.indicators.some(indicator =>
                indicator.binding && currentAnswers[indicator.id] === "0"
            )
        );
        setBindingWarning(hasNegativeBinding);
    };

    const calculateCurrentScore = (currentAnswers) => {
        let totalIndicators = 0;
        let positiveAnswers = 0;

        valueData.subcategories.forEach(subcategory => {
            subcategory.indicators.forEach(indicator => {
                totalIndicators++;
                if (currentAnswers[indicator.id] === "1") {
                    positiveAnswers++;
                }
            });
        });

        if (totalIndicators === 0) return 0;
        return Math.round((positiveAnswers / totalIndicators) * 100);
    };

    const handleAnswer = (indicatorId, answer, isBinding) => {
        if (!indicatorId) {
            console.error('ID del indicador no válido');
            return;
        }

        const newAnswers = {
            ...answers,
            [indicatorId]: answer
        };
        setAnswers(newAnswers);

        const newScore = calculateCurrentScore(newAnswers);
        setCurrentScore(newScore);

        if (isBinding) {
            checkBindingAnswers(newAnswers);
        }
    };

    useEffect(() => {
        if (savedAnswers) {
            const formattedAnswers = {};
            savedAnswers.forEach(answer => {
                formattedAnswers[answer.indicator_id] = answer.answer;
            });
            setAnswers(formattedAnswers);
            
            const initialCalculatedScore = calculateCurrentScore(formattedAnswers);
            setCurrentScore(initialCalculatedScore);
            
            checkBindingAnswers(formattedAnswers);
        }
    }, [savedAnswers]);

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

    const handleFinish = () => {
        if (Object.keys(answers).length === 0) {
            setNotification({
                type: 'error',
                message: 'Por favor, responde al menos una pregunta antes de continuar.'
            });
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = () => {
        const formData = {
            value_id: valueData.id,
            answers: answers
        };

        axios.post(route('indicadores.store-answers'), formData)
            .then(response => {
                localStorage.removeItem(`answers_${valueData.id}`);
                setNotification({
                    type: 'success',
                    message: response.data.message
                });
                if (response.data.finalScore !== undefined) {
                    setCurrentScore(response.data.finalScore);
                }
                setShowConfirmModal(false);
            })
            .catch(error => {
                console.error('Error al guardar:', error);
                setNotification({
                    type: 'error',
                    message: error.response?.data?.message || 'Error al guardar las respuestas'
                });
                setShowConfirmModal(false);
            });
    };

    return (
        <DashboardLayout userName={userName} title="Indicadores">
            <div className="space-y-8">
                {/* {bindingWarning && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    Indicadores E1, E2 son descalificatorios.
                                </p>
                            </div>
                        </div>
                    </div>
                )} */}

                <div className="lg:flex justify-between items-center gap-8">
                    <div className="lg:w-1/2">
                        <div className="flex items-center mt-5">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-blue-600/20 flex items-center gap-2">
                                0 Indicadores Homologados
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold mt-3">{valueData.name}</h1>
                        <p className="text-gray-500 mt-2">
                            Para todos los valores, debe responder cada una de las preguntas de los indicadores.
                        </p>
                    </div>
                    <div className="lg:w-1/2 mt-5 lg:mt-0">
                        <div>
                            <div className="flex">
                                <div className={`w-1/2 rounded-l-xl px-6 p-4 ${
                                    bindingWarning 
                                        ? 'bg-red-100/50 text-red-700'
                                        : currentScore >= valueData.minimum_score 
                                            ? 'bg-green-100/50 text-green-700'
                                            : 'bg-yellow-100/50 text-yellow-700'
                                }`}>
                                    <h2 className={`text-lg font-semibold mb-2 ${
                                        bindingWarning 
                                            ? 'text-red-700'
                                            : currentScore >= valueData.minimum_score 
                                                ? 'text-green-700'
                                                : 'text-yellow-700'
                                    }`}>
                                        Nota actual
                                    </h2>
                                    <p className={`text-2xl font-bold ${
                                        bindingWarning 
                                            ? 'text-red-500'
                                            : currentScore >= valueData.minimum_score 
                                                ? 'text-green-500'
                                                : 'text-yellow-500'
                                    }`}>
                                        {currentScore}/100
                                    </p>
                                </div>
                                <div className="w-1/2 rounded-e-xl bg-green-800 px-6 p-4">
                                    <h2 className="text-lg text-green-200 font-semibold mb-2">Nota mínima</h2>
                                    <p className="text-2xl text-green-200 font-bold">
                                        {valueData.minimum_score}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 px-6">
                                {currentScore >= valueData.minimum_score && !bindingWarning ? (
                                    <p className="text-green-600 text-sm font-medium">
                                        ✓ Nota aprobatoria alcanzada
                                    </p>
                                ) : (
                                    <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                                        {bindingWarning && (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        )}
                                        {bindingWarning 
                                            ? "Indicadores E1, E2 son descalificatorios"
                                            : `! Necesitas ${valueData.minimum_score - currentScore} puntos más para aprobar`
                                        }
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-5">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-
tabler icons-tabler-filled icon-tabler-rosette-discount-check text-green-700"><path
                                            stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 
.797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 
3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 
4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 
3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 
.147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 
-3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 
-4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 
1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 
2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 
0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 
-1.32z" /></svg>
                                </div>
                                <span className='text-green-700'>
                                    {Object.keys(answers).length} indicadores contestados
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

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
                                <div key={indicator.id}>
                                    <IndicatorIndex
                                        code={indicator.name}
                                        question={indicator.self_evaluation_question}
                                        onAnswer={(answer) => handleAnswer(indicator.id, answer, indicator.binding)}
                                        value={answers[indicator.id] || ''}
                                        isBinding={indicator.binding}
                                    />
                                    {indicator.binding && (
                                        <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Pregunta vinculante
                                        </div>
                                    )}
                                    <div className="divider"></div>
                                </div>
                            ))}
                        </div>

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
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                        <div className="relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Confirmar envío
                                </h3>
                                <p className="text-sm text-gray-500">
                                    ¿Estás seguro de que deseas finalizar y enviar tus respuestas?
                                </p>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleConfirmSubmit}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                    >
                                        Confirmar
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