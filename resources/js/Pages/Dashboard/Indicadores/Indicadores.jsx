import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import StepIndicator from '@/Components/StepIndicator';
import IndicatorIndex from '@/Components/IndicatorIndex';
import Toast from '@/Components/Toast';

export default function Indicadores({ valueData, userName, savedAnswers }) {
    const [currentSubcategoryIndex, setCurrentSubcategoryIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (savedAnswers) {
            const formattedAnswers = {};
            savedAnswers.forEach(answer => {
                formattedAnswers[answer.indicator_id] = answer.answer;
            });
            setAnswers(formattedAnswers);
            console.log('Respuestas cargadas de la BD:', formattedAnswers);
        }
    }, [savedAnswers]);

    useEffect(() => {
        if (Object.keys(answers).length > 0) {
            localStorage.setItem(`answers_${valueData.id}`, JSON.stringify(answers));
        }
    }, [answers, valueData.id]);

    const subcategories = valueData.subcategories;
    const isLastSubcategory = currentSubcategoryIndex === subcategories.length - 1;

    const steps = subcategories.map(subcategory => ({
        title: subcategory.name.split(' ')[0],
        subtitle: subcategory.name.split(' ').slice(1).join(' ')
    }));

    const handleAnswer = (indicatorId, answer) => {
        if (!indicatorId) {
            console.error('ID del indicador no válido');
            return;
        }

        console.log('Guardando respuesta:', { indicatorId, answer, tipo: typeof answer });
        setAnswers(prevAnswers => {
            const newAnswers = {
                ...prevAnswers,
                [indicatorId]: answer
            };
            console.log('Nuevo estado de respuestas:', newAnswers);
            return newAnswers;
        });
    };

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

        router.post(route('indicadores.store-answers'), formData, {
            preserveScroll: true,
            onSuccess: (response) => {
                localStorage.removeItem(`answers_${valueData.id}`);
                setNotification({
                    type: 'success',
                    message: '¡Respuestas guardadas exitosamente!'
                });
                setShowConfirmModal(false);
            },
            onError: (errors) => {
                console.error('Error al guardar:', errors);
                setNotification({
                    type: 'error',
                    message: 'Error al guardar las respuestas. Por favor intenta nuevamente.'
                });
                setShowConfirmModal(false);
            }
        });
    };

    return (
        <DashboardLayout userName={userName} title="Indicadores">
            <div className="space-y-8">
                <div className="lg:flex justify-between items-center gap-8">
                    <div className="lg:w-1/2">
                        <div className="flex items-center mt-5">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-blue-600/20 flex items-center gap-2">
                                {Object.keys(answers).length} Indicadores contestados
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
                                <div className="w-1/2 rounded-l-xl bg-yellow-100/50 px-6 p-4">
                                    <h2 className="text-lg text-yellow-700 font-semibold mb-2">Nota</h2>
                                    <p className="text-2xl text-yellow-500 font-bold">0/100</p>
                                </div>
                                <div className="w-1/2 rounded-e-xl bg-green-800 px-6 p-4">
                                    <h2 className="text-lg text-green-200 font-semibold mb-2">Nota minima</h2>
                                    <p className="text-2xl text-green-200 font-bold">{valueData.minimum_score}</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mt-5">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check text-green-700"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                    </div>
                                    <span className='text-green-700'>
                                        0 indicadores contestados
                                    </span>
                                </div>
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
                                        onAnswer={(answer) => handleAnswer(indicator.id, answer)}
                                        value={answers[indicator.id] || ''} // Aseguramos que value siempre tenga un valor
                                    />
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