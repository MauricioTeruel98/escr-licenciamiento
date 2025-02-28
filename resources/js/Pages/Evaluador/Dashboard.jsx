import { useState, useEffect, Fragment } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import EvaluadorLayout from '@/Layouts/EvaluadorLayout';
import { Building2, ClipboardList, Users, AlertTriangle, XCircle } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

export default function EvaluadorDashboard({ auth }) {
    const { flash } = usePage().props;
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [activeCompany, setActiveCompany] = useState(null);
    const [isCompanyAuthorized, setIsCompanyAuthorized] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchCompanies();
        fetchActiveCompany();
    }, []);

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
            const response = await axios.get('/api/evaluador/companies');
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
                window.location.href = '/dashboard';
            } else {
                setActiveCompany(null);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al cambiar de empresa:', error);
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
                            ¡Bienvenido, {auth.user.name}!
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Panel de control para evaluadores
                        </p>
                    </div>

                    {activeCompany && (
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
                            </div>
                        </div>
                    )}

                    {/* Mensaje de advertencia cuando la empresa no está autorizada */}
                    {activeCompany && !isCompanyAuthorized && (
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

                    <div className="mb-8">
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-semibold">Acceder como</span>
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
                                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                    active ? 'bg-green-600 text-white' : 'text-gray-900'
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
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-1/2">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-xl font-bold mb-2">Descargar documentación</h3>
                                <div className="mt-6">
                                    <Link href={''} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors">
                                        Ver Perfil
                                    </Link>
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
        </EvaluadorLayout>
    );
} 