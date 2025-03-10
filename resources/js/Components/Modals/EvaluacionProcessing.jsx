
const EvaluacionProcessing = ({ caso }) => {


    const getContent = () => {
        switch (caso) {
            case 'form-empresa':
                return (
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 mb-4">
                            <svg className="animate-spin h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Guardando información de la empresa...
                        </h3>
                        <p className="text-sm text-gray-500">
                            No recargue la página, por favor espere un momento...
                        </p>
                    </div>
                )
            case 'evaluacion':
                return (
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 mb-4">
                            <svg className="animate-spin h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Guardando respuestas...
                        </h3>
                        <p className="text-sm text-gray-500">
                            No recargue la página, por favor espere un momento...
                        </p>
                    </div>
                )
            default:
                return <div>Procesando...</div>
        }
    }

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">

                        {/* Contenido */}
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            {getContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EvaluacionProcessing;
