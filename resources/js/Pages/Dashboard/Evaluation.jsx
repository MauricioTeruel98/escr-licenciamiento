import { Link, useForm, usePage, router } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";
import { CircleArrowDown, CircleArrowRight } from 'lucide-react';
import { useState } from 'react';
import ApplicationModal from '@/Components/Modals/ApplicationModal';
import axios from 'axios';

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

export default function Evaluation({
    userName,
    pendingRequests,
    isAdmin,
    totalIndicadores,
    indicadoresRespondidos,
    progreso,
    companyName,
    status,
    failedBindingIndicators,
    failedValues,
    autoEvaluationResult
}) {
    const { post } = useForm();
    const { auth } = usePage().props;

    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApplicationSubmit = async () => {
        try {
            setIsSubmitting(true);
            const response = await axios.post(route('evaluation.send-application'));
            if (response.data.message) {
                setIsApplicationModalOpen(true);
                router.reload({ only: ['autoEvaluationResult'] });
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al enviar la solicitud'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadPDF = () => {
        window.open(route('download.indicators.pdf'), '_blank');
    };

    // Componente para las solicitudes pendientes
    const PendingRequestsAlert = () => {
        if (!isAdmin || !pendingRequests || pendingRequests.length === 0) return null;

        return (
            <div className="card bg-white shadow mb-8">
                <div className="card-body">
                    <h2 className="card-title text-xl mb-4">Solicitudes de Acceso Pendientes</h2>
                    <div className="space-y-4">
                        {pendingRequests.map((request) => (
                            <div key={request.id} className="bg-green-100/50 rounded-xl shadow-sm p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {request.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {request.email}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => post(route('user.approve', request.id))}
                                        className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 hover:bg-green-700"
                                        title="Aprobar"
                                    >
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => post(route('user.reject', request.id))}
                                        className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600 hover:bg-red-700"
                                        title="Rechazar"
                                    >
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const isExporter = auth.user.company?.is_exporter === true;
    const isEvaluador = auth.user.role === 'evaluador';

    return (
        <DashboardLayout userName={userName} title={`Autoevaluación de ${companyName}`}>
            <div className="space-y-8">
                {!isExporter && !isEvaluador && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    <strong>Atención:</strong> Su empresa debe ser exportadora para poder realizar la evaluación. Por favor, actualice la información de su empresa en su perfil.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Alerta de solicitudes pendientes */}
                <PendingRequestsAlert />

                <div className="md:flex gap-8">
                    {
                        autoEvaluationResult && autoEvaluationResult.application_sended == 1 && (
                            <div className="space-y-4">
                                <div className="">
                                    <p className="text-xl font-semibold">¡Bienvenido/a {userName}!</p>
                                </div>
                                <h1 className="text-4xl font-extrabold">
                                    Evaluación de {companyName}
                                </h1>
                                <div className='bg-green-50/50 p-2 rounded-lg'>
                                    <div className="flex items-center justify-start gap-2 mb-5">
                                        <div className="flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle text-green-700"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                                        </div>
                                        <p className="text-sm text-green-700 font-medium">
                                            Su empresa cuenta con indicadores aptos para iniciar el proceso de licenciamiento.
                                        </p>
                                    </div>
                                    <Link href={route('form.empresa')}
                                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75"
                                    >
                                        Completar Formulario de Empresa
                                    </Link>
                                </div>
                            </div>
                        )
                    }

                    {
                        (!autoEvaluationResult || autoEvaluationResult.application_sended == 0) && (
                            <>
                                <div className="space-y-4 md:w-2/3">
                                    <div className="">
                                        <p className="text-xl font-semibold">¡Bienvenido/a {userName}!</p>
                                    </div>

                                    {/* Status Banner */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className={`${status === 'apto'
                                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                : 'bg-red-50 text-red-700 ring-red-600/20'
                                                } px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset flex items-center gap-2`}
                                            >
                                                ESTATUS: {status === 'apto' ? 'APTO' : 'NO APTO'} PARA LICENCIAMIENTO
                                            </span>
                                        </div>

                                        {/* Mensajes de error cuando no es apto */}
                                        {status === 'no_apto' && (
                                            <div className="space-y-4">
                                                {/* Mensaje de indicadores vinculantes fallidos */}
                                                {failedBindingIndicators && failedBindingIndicators.length > 0 && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                        <div className="flex">
                                                            <div className="flex-shrink-0">
                                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-3">
                                                                <h3 className="text-sm font-medium text-red-800">
                                                                    Indicadores vinculantes no cumplidos
                                                                </h3>
                                                                <div className="mt-2 text-sm text-red-700">
                                                                    <ul className="list-disc pl-5 space-y-1">
                                                                        {failedBindingIndicators.map((indicator, index) => (
                                                                            <li key={index}>
                                                                                <span className="font-medium">{indicator.name}:</span> {indicator.question}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Mensaje de valores con nota insuficiente */}
                                                {failedValues && failedValues.length > 0 && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                        <div className="flex">
                                                            <div className="flex-shrink-0">
                                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-3">
                                                                <h3 className="text-sm font-medium text-red-800">
                                                                    Valores que no alcanzan la nota mínima requerida (70%)
                                                                </h3>
                                                                <div className="mt-2 text-sm text-red-700">
                                                                    <ul className="list-disc pl-5 space-y-1">
                                                                        {failedValues.map((value, index) => (
                                                                            <li key={index}>
                                                                                <span className="font-medium">{value.name}:</span> Nota actual: {value.nota}%
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-4xl font-bold">
                                        Autoevaluación de {companyName}
                                    </h1>
                                </div>

                                <div className="md:w-1/3">
                                    {/* Mensaje de éxito cuando está apto */}
                                    {status === 'apto' && (
                                        <div className="space-y-4 bg-green-50/50 p-4 rounded-lg">
                                            <div className="flex items-center justify-start gap-2">
                                                <div className="flex-shrink-0">
                                                    <svg
                                                        className="h-5 w-5 text-green-700"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="text-sm text-green-700 font-medium">
                                                    Su empresa cuenta con indicadores aptos para iniciar el proceso de licenciamiento.
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleApplicationSubmit}
                                                disabled={isSubmitting}
                                                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    'Enviar Solicitud De Aplicación'
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )
                    }


                </div>

                <div className="card bg-white shadow">
                    <div className="card-body">
                        <h2 className="card-title">Estos son los pasos para licenciarse</h2>
                    </div>
                    <div className="card-body">
                        <div className='flex flex-col md:flex-row items-start justify-between w-full px-8 gap-4'>
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
                                    value={progreso}
                                    max="100"
                                ></progress>
                                <div className="mt-4">
                                    <div className='bg-green-100/50 p-4 rounded-lg'>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check text-green-700"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                            </div>
                                            <span className='text-green-700'>
                                                {indicadoresRespondidos} indicadores contestados
                                            </span>
                                        </div>
                                        <p className="text-sm text-green-700 mt-1">
                                            Quedan {totalIndicadores - indicadoresRespondidos} indicadores por responder
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botón para descargar PDF de indicadores */}
                        <div className="card bg-white shadow">
                            <div className="card-body">
                                <h2 className="card-title">Descargar Indicadores</h2>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Descargar PDF de Indicadores
                                </button>
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
                                            <span className='text-blue-700'>indicadores homologados</span>
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
            <ApplicationModal
                isOpen={isApplicationModalOpen}
                onClose={() => setIsApplicationModalOpen(false)}
            />
        </DashboardLayout>
    );
} 