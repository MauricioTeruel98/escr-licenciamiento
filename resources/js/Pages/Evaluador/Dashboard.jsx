import { useState, useEffect, Fragment } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import EvaluadorLayout from '@/Layouts/EvaluadorLayout';
import { Building2, ClipboardList, Users, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import CalificarEvaluacionModal from '@/Components/Modals/CalificarEvaluacion';

export default function EvaluadorDashboard({ auth, valuesProgressEvaluacion }) {
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
        oportunidades: activeCompany?.oportunidades || '',
        tiene_multi_sitio: activeCompany?.tiene_multi_sitio || false,
        cantidad_multi_sitio: activeCompany?.cantidad_multi_sitio || '',
        aprobo_evaluacion_multi_sitio: activeCompany?.aprobo_evaluacion_multi_sitio || false
    });

    useEffect(() => {
        fetchCompanies();
        fetchActiveCompany();
    }, []);

    useEffect(() => {
        if (activeCompany) {
            setEvaluationFields({
                puntos_fuertes: activeCompany.puntos_fuertes || '',
                oportunidades: activeCompany.oportunidades || '',
                tiene_multi_sitio: Boolean(activeCompany.tiene_multi_sitio),
                cantidad_multi_sitio: activeCompany.cantidad_multi_sitio || '',
                aprobo_evaluacion_multi_sitio: Boolean(activeCompany.aprobo_evaluacion_multi_sitio)
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
                    oportunidades: response.data.oportunidades || '',
                    tiene_multi_sitio: Boolean(response.data.tiene_multi_sitio),
                    cantidad_multi_sitio: response.data.cantidad_multi_sitio || '',
                    aprobo_evaluacion_multi_sitio: Boolean(response.data.aprobo_evaluacion_multi_sitio)
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

            // Preparar los datos
            const evaluationData = {
                puntos_fuertes: evaluationFields.puntos_fuertes,
                oportunidades: evaluationFields.oportunidades,
                tiene_multi_sitio: evaluationFields.tiene_multi_sitio,
                cantidad_multi_sitio: evaluationFields.tiene_multi_sitio ? evaluationFields.cantidad_multi_sitio : null,
                aprobo_evaluacion_multi_sitio: evaluationFields.aprobo_evaluacion_multi_sitio
            };

            await axios.post(route('company.update.evaluation-fields'), evaluationData);

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
        if (['puntos_fuertes', 'oportunidades'].includes(field)) {
            setEvaluationFields(prev => ({
                ...prev,
                [field]: value
            }));
        } else {
            setEvaluationFields(prev => ({
                ...prev,
                [field]: field === 'cantidad_multi_sitio' ? value : value === 'true'
            }));
        }
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

                    {/* Progreso por valor - evaluación */}
                    {
                        activeCompany && (activeCompany.estado_eval === "evaluacion-completada" || activeCompany.estado_eval === "evaluacion-calificada") && (
                            <div className="card bg-white shadow my-8">
                                <div className="card-body">
                                    <div className="">
                                        <h3 className="text-lg font-semibold mb-4">Progreso de la calificación</h3>
                                        <div className="flex justify-between gap-4">
                                            {valuesProgressEvaluacion.map((value) => (
                                                <div key={value.id} className="bg-white p-4 rounded-lg shadow w-full">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="font-medium">{value.name}</h4>
                                                        {value.result ? (
                                                            <span className="text-sm px-3 py-1 rounded bg-green-200 text-green-600">
                                                                {value.result.nota}%
                                                            </span>
                                                        ) : (
                                                            <Link
                                                                href={route('evaluacion', value.id)}
                                                                className={`text-sm px-3 py-1 rounded ${value.progress === 100
                                                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                                    }`}
                                                            >
                                                                {value.progress === 100 ? 'Enviar' : 'Completar'}
                                                            </Link>
                                                        )}

                                                    </div>
                                                    <div className="relative pt-1">
                                                        <div className="flex mb-2 items-center justify-between">
                                                            <div>
                                                                <span className={`text-xs font-semibold inline-block ${value.result
                                                                    ? 'text-green-600'
                                                                    : value.progress === 100
                                                                        ? 'text-yellow-600'
                                                                        : 'text-blue-600'
                                                                    }`}>
                                                                    {value.progress}% Completado
                                                                </span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`text-xs font-semibold inline-block ${value.result
                                                                    ? 'text-green-600'
                                                                    : value.progress === 100
                                                                        ? 'text-yellow-600'
                                                                        : 'text-blue-600'
                                                                    }`}>
                                                                    {value.answered_questions}/{value.total_questions} Preguntas
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${value.result
                                                            ? 'bg-green-200'
                                                            : value.progress === 100
                                                                ? 'bg-yellow-200'
                                                                : 'bg-blue-200'
                                                            }`}>
                                                            <div
                                                                style={{ width: `${value.progress}%` }}
                                                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${value.result
                                                                    ? 'bg-green-500'
                                                                    : value.progress === 100
                                                                        ? 'bg-yellow-500'
                                                                        : 'bg-blue-500'
                                                                    }`}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

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
                            <div className="my-8 bg-white rounded-lg shadow p-6">
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
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Datos complementarios a la función central</h3>
                                    <div className="space-y-6">
                                        {/* ¿Tiene la organización multi-sitio? */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ¿Tiene la organización multi-sitio? <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="tiene_multi_sitio"
                                                        value="true"
                                                        checked={evaluationFields.tiene_multi_sitio === true}
                                                        onChange={(e) => handleFieldChange('tiene_multi_sitio', e.target.value)}
                                                        className="form-radio text-green-600 focus:ring-green-500"
                                                    />
                                                    <span className="ml-2">Sí</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="tiene_multi_sitio"
                                                        value="false"
                                                        checked={evaluationFields.tiene_multi_sitio === false}
                                                        onChange={(e) => handleFieldChange('tiene_multi_sitio', e.target.value)}
                                                        className="form-radio text-green-600 focus:ring-green-500"
                                                    />
                                                    <span className="ml-2">No</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Cantidad de multi-sitio evaluados - Solo se muestra si tiene_multi_sitio es true */}
                                        {evaluationFields.tiene_multi_sitio && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ¿Cantidad de multi-sitio evaluados? <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={evaluationFields.cantidad_multi_sitio}
                                                    onChange={(e) => handleFieldChange('cantidad_multi_sitio', e.target.value)}
                                                    min="0"
                                                    max="10"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                        )}

                                        {/* ¿La organización ha aprobado la evaluación de los multi-sitio? - Solo se muestra si tiene_multi_sitio es true */}
                                        {evaluationFields.tiene_multi_sitio && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ¿La organización ha aprobado la evaluación de los multi-sitio? <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-4">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="aprobo_evaluacion_multi_sitio"
                                                            value="true"
                                                            checked={evaluationFields.aprobo_evaluacion_multi_sitio === true}
                                                            onChange={(e) => handleFieldChange('aprobo_evaluacion_multi_sitio', e.target.value)}
                                                            className="form-radio text-green-600 focus:ring-green-500"
                                                        />
                                                        <span className="ml-2">Sí</span>
                                                    </label>
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="aprobo_evaluacion_multi_sitio"
                                                            value="false"
                                                            checked={evaluationFields.aprobo_evaluacion_multi_sitio === false}
                                                            onChange={(e) => handleFieldChange('aprobo_evaluacion_multi_sitio', e.target.value)}
                                                            className="form-radio text-green-600 focus:ring-green-500"
                                                        />
                                                        <span className="ml-2">No</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">
                                                <strong>Importante:</strong><br />
                                                En el caso de organizaciones multi-sitio, la función central de la organización debe ser siempre evaluada.
                                                La evaluación del resto de sitios se debe basar en muestreo e incluir al menos un número igual a la raíz
                                                cuadrada del total de sitios adicionales a la función central.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

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
                                        disabled={
                                            isSubmitting ||
                                            !evaluationFields.puntos_fuertes ||
                                            !evaluationFields.oportunidades ||
                                            (evaluationFields.tiene_multi_sitio && !evaluationFields.cantidad_multi_sitio)
                                        }
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

                    {
                        activeCompany && Object.keys(activeCompany).length > 0 && (
                            <div className="flex flex-col lg:flex-row items-center gap-4">
                                <div className="w-1/2">
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-xl font-bold mb-2">Descargar documentación</h3>
                                        <div className="mt-6">
                                            <a href={route('download.company.documentation')} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors text-center" target="_blank" rel="noopener noreferrer">
                                                Descargar
                                            </a>
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
                        )
                    }
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