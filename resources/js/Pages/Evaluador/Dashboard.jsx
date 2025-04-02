import { useState, useEffect, Fragment } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import EvaluadorLayout from '@/Layouts/EvaluadorLayout';
import { Building2, ClipboardList, Users, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import CalificarEvaluacionModal from '@/Components/Modals/CalificarEvaluacion';

export default function EvaluadorDashboard({ auth }) {
    const { flash } = usePage().props;
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [activeCompany, setActiveCompany] = useState(null);
    const [isCompanyAuthorized, setIsCompanyAuthorized] = useState(false);
    const [companyStatusEval, setCompanyStatusEval] = useState(null);
    const [query, setQuery] = useState('');
    const [isFinalizarEvaluacionModalOpen, setIsFinalizarEvaluacionModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('initial');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isCalificarNuevamenteModalOpen, setIsCalificarNuevamenteModalOpen] = useState(false);
    const [evaluationFields, setEvaluationFields] = useState({
        puntos_fuertes: activeCompany?.puntos_fuertes || '',
        oportunidades: activeCompany?.oportunidades || ''
    });

    useEffect(() => {
        fetchCompanies();
        fetchActiveCompany();
    }, []);

    useEffect(() => {
        if (activeCompany) {
            setEvaluationFields({
                puntos_fuertes: activeCompany.puntos_fuertes || '',
                oportunidades: activeCompany.oportunidades || ''
            });
        }
    }, [activeCompany]);

    const filteredCompanies = query === ''
        ? companies
        : companies.filter((company) =>
            company.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/evaluador/companies/list-to-select');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error al cargar empresas:', error);
        }
    };

    const fetchActiveCompany = async () => {
        try {
            const response = await axios.get('/api/evaluador/active-company');
            setActiveCompany(response.data);
            setIsCompanyAuthorized(response.data?.authorized === 1);
            setCompanyStatusEval(response.data?.estado_eval);

            if (response.data) {
                setEvaluationFields({
                    puntos_fuertes: response.data.puntos_fuertes || '',
                    oportunidades: response.data.oportunidades || ''
                });
            }
        } catch (error) {
            console.error('Error al cargar empresa activa:', error);
        }
    };

    const handleCompanyChange = async (companyId) => {
        try {
            await axios.post('/api/evaluador/switch-company', {
                company_id: companyId
            });
            if (companyId) {
                window.location.href = route('evaluador.dashboard');
            } else {
                setActiveCompany(null);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al cambiar de empresa:', error);
        }
    };

    const openFinalizarEvaluacionModal = () => {
        setModalStatus('initial');
        setIsFinalizarEvaluacionModalOpen(true);
    };

    const closeFinalizarEvaluacionModal = () => {
        setIsFinalizarEvaluacionModalOpen(false);
        setTimeout(() => {
            setModalStatus('initial');
        }, 300);
    };

    const confirmFinalizarEvaluacion = async () => {
        try {
            setModalStatus('processing');
            setIsSubmitting(true);

            await axios.post(route('company.update.evaluation-fields'), {
                puntos_fuertes: evaluationFields.puntos_fuertes,
                oportunidades: evaluationFields.oportunidades
            });

            const response = await axios.post(route('indicadores.enviar-evaluacion-calificada'));

            if (response.data.success) {
                setModalStatus('completed');
                router.reload({ only: ['activeCompany'] });
                router.reload({ only: ['companyStatusEval'] });
            } else {
                throw new Error(response.data.message || 'Error al finalizar la evaluación');
            }
        } catch (error) {
            setIsFinalizarEvaluacionModalOpen(false);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || error.message || 'Error al finalizar la evaluación'
            });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    };

    const openCalificarNuevamenteModal = () => {
        setModalStatus('initial');
        setIsCalificarNuevamenteModalOpen(true);
    };

    const closeCalificarNuevamenteModal = () => {
        setIsCalificarNuevamenteModalOpen(false);
        setTimeout(() => {
            setModalStatus('initial');
        }, 300);
    };

    const confirmCalificarNuevamente = async () => {
        try {
            setModalStatus('processing');
            setIsSubmitting(true);

            const response = await axios.post(route('evaluacion.calificar-nuevamente'));

            if (response.data.success) {
                setModalStatus('completed');
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                throw new Error(response.data.message || 'Error al calificar nuevamente');
            }
        } catch (error) {
            setIsCalificarNuevamenteModalOpen(false);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || error.message || 'Error al calificar nuevamente'
            });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    };

    const handleFieldChange = (field, value) => {
        setEvaluationFields(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <EvaluadorLayout>
            <Head title="Dashboard Evaluador" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Mensaje de error de redirección */}
                    {flash.error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <XCircle className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {flash.error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            ¡Bienvenido/a, {auth.user.name}!
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Panel de control para evaluadores
                        </p>
                    </div>

                    {activeCompany && Object.keys(activeCompany).length > 0 && (
                        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Building2 className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-700">Evaluando actualmente:</p>
                                        <h2 className="text-lg font-semibold text-green-900">{activeCompany.name}</h2>
                                    </div>
                                </div>
                                <div>
                                    <Link href={route('form.empresa')} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors text-center" target="_blank" rel="noopener noreferrer">
                                        Información de la empresa
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de advertencia cuando la empresa no está autorizada */}
                    {activeCompany && Object.keys(activeCompany).length > 0 && companyStatusEval === 'evaluacion-pendiente' && (
                        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold text-yellow-800">La empresa tiene la evaluación pendiente</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        La empresa tiene la evaluación pendiente, por lo que no se podrá acceder a las opciones de evaluación hasta que la empresa termine la evaluación.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de advertencia cuando la empresa no está autorizada */}
                    {companyStatusEval === 'evaluacion' && (
                        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold text-yellow-800">La empresa está realizando la evaluación</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        La empresa está realizando la evaluación, por lo que no se podrá acceder a las opciones de evaluación hasta que la empresa termine la evaluación.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de advertencia cuando la empresa no está autorizada */}
                    {companyStatusEval === 'evaluacion-completada' && (
                        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold text-green-800">La empresa ha completado la evaluación</h3>
                                    <p className="text-sm text-green-700 mt-1">
                                        La empresa ha completado la evaluación y está lista para ser evaluada.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje cuando el evaluador está en el último paso de la evaluación */}
                    {companyStatusEval === 'evaluacion-calificada' && (
                        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold text-blue-800">La empresa está en el último paso de la evaluación</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Finaliza la evaluación para enviar a la empresa los resultados.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de advertencia cuando ya se calificó la evaluación de la empresa */}
                    {companyStatusEval === 'evaluado' && (
                        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between gap-3 w-full">
                                    <div>
                                        <h3 className="text-md font-semibold text-blue-800">La empresa ha sido calificada</h3>
                                        <p className="text-sm text-blue-700 mt-1">
                                            La empresa ha sido calificada y está lista para ser evaluada.
                                        </p>
                                    </div>
                                    {
                                        activeCompany.evaluation_document_path && (
                                            <a href={`/storage/${activeCompany.evaluation_document_path}`} className='text-blue-700' target="_blank" rel="noopener noreferrer">Descargar documento de evaluación</a>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de advertencia cuando la empresa está desaprobada, agregando un boton para poder calificar la empresa nuevamente */}
                    {companyStatusEval === 'evaluacion-desaprobada' && (
                        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <div className="flex items-center justify-between gap-3 w-full">
                                    <div>
                                        <h3 className="text-md font-semibold text-red-800">La empresa ha sido desaprobada</h3>
                                        <p className="text-sm text-red-700 mt-1">
                                            La empresa no aprobó los indicadores descalificatorios y ha sido desaprobada.
                                        </p>
                                    </div>
                                    <button
                                        onClick={openCalificarNuevamenteModal}
                                        className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
                                    >
                                        Calificar nuevamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de advertencia cuando la empresa no está autorizada */}
                    {activeCompany && Object.keys(activeCompany).length > 0 && !isCompanyAuthorized && (
                        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold text-yellow-800">Empresa no autorizada para evaluación</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Esta empresa aún no ha sido autorizada para realizar la evaluación.
                                        No se podrá acceder a las opciones de evaluación hasta que la empresa sea autorizada.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {
                        (activeCompany && (companyStatusEval === 'evaluacion-calificada' || companyStatusEval === 'evaluacion-desaprobada')) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Puntos fuertes de la organización<span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={evaluationFields.puntos_fuertes}
                                        onChange={(e) => handleFieldChange('puntos_fuertes', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        rows={4}
                                        maxLength={640}
                                        placeholder="Ingrese los puntos fuertes de la empresa"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Oportunidades de mejora de la organización<span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={evaluationFields.oportunidades}
                                        onChange={(e) => handleFieldChange('oportunidades', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        rows={4}
                                        maxLength={640}
                                        placeholder="Ingrese las oportunidades de mejora"
                                    />
                                </div>
                            </div>
                        )}

                    <div className="mb-8 block md:flex items-center justify-between gap-4">
                        <div className="flex flex-col lg:flex-row items-center gap-4">
                            <span className="text-xl font-semibold">Evaluar empresa:</span>
                            <div className="relative w-[300px]">
                                <Combobox value={selectedCompany} onChange={setSelectedCompany}>
                                    <div className="relative mt-1">
                                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm">
                                            <Combobox.Input
                                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                                displayValue={(company) => company?.name || ''}
                                                onChange={(event) => setQuery(event.target.value)}
                                                placeholder="Buscar empresa..."
                                            />
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </Combobox.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                            afterLeave={() => setQuery('')}
                                        >
                                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                                {filteredCompanies.length === 0 && query !== '' ? (
                                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                                        No se encontraron empresas.
                                                    </div>
                                                ) : (
                                                    filteredCompanies.map((company) => (
                                                        <Combobox.Option
                                                            key={company.id}
                                                            className={({ active }) =>
                                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-green-600 text-white' : 'text-gray-900'
                                                                }`
                                                            }
                                                            value={company}
                                                        >
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                        {company.name}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-green-600'}`}>
                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Combobox.Option>
                                                    ))
                                                )}
                                            </Combobox.Options>
                                        </Transition>
                                    </div>
                                </Combobox>
                            </div>
                            <button
                                onClick={() => selectedCompany && handleCompanyChange(selectedCompany.id)}
                                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!selectedCompany}
                            >
                                ACCEDER
                            </button>
                        </div>

                        {
                            (activeCompany && (companyStatusEval === 'evaluacion-calificada' || companyStatusEval === 'evaluacion-desaprobada')) && (
                                <div className="space-y-4">

                                    <button
                                        onClick={openFinalizarEvaluacionModal}
                                        disabled={isSubmitting || !evaluationFields.puntos_fuertes || !evaluationFields.oportunidades}
                                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-75 disabled:cursor-not-allowed"
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
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-4">
                        <div className="w-1/2">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-xl font-bold mb-2">Descargar documentación</h3>
                                <div className="mt-6">
                                    <a href={route('download.company.documentation')} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors text-center" target="_blank" rel="noopener noreferrer">
                                        Descargar
                                    </a>

                                    {/* {activeCompany && companyStatusEval === 'evaluacion-completada' && (
                                        <a 
                                            href={route('download.evaluation.pdf', activeCompany.id)} 
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            Descargar PDF de evaluación
                                        </a>
                                    )} */}
                                </div>
                            </div>
                        </div>

                        <div className="w-1/2">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-xl font-bold mb-2">Perfil de empresa</h3>
                                <div className="mt-6">
                                    <Link href={route('company.edit')} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors">
                                        Ver Perfil
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CalificarEvaluacionModal
                isOpen={isFinalizarEvaluacionModalOpen}
                onClose={closeFinalizarEvaluacionModal}
                onConfirm={confirmFinalizarEvaluacion}
                status={modalStatus}
                isProcessing={isSubmitting}
            />
            <CalificarEvaluacionModal
                isOpen={isCalificarNuevamenteModalOpen}
                onClose={closeCalificarNuevamenteModal}
                onConfirm={confirmCalificarNuevamente}
                status={modalStatus}
                isProcessing={isSubmitting}
                title="Calificar nuevamente"
                message="¿Está seguro que desea calificar nuevamente la evaluación de esta empresa?"
                successMessage="La empresa ha sido habilitada para ser calificada nuevamente"
            />
        </EvaluadorLayout>
    );
} 