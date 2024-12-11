import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

export default function ViewQuestionsModal({ isOpen, onClose, indicator }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Detalles del indicador</h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Contenido */}
                                <div className="px-6 py-4">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        {/* Pregunta de autoevaluación */}
                                        {indicator?.self_evaluation_question && (
                                            <div>
                                                <h4 className="text-base font-medium text-gray-900">Pregunta de autoevaluación:</h4>
                                                <p className="mt-1 text-sm text-gray-500">{indicator.self_evaluation_question}</p>
                                            </div>
                                        )}

                                        {/* Preguntas de evaluación */}
                                        {indicator?.evaluation_questions?.length > 0 && (
                                            <div>
                                                <h4 className="text-base font-medium text-gray-900">Preguntas de evaluación:</h4>
                                                <ul className="mt-2 space-y-2 list-disc pl-5">
                                                    {indicator.evaluation_questions.map((question, index) => (
                                                        <li key={index} className="text-sm text-gray-500">{question.question}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Guía */}
                                        {indicator?.guide && (
                                            <div className="sm:col-span-2">
                                                <h4 className="text-base font-medium text-gray-900">Guía:</h4>
                                                <p className="mt-1 text-sm text-gray-500">{indicator.guide}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 