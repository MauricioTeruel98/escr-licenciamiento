import DashboardLayout from '@/Layouts/DashboardLayout';
import StepIndicator from '@/Components/StepIndicator';

export default function Evaluacion() {
    // Datos de ejemplo
    const steps = [
        { title: 'Paso 1', subtitle: 'Información General' },
        { title: 'Paso 2', subtitle: 'Evaluación' },
        { title: 'Paso 3', subtitle: 'Resultados' }
    ];

    return (
        <DashboardLayout title="Evaluación">
            <div className="space-y-8">
                {/* Encabezado y Métricas */}
                <div className="lg:flex justify-between items-center gap-8">
                    <div className="lg:w-1/2">
                        <div className="flex items-center mt-5">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-blue-600/20 flex items-center gap-2">
                                Evaluación en Proceso
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg>
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
                            currentStep={0}
                            onStepClick={() => {}}
                        />
                    </div>

                    <div className='mt-16'>
                        <h2 className='text-gray-500 font-semibold'>
                            Información General
                        </h2>

                        <div className="mt-10 space-y-6">
                            {/* Aquí irá el contenido específico de cada paso */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-600">
                                    Contenido del paso actual...
                                </p>
                            </div>
                        </div>

                        {/* Botones de navegación */}
                        <div className="mt-8 flex justify-between">
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                Anterior
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}