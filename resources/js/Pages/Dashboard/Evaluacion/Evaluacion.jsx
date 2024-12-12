import DashboardLayout from '@/Layouts/DashboardLayout';
import StepIndicator from '@/Components/StepIndicator';
import FileManager from '@/Components/FileManager';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Evaluacion({ valueData, userName }) {
    const [currentSubcategoryIndex, setCurrentSubcategoryIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    const subcategories = valueData.subcategories;
    const isLastSubcategory = currentSubcategoryIndex === subcategories.length - 1;

    // Configuración de steps igual que en Indicadores
    const steps = subcategories.map(subcategory => ({
        title: subcategory.name.split(' ')[0],
        subtitle: subcategory.name.split(' ').slice(1).join(' ')
    }));

    console.log(subcategories);

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

    const handleAnswer = (questionId, value, description = '', files = []) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: { value, description, files }
        }));
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
                                                            onChange={(e) => handleAnswer(question.id, e.target.value)}
                                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                        />
                                                        <span className="text-gray-900">Sí</span>
                                                    </label>

                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value="0"
                                                            onChange={(e) => handleAnswer(question.id, e.target.value)}
                                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                        />
                                                        <span className="text-gray-900">No</span>
                                                    </label>
                                                </div>

                                                {/* Descripción y Archivos */}
                                                <div className='flex flex-col md:flex-row md:items-start gap-4'>
                                                    <div className="w-full md:w-1/2 space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Describa su respuesta <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            rows={4}
                                                            onChange={(e) => handleAnswer(
                                                                question.id,
                                                                answers[question.id]?.value,
                                                                e.target.value,
                                                                answers[question.id]?.files
                                                            )}
                                                            maxLength={100}
                                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 resize-none"
                                                            placeholder="Escriba aquí..."
                                                        />
                                                    </div>

                                                    <div className="w-full md:w-1/2 space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Documentos de evidencia <span className="text-red-500">*</span>
                                                        </label>
                                                        <FileManager
                                                            files={answers[question.id]?.files || []}
                                                            onFileSelect={(file) => {
                                                                const currentFiles = answers[question.id]?.files || [];
                                                                handleAnswer(
                                                                    question.id,
                                                                    answers[question.id]?.value,
                                                                    answers[question.id]?.description,
                                                                    [...currentFiles, file]
                                                                );
                                                            }}
                                                            onFileRemove={(fileToRemove) => {
                                                                const currentFiles = answers[question.id]?.files || [];
                                                                handleAnswer(
                                                                    question.id,
                                                                    answers[question.id]?.value,
                                                                    answers[question.id]?.description,
                                                                    currentFiles.filter(f => f !== fileToRemove)
                                                                );
                                                            }}
                                                            maxFiles={5}
                                                            maxSize={5242880}
                                                            acceptedTypes=".pdf,.doc,.docx,.xls,.xlsx"
                                                        />
                                                    </div>
                                                </div>
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
                                    //onClick={isLastSubcategory ? handleFinish : handleContinue}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                >
                                    {isLastSubcategory ? 'Finalizar' : 'Continuar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}