import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';

export default function SuperAdminDashboard({ auth }) {
    const [stats, setStats] = useState({
        companies: 0,
        users: 0,
        certifications: 0
    });
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [activeCompany, setActiveCompany] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
        fetchCompanies();
        fetchActiveCompany();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get('/api/super/dashboard-stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/companies/list');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error al cargar empresas:', error);
        }
    };

    const fetchActiveCompany = async () => {
        try {
            const response = await axios.get('/api/super/active-company');
            setActiveCompany(response.data);
        } catch (error) {
            console.error('Error al cargar empresa activa:', error);
        }
    };

    const handleCompanyChange = async (companyId) => {
        try {
            await axios.post('/api/super/switch-company', {
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
        <SuperAdminLayout>
            <Head title="Dashboard Super Admin" />
            <main className="flex-1 p-8 mt-0">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Panel de Control Super Admin
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Bienvenido al panel de administración principal
                        </p>
                    </div>

                    {activeCompany && (
                        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link href={route('super.values')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Listado de Valores</h3>
                                <p className="mt-2 text-sm text-gray-600">Gestionar valores del sistema</p>
                            </div>
                        </Link>

                        <Link href={route('super.homologations')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Listado de Homologaciones</h3>
                                <p className="mt-2 text-sm text-gray-600">Administrar homologaciones</p>
                            </div>
                        </Link>

                        <Link href={route('super.indicators')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Listado de Indicadores</h3>
                                <p className="mt-2 text-sm text-gray-600">Gestionar indicadores del sistema</p>
                            </div>
                        </Link>

                        <Link href={route('super.users')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
                                <p className="mt-2 text-sm text-gray-600">Administrar usuarios del sistema</p>
                            </div>
                        </Link>

                        <Link href={route('super.companies')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Gestión de Empresas</h3>
                                <p className="mt-2 text-sm text-gray-600">Administrar empresas registradas</p>
                            </div>
                        </Link>

                        <Link href={route('super.certifications')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Gestión de Certificaciones</h3>
                                <p className="mt-2 text-sm text-gray-600">Administrar certificaciones</p>
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link href={route('super.companies')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Empresas</h2>
                                <span className="text-2xl font-bold text-green-700">{stats.companies}</span>
                            </div>
                            <p className="text-gray-600 mt-2">Total de empresas registradas</p>
                        </Link>

                        <Link href={route('super.users')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Usuarios</h2>
                                <span className="text-2xl font-bold text-green-700">{stats.users}</span>
                            </div>
                            <p className="text-gray-600 mt-2">Total de usuarios en el sistema</p>
                        </Link>

                        <Link href={route('super.certifications')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Certificaciones</h2>
                                <span className="text-2xl font-bold text-green-700">{stats.certifications}</span>
                            </div>
                            <p className="text-gray-600 mt-2">Certificaciones activas</p>
                        </Link>
                    </div>
                </div>
            </main>
        </SuperAdminLayout>
    );
} 