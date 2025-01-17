import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import EvaluadorLayout from '@/Layouts/EvaluadorLayout';
import { Building2, ClipboardList, Users } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function EvaluadorDashboard({ auth }) {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [activeCompany, setActiveCompany] = useState(null);

    useEffect(() => {
        fetchCompanies();
        fetchActiveCompany();
    }, []);

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
                                        <p className="text-sm text-green-700">Administrando actualmente:</p>
                                        <h2 className="text-lg font-semibold text-green-900">{activeCompany.name}</h2>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-semibold">Acceder como</span>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-300 text-gray-900 text-lg rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 block w-[200px] cursor-pointer"
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                    value={selectedCompany || ''}
                                >
                                    <option value="">Seleccione la empresa</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            <button
                                onClick={() => selectedCompany && handleCompanyChange(selectedCompany)}
                                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
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


                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link href={route('evaluador.companies')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Building2 className="h-6 w-6 text-green-700" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Empresas</h3>
                                <p className="mt-2 text-sm text-gray-600">Ver y evaluar empresas</p>
                            </div>
                        </Link>

                        <Link href={route('evaluador.evaluations')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <ClipboardList className="h-6 w-6 text-green-700" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Evaluaciones</h3>
                                <p className="mt-2 text-sm text-gray-600">Gestionar evaluaciones pendientes</p>
                            </div>
                        </Link>

                        <Link href={route('evaluador.profile.edit')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-green-700" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Mi Perfil</h3>
                                <p className="mt-2 text-sm text-gray-600">Gestionar información personal</p>
                            </div>
                        </Link>
                    </div> */}
                </div>
            </div>
        </EvaluadorLayout>
    );
} 