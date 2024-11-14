import DashboardLayout from "@/Layouts/DashboardLayout";

export default function Evaluation({ userName }) {
    return (
        <DashboardLayout userName={userName} title="Autoevaluación de Buzz">
            <div className="space-y-8">
                {/* Status Banner */}
                <div className="text-red-500 font-medium">
                    ESTATUS: NO APTO PARA LICENCIAMIENTO
                </div>

                <h1 className="text-2xl font-bold">
                    Autoevaluación de Buzz
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Progress Section */}
                        <div className="card bg-white shadow">
                            <div className="card-body">
                                <h2 className="card-title">Progreso</h2>
                                <progress 
                                    className="progress progress-success" 
                                    value="12" 
                                    max="100"
                                ></progress>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="badge badge-success badge-outline">✓</div>
                                        <span>4 indicadores contestados</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Quedan 100 indicadores por responder
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Indicators Section */}
                        <div className="card bg-white shadow">
                            <div className="card-body">
                                <h2 className="card-title">Indicadores homologados</h2>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="badge badge-success badge-outline">✓</div>
                                        <span>8 indicadores homologados</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Si su empresa cuenta con certificaciones previas, puede optar por homologarlas.
                                    </p>
                                </div>
                                <button className="btn btn-outline mt-4">
                                    Agregar Certificaciones
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <div className="card bg-white shadow">
                            <div className="card-body">
                                <h2 className="card-title">Sobre la plataforma de auto-evaluación</h2>
                                <p className="text-gray-600">
                                    Esta plataforma está diseñada para que las empresas puedan medir la nota que obtendrían en este momento para aplicar por el proceso de licenciamiento de esencial COSTA RICA.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-white shadow">
                            <div className="card-body">
                                <h2 className="card-title">Preguntas frecuentes</h2>
                                <div className="join join-vertical w-full">
                                    <div className="collapse collapse-arrow join-item border border-base-200">
                                        <input type="radio" name="my-accordion-4" /> 
                                        <div className="collapse-title">
                                            ¿En qué consiste la auto-evaluación?
                                        </div>
                                        <div className="collapse-content">
                                            <p>Esta plataforma está diseñada para que las empresas puedan medir la nota que obtendrían en este momento para aplicar por el proceso de licenciamiento de esencial COSTA RICA.</p>
                                        </div>
                                    </div>
                                    {/* Más preguntas frecuentes aquí */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 