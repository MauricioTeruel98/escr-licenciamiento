import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";
import { CircleArrowDown, CircleArrowRight } from 'lucide-react';
import { useState } from 'react';

// Componente FAQ actualizado
const FAQSection = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            id: 'faq-1',
            question: '¿En qué consiste la auto-evaluación?',
            answer: 'Esta plataforma está diseñada para que las empresas puedan medir la nota que obtendrían en este momento para aplicar por el proceso de licenciamiento de esencial COSTA RICA.'
        },
        {
            id: 'faq-2',
            question: '¿Cómo guardo mi progreso respondiendo la auto-evaluación?',
            answer: 'El progreso se guarda automáticamente mientras respondes las preguntas. Puedes cerrar la sesión y volver más tarde para continuar desde donde lo dejaste.'
        },
        {
            id: 'faq-3',
            question: '¿Puede otro usuario en la empresa colaborar con las respuestas?',
            answer: 'Sí, múltiples usuarios de la misma empresa pueden colaborar en completar la auto-evaluación. Cada usuario debe tener su propia cuenta asociada a la empresa.'
        },
        {
            id: 'faq-4',
            question: '¿Hay indicadores más importantes que otros?',
            answer: 'Sí, algunos indicadores tienen mayor peso en la evaluación final. Estos están claramente marcados durante el proceso de auto-evaluación.'
        },
        {
            id: 'faq-5',
            question: '¿Puedo homologar certificaciones previas de mi empresa?',
            answer: 'Sí, si tu empresa cuenta con certificaciones previas, puedes solicitar su homologación. Esto puede ayudar a acelerar el proceso de evaluación.'
        }
    ];

    return (
        <div className="card-body">
            <h2 className="card-title mb-4">Preguntas frecuentes</h2>
            <div className="space-y-2">
                {faqs.map((faq) => (
                    <div
                        key={faq.id}
                        className="border rounded-lg overflow-hidden"
                    >
                        <button
                            className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 focus:outline-none"
                            onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                        >
                            <span className="text-lg font-medium">{faq.question}</span>
                            <svg
                                className={`w-5 h-5 transition-transform duration-200 ${openFaq === faq.id ? 'transform rotate-180' : ''
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        <div
                            className={`transition-all duration-200 ${openFaq === faq.id
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="p-4 border-t bg-gray-50">
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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

                <div className="">
                    <p className="text-3xl font-bold">¡Bienvenido {userName}!</p>
                </div>

                {/* Status Banner */}
                <div className="text-red-500 font-medium text-md">
                    ESTATUS: NO APTO PARA LICENCIAMIENTO
                </div>

                <h1 className="text-4xl font-bold">
                    Autoevaluación de Buzz
                </h1>

                <div className="card bg-white shadow">
                    <div className="card-body">
                        <h2 className="card-title">Estos son los pasos para licenciarse</h2>
                    </div>
                    <div className="card-body">
                        <div className='flex flex-col md:flex-row items-center justify-between w-full px-8 gap-4'>
                            <div className='flex flex-col items-center gap-2 text-green-700'>
                                <img src="/assets/img/icons-home/check.png" alt="Check" />
                                <h2 className='w-[80%] text-center'>Evaluación</h2>
                            </div>
                            <div className='md:hidden' style={{ color: '#157f3d' }}>
                                <CircleArrowDown />
                            </div>
                            <div className='hidden md:block' style={{ color: '#157f3d' }}>
                                <CircleArrowRight />
                            </div>
                            <div className='flex flex-col items-center gap-2 text-green-700'>
                                <img src="/assets/img/icons-home/list.png" alt="List" />
                                <h2 className='w-[80%] text-center'>Autoevaluación rápida</h2>
                            </div>
                            <div className='md:hidden' style={{ color: '#157f3d' }}>
                                <CircleArrowDown />
                            </div>
                            <div className='hidden md:block' style={{ color: '#157f3d' }}>
                                <CircleArrowRight />
                            </div>
                            <div className='flex flex-col items-center gap-2 text-green-700'>
                                <img src="/assets/img/icons-home/archive.png" alt="Archive" />
                                <h2 className='w-[80%] text-center'>Consultar los requisitos</h2>
                            </div>
                            <div className='md:hidden' style={{ color: '#157f3d' }}>
                                <CircleArrowDown />
                            </div>
                            <div className='hidden md:block' style={{ color: '#157f3d' }}>
                                <CircleArrowRight />
                            </div>
                            <div className='flex flex-col items-center gap-2 text-green-700'>
                                <img src="/assets/img/icons-home/calendar.png" alt="Calendar" />
                                <h2 className='w-[80%] text-center'>Pedir una cita de certificación</h2>
                            </div>
                            <div className='md:hidden' style={{ color: '#157f3d' }}>
                                <CircleArrowDown />
                            </div>
                            <div className='hidden md:block' style={{ color: '#157f3d' }}>
                                <CircleArrowRight />
                            </div>
                            <div className='flex flex-col items-center gap-2 text-green-700'>
                                <img src="/assets/img/icons-home/doc.png" alt="Doc" />
                                <h2 className='w-[80%] text-center'>Enviar los documentos</h2>
                            </div>
                            <div className='md:hidden' style={{ color: '#157f3d' }}>
                                <CircleArrowDown />
                            </div>
                            <div className='hidden md:block' style={{ color: '#157f3d' }}>
                                <CircleArrowRight />
                            </div>
                            <div className='flex flex-col items-center gap-2 text-green-700'>
                                <img src="/assets/img/icons-home/timber.png" alt="Timber" />
                                <h2 className='w-[80%] text-center'>Notificación de aceptación</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">

                        {/* Progress Section */}
                        <div className="card bg-white shadow">
                            <div className="card-body">
                                <h2 className="card-title">Progreso</h2>
                                <progress
                                    className="progress progress-success bg-green-100"
                                    value="12"
                                    max="100"
                                ></progress>
                                <div className="mt-4">
                                    <div className='bg-green-100/50 p-4 rounded-lg'>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check text-green-700"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                            </div>
                                            <span className='text-green-700'>4 indicadores contestados</span>
                                        </div>
                                        <p className="text-sm text-green-700 mt-1">
                                            Quedan 100 indicadores por responder
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Indicators Section */}
                        <div className="card bg-white shadow">
                            <div className="card-body">
                                <h2 className="card-title">Indicadores homologados</h2>
                                <div className="mt-4">
                                    <div className='bg-blue-100/50 p-4 rounded-lg'>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check text-blue-700"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                            </div>
                                            <span className='text-blue-700'>8 indicadores homologados</span>
                                        </div>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Si su empresa cuenta con certificaciones previas, puede optar por homologarlas.
                                        </p>
                                    </div>
                                    <Link href={route('certifications.create')}
                                        className="inline-block px-4 py-3 mt-4 text-sm border border-gray-200 rounded-md hover:bg-gray-50">
                                        Agregar Certificaciones
                                    </Link>
                                </div>
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
                            <hr className="border-t-2" />
                            <FAQSection />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 