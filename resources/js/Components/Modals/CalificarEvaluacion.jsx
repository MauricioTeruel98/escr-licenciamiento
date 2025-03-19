import { X } from 'lucide-react';

export default function CalificarEvaluacionModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    status = 'initial', 
    isProcessing = false,
    title = "Calificar evaluación",
    message = "¿Está seguro que desea calificar la evaluación de esta empresa?",
    successMessage = "¡Evaluación calificada con éxito!"
}) {
    if (!isOpen) return null;

    // Contenido según el estado
    const getContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <>
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 mb-4">
                            <svg className="animate-spin h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Procesando su solicitud
                        </h3>
                        <p className="text-sm text-gray-500">
                            Por favor espere un momento...
                        </p>
                    </>
                );
            case 'completed':
                return (
                    <>
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {successMessage}
                        </h3>
                    </>
                );
            default:
                return (
                    <>
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 mb-4">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {message}
                        </p>
                    </>
                );
        }
    };

    // Botones según el estado
    const getButtons = () => {
        switch (status) {
            case 'processing':
                return null; // Sin botones durante el procesamiento
            case 'completed':
                return (
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex w-full justify-center rounded-md bg-green-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 sm:ml-3 sm:w-auto"
                    >
                        Aceptar
                    </button>
                );
            default: // 'initial'
                return (
                    <>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className="inline-flex w-full justify-center rounded-md bg-green-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Aceptar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        {/* Header con botón de cerrar (solo visible en estado inicial o completado) */}
                        {status !== 'processing' && (
                            <div className="absolute right-0 top-0 pr-4 pt-4">
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500"
                                    disabled={isProcessing}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        )}

                        {/* Contenido */}
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="flex flex-col items-center justify-center text-center">
                                {getContent()}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            {getButtons()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}