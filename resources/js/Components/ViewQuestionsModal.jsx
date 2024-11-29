import { X } from 'lucide-react';

export default function ViewQuestionsModal({ isOpen, onClose, indicator }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                <div className="relative w-full max-w-2xl transform rounded-lg bg-white shadow-xl transition-all">
                    {/* Header */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                Preguntas del Indicador: {indicator.name}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">
                        {/* Pregunta de Auto-evaluación */}
                        {indicator.self_evaluation_question && (
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Pregunta de Auto-evaluación
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                                    {indicator.self_evaluation_question}
                                </div>
                            </div>
                        )}

                        {/* Preguntas de Evaluación */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                Preguntas de Evaluación
                            </h4>
                            <div className="space-y-3">
                                {indicator.evaluation_questions.map((question, index) => (
                                    <div 
                                        key={index}
                                        className="bg-gray-50 rounded-lg p-3"
                                    >
                                        <span className="text-xs font-medium text-gray-500 block mb-1">
                                            Pregunta {index + 1}
                                        </span>
                                        <p className="text-sm text-gray-700">
                                            {question}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Guía */}
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                Guía
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                                {indicator.guide}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 