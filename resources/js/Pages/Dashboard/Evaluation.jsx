import { Link, useForm, usePage, router } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";
import { CircleArrowDown, CircleArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import ApplicationModal from '@/Components/Modals/ApplicationModal';
import axios from 'axios';
import FinalizarAutoevaluacionModal from '@/Components/Modals/FinalizarAutoevaluacionModal';
import FinalizarEvaluacionModal from '@/Components/Modals/FinalizarEvaluacionModal';

// Componente de notificación simple
const Notification = ({ type, message, onClose }) => {
    if (!message) return null;

    const bgColor = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700';

    return (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded border ${bgColor} max-w-md z-50`} role="alert">
            <strong className="font-bold">{type === 'error' ? 'Error: ' : 'Éxito: '}</strong>
            <span className="block sm:inline">{message}</span>
            <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={onClose}
            >
                <span className="text-2xl">&times;</span>
            </button>
        </div>
    );
};

// Componente FAQ actualizado
const FAQSection = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            id: 'faq-1',
            question: '¿En qué consiste la autoevaluación?',
            answer: 'Esta plataforma está diseñada para que las empresas puedan medir la nota que obtendrían en este momento para aplicar por el proceso de licenciamiento de esencial COSTA RICA.'
        },
        {
            id: 'faq-2',
            question: '¿Cómo guardo mi progreso respondiendo la autoevaluación?',
            answer: 'El progreso se guarda automáticamente mientras respondes las preguntas. Puedes cerrar la sesión y volver más tarde para continuar desde donde lo dejaste.'
        },
        {
            id: 'faq-3',
            question: '¿Puede otro usuario en la empresa colaborar con las respuestas?',
            answer: 'Sí, múltiples usuarios de la misma empresa pueden colaborar en completar la autoevaluación. Cada usuario debe tener su propia cuenta asociada a la empresa.'
        },
        {
            id: 'faq-4',
            question: '¿Hay indicadores más importantes que otros?',
            answer: 'Sí, algunos indicadores tienen mayor peso en la evaluación final. Estos están claramente marcados durante el proceso de autoevaluación.'
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
    indicadoresHomologados,
    progreso,
    progresoEvaluacion,
    numeroDePreguntasQueVaAResponderLaEmpresa,
    numeroDePreguntasQueRespondioLaEmpresa,
    companyName,
    status,
    failedBindingIndicators,
    failedValues,
    autoEvaluationResult,
    company,
    preguntasDescalificatoriasRechazadas
}) {
    const { post } = useForm();
    const { auth, flash } = usePage().props;

    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isFinalizarAutoevaluacionModalOpen, setIsFinalizarAutoevaluacionModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);
    const [modalStatus, setModalStatus] = useState('initial');
    const [isFinalizarEvaluacionModalOpen, setIsFinalizarEvaluacionModalOpen] = useState(false);

    useEffect(() => {
        /*
        if (flash.error) {
            console.log('error', flash.error)
            setNotification({
                type: 'error',
                message: flash.error
            });
        }
        if (flash.success) {
            console.log('success', flash.success)
            setNotification({
                type: 'success',
                message: flash.success
            });
        }
        */
    }, [flash]);

    useEffect(() => {
        history.replaceState(null, '', '/dashboard');
    }, []);


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

    // Función para abrir el modal de confirmación
    const openFinalizarModal = () => {
        setModalStatus('initial');
        setIsFinalizarAutoevaluacionModalOpen(true);
    };

    // Función para confirmar y enviar la autoevaluación
    const confirmFinalizarAutoevaluacion = async () => {
        try {
            setModalStatus('processing');
            setIsSubmitting(true);

            const response = await axios.post(route('indicadores.finalizar-autoevaluacion'));

            if (response.data.success) {
                setModalStatus('completed');
                //Recarga la pagina a los 3 segundos
                // Recargar datos necesarios
                router.reload({ only: ['autoEvaluationResult'] });
                router.reload({ only: ['company'] });
            } else {
                throw new Error(response.data.message || 'Error al finalizar la autoevaluación');
            }
        } catch (error) {
            setIsFinalizarAutoevaluacionModalOpen(false);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || error.message || 'Error al finalizar la autoevaluación'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Función para cerrar el modal
    const closeFinalizarModal = () => {
        setIsFinalizarAutoevaluacionModalOpen(false);
        // Resetear el estado del modal para la próxima vez
        setTimeout(() => {
            setModalStatus('initial');
        }, 300);
    };

    const openFinalizarEvaluacionModal = () => {
        setModalStatus('initial');
        setIsFinalizarEvaluacionModalOpen(true);
    };

    const closeFinalizarEvaluacionModal = () => {
        setIsFinalizarEvaluacionModalOpen(false);
        // Resetear el estado del modal para la próxima vez
        setTimeout(() => {
            setModalStatus('initial');
        }, 300);
    };

    const getTextEstadoEval = () => {
        switch (company.estado_eval) {
            case 'auto-evaluacion':
                return "Su empresa se encuentra en autoevaluación"
            case 'auto-evaluacion-completada':
                return "Su empresa se encuentra en revisión por la Marca País"
            case 'evaluacion-completada':
                return "Su empresa se encuentra en revisión por la Marca País"
            case 'evaluado':
                return "Su empresa cuenta con indicadores aptos para iniciar el proceso de licenciamiento."
            case 'evaluacion-desaprobada':
                return "Su empresa fue desaprobada en la evaluación."
            default:
                return "Su empresa cuenta con indicadores aptos para iniciar el proceso de licenciamiento."
        }
    }

    const confirmFinalizarEvaluacion = async () => {
        try {
            setModalStatus('processing');
            setIsSubmitting(true);

            const response = await axios.post(route('indicadores.enviar-evaluacion-completada'));

            if (response.data.success) {
                setModalStatus('completed');
                router.reload({ only: ['autoEvaluationResult'] });
                router.reload({ only: ['company'] });
            } else {
                throw new Error(response.data.message || 'Error al finalizar la evaluación');
            }

        } catch (error) {
            setIsFinalizarEvaluacionModalOpen(false);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || error.message || 'Error al finalizar la evaluación'
            });
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
                                        onClick={() => {
                                            post(route('user.approve', request.id));
                                            window.location.reload();
                                        }}
                                        className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 hover:bg-green-700"
                                        title="Aprobar"
                                    >
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            post(route('user.reject', request.id));
                                            window.location.reload();
                                        }}
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
    const isAuthorizedByAdmin = auth.user.company?.authorized_by_super_admin === 1;

    return (
        <DashboardLayout userName={userName} title={`Autoevaluación de ${companyName}`}>
            {/* {notification && (
                <div className={`fixed top-4 right-4 px-4 py-3 rounded border z-50 ${
                    notification.type === 'error' 
                        ? 'bg-red-100 border-red-400 text-red-700' 
                        : 'bg-green-100 border-green-400 text-green-700'
                }`} role="alert">
                    <strong className="font-bold">
                        {notification.type === 'error' ? 'Error: ' : 'Éxito: '}
                    </strong>
                    <span className="block sm:inline">{notification.message}</span>
                    <button
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setNotification(null)}
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
            )} */}
            <div className="space-y-8">
                {!isExporter && !isEvaluador && !isAuthorizedByAdmin && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    <strong>Atención:</strong> Su empresa debe ser exportadora para poder realizar la auto evaluación. Por favor, actualice la información de su empresa en su perfil.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {!isExporter && !isEvaluador && isAuthorizedByAdmin && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">
                                    <strong>Autorizado:</strong> Su empresa ha sido autorizada por el administrador para realizar la evaluación.
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
                            <>
                                <div className="space-y-4 w-full md:w-2/3">
                                    <div className="">
                                        <p className="text-xl font-semibold">¡Bienvenido/a {userName}!</p>
                                    </div>
                                    <h1 className="text-4xl font-extrabold">
                                        Evaluación de {companyName}
                                    </h1>
                                    <div className={`bg-green-50/50 p-2 rounded-lg ${company.estado_eval == 'evaluacion-desaprobada' ? 'bg-red-50/50' : ''}`}>
                                        <div className="flex items-center justify-start gap-2 mb-5">
                                            <div className="flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon icon-tabler icons-tabler-outline icon-tabler-info-circle ${company.estado_eval == 'evaluacion-desaprobada' ? 'text-red-700' : 'text-green-700'}`}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                                            </div>
                                            <p className={`text-sm font-medium ${company.estado_eval == 'evaluacion-desaprobada' ? 'text-red-700' : 'text-green-700'}`}>
                                                {
                                                    getTextEstadoEval()
                                                }
                                            </p>
                                        </div>
                                        {
                                            company.estado_eval !== 'evaluado' && (
                                                <Link href={route('form.empresa')}
                                                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75"
                                                >
                                                    {autoEvaluationResult.form_sended === 1 ? 'Editar Información de la Empresa' : 'Completar Información de la Empresa'}
                                                </Link>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="w-full md:w-1/3 flex items-center justify-center">
                                    {
                                        autoEvaluationResult.application_sended === 1 && autoEvaluationResult.form_sended === 1
                                        && company.estado_eval == 'auto-evaluacion'
                                        && (
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
                                                        Su empresa puede enviar la Autoevaluación finalizada.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={openFinalizarModal}
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
                                                        'Finalizar Autoevaluación'
                                                    )}
                                                </button>
                                            </div>
                                        )
                                    }

                                    {
                                        company.estado_eval == 'auto-evaluacion' && autoEvaluationResult.form_sended == 0 && (
                                            <div className="space-y-4 bg-amber-50/50 p-4 rounded-lg">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    En espera de información de la empresa
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Debes enviar la información de la empresa para poder enviar la autoevaluación.
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Complete todos los campos obligatorios.
                                                </p>
                                            </div>
                                        )
                                    }
                                    {
                                        company.estado_eval == 'auto-evaluacion-completed' && autoEvaluationResult.form_sended == 1 && (
                                            <div className="space-y-4 bg-amber-50/50 p-4 rounded-lg">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    En espera de autorización
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Debe esperar a que se le autorice para poder realizar la evaluación.
                                                </p>
                                            </div>
                                        )
                                    }

                                    {
                                        company.estado_eval == 'evaluacion' && (
                                            <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 mb-4">
                                                    <svg
                                                        className="h-5 w-5 text-blue-700"
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
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    Evaluación en curso
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Su empresa es apta para realizar la evaluación.
                                                </p>
                                            </div>
                                        )
                                    }

                                    {
                                        company.estado_eval == 'evaluacion-pendiente'
                                        && (
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
                                                        Su empresa puede enviar la Evaluación finalizada.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={openFinalizarEvaluacionModal}
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
                                                        'Finalizar Evaluación'
                                                    )}
                                                </button>
                                            </div>
                                        )
                                    }

                                    {
                                        company.estado_eval == 'evaluacion-completada' && (
                                            <div className="space-y-4 bg-amber-50/50 p-4 rounded-lg">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 mb-4">
                                                    <svg
                                                        className="h-5 w-5 text-amber-700"
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
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    Evaluación completada
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Su empresa ha completado la Evaluación. Debe esperar a que un evaluador califique la evaluación
                                                </p>
                                            </div>
                                        )
                                    }

                                    {
                                        company.estado_eval == 'evaluacion-calificada' && (
                                            <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 mb-4">
                                                    <svg
                                                        className="h-5 w-5 text-blue-700"
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
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    Evaluación en el último paso
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    El evaluador está terminando de calificar la evaluación. Pronto recibirá los resultados.
                                                </p>
                                            </div>
                                        )
                                    }

                                    {
                                        company.estado_eval == 'evaluado' && (
                                            <div className="space-y-4 bg-green-50/50 p-4 rounded-lg">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 mb-4">
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
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    Evaluación calificada
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Su empresa ha sido calificada. Se le ha enviado un correo con los resultados de la evaluación y los siguientes pasos para licenciarse.
                                                </p>
                                                {
                                                    company.evaluation_document_path && (
                                                        <a href={`storage/evaluations/${company.evaluation_document_path}`} className='text-green-700' target="_blank" rel="noopener noreferrer">Descargar documento de evaluación</a>
                                                    )
                                                }
                                            </div>
                                        )
                                    }

                                    {
                                        company.estado_eval == 'evaluacion-desaprobada' && (
                                            <div className="space-y-4 bg-red-50/50 p-4 rounded-lg">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    Evaluación desaprobada
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Su empresa sido calificada pero ha desaprobado los indicadores descalificatorios. Debe ponerse en contacto con <a href="mailto:licenciasmarcapais@procomer.com" className="text-red-500">licencias@marca-pais.com</a> para poder continuar con el proceso de licenciamiento.
                                                </p>
                                            </div>
                                        )
                                    }
                                </div>
                            </>
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
                                                ESTATUS: {status === 'apto' ? 'APTO PARA LICENCIAMIENTO' : 'PROCESO DE LLENADO DE INFORMACIÓN'}
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
                                                                    Valores que no alcanzan la nota mínima requerida
                                                                </h3>
                                                                <div className="mt-2 text-sm text-red-700">
                                                                    <ul className="list-disc pl-5 space-y-1">
                                                                        {failedValues.map((value, index) => (
                                                                            <li key={index}>
                                                                                <span className="font-medium">{value.name}:</span> Nota actual: {value.nota}%
                                                                                <span className="text-red-600"> (Nota mínima requerida: {value.nota_minima}%)</span>
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

                <div>
                    {
                        (company.estado_eval === 'evaluacion-completada' || company.estado_eval === 'evaluado' || company.estado_eval === 'evaluacion-desaprobada') &&
                        preguntasDescalificatoriasRechazadas &&
                        preguntasDescalificatoriasRechazadas.length > 0 && (
                            <div className="card bg-white shadow mt-8">
                                <div className="card-body">
                                    <h2 className="card-title text-red-600 flex items-center gap-2">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        Indicadores Descalificatorios No Aprobados
                                    </h2>
                                    <div className="mt-4 space-y-4">
                                        {preguntasDescalificatoriasRechazadas.map((pregunta, index) => (
                                            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <h3 className="font-medium text-red-800">
                                                    Indicador: {pregunta.indicator_name}
                                                </h3>
                                                <p className="mt-2 text-sm text-red-700">
                                                    Pregunta: {pregunta.question}
                                                </p>
                                                {pregunta.evaluator_comment && (
                                                    <div className="mt-2 text-sm">
                                                        <span className="font-medium text-red-800">Comentario del evaluador: </span>
                                                        <span className="text-red-700">{pregunta.evaluator_comment}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {/* <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                                            <p className="text-sm text-red-800 font-medium">
                                                Importante: Los indicadores descalificatorios no aprobados impiden que la empresa pueda obtener la licencia.
                                                Por favor, revise los comentarios del evaluador y tome las acciones necesarias.
                                            </p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
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

                        {/* Progress evaluation Section */}
                        {
                            (company.estado_eval != 'auto-evaluacion' && company.estado_eval != 'auto-evaluacion-completed') && (
                                <div className="card bg-white shadow">
                                    <div className="card-body">
                                        <h2 className="card-title">Progreso evaluación</h2>
                                        <progress
                                            className="progress progress-success bg-green-100"
                                            value={progresoEvaluacion}
                                            max="100"
                                        ></progress>
                                        <p className="text-sm text-green-700 mt-1">
                                            {progresoEvaluacion.toFixed(0)}%
                                        </p>
                                        <div className="mt-4">
                                            <div className='bg-green-100/50 p-4 rounded-lg'>
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check text-green-700"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                                    </div>
                                                    <span className='text-green-700'>
                                                        {numeroDePreguntasQueRespondioLaEmpresa} preguntas contestadas
                                                    </span>
                                                </div>
                                                <p className="text-sm text-green-700 mt-1">
                                                    Quedan {numeroDePreguntasQueVaAResponderLaEmpresa - numeroDePreguntasQueRespondioLaEmpresa} preguntas por responder
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {/* Progress Section */}
                        <div className="card bg-white shadow">
                            <div className="card-body">
                                <h2 className="card-title">Progreso autoevaluación</h2>
                                <progress
                                    className="progress progress-success bg-green-100"
                                    value={progreso.toFixed(0)}
                                    max="100"
                                ></progress>
                                {/* Muestra el progreso en porcentaje */}
                                <p className="text-sm text-green-700 mt-1">
                                    {progreso}%
                                </p>

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
                                            <span className='text-blue-700'>{indicadoresHomologados} indicadores homologados</span>
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
                                <h2 className="card-title">Sobre la plataforma de autoevaluación</h2>
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
            <FinalizarAutoevaluacionModal
                isOpen={isFinalizarAutoevaluacionModalOpen}
                onClose={closeFinalizarModal}
                onConfirm={confirmFinalizarAutoevaluacion}
                status={modalStatus}
                isProcessing={isSubmitting}
            />
            <FinalizarEvaluacionModal
                isOpen={isFinalizarEvaluacionModalOpen}
                onClose={closeFinalizarEvaluacionModal}
                onConfirm={confirmFinalizarEvaluacion}
                status={modalStatus}
                isProcessing={isSubmitting}
            />
            <Notification
                type={notification?.type}
                message={notification?.message}
                onClose={() => setNotification(null)}
            />
        </DashboardLayout>
    );
} 