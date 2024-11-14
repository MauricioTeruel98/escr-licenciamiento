import { useForm } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";

export default function Evaluation({ userName, pendingRequests, isAdmin }) {
    const { post } = useForm();

    // Componente para las solicitudes pendientes
    const PendingRequestsAlert = () => {
        if (!isAdmin || !pendingRequests || pendingRequests.length === 0) return null;

        return (
            <div className="card bg-white shadow mb-8">
                <div className="card-body">
                    <h2 className="card-title text-xl mb-4">Solicitudes de Acceso Pendientes</h2>
                    <div className="space-y-4">
                        {pendingRequests.map((request) => (
                            <div key={request.id} 
                                className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                                <div className="space-y-1">
                                    <p className="font-medium">{request.name}</p>
                                    <p className="text-sm text-gray-600">{request.email}</p>
                                    <p className="text-xs text-gray-500">
                                        Solicitud recibida: {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => post(route('user.approve', request.id))}
                                        className="btn btn-success bg-green-700 text-white hover:bg-green-800"
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => post(route('user.reject', request.id))}
                                        className="btn btn-error bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout userName={userName} title="Autoevaluación de Buzz">
            <div className="space-y-8">
                {/* Alerta de solicitudes pendientes */}
                <PendingRequestsAlert />

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