import { useState } from 'react';
import { Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

export default function SuperAdminDashboard({ auth }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SuperAdminLayout>
            <main className="flex-1 p-8 mt-16">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Panel de Control Super Admin
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Bienvenido al panel de administración principal
                        </p>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Tarjeta de Empresas */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Empresas</h2>
                                <span className="text-2xl font-bold text-green-700">150</span>
                            </div>
                            <p className="text-gray-600 mt-2">Total de empresas registradas</p>
                        </div>

                        {/* Tarjeta de Usuarios */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Usuarios</h2>
                                <span className="text-2xl font-bold text-green-700">432</span>
                            </div>
                            <p className="text-gray-600 mt-2">Total de usuarios en el sistema</p>
                        </div>

                        {/* Tarjeta de Certificaciones */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Certificaciones</h2>
                                <span className="text-2xl font-bold text-green-700">89</span>
                            </div>
                            <p className="text-gray-600 mt-2">Certificaciones activas</p>
                        </div>
                    </div>
                </div>
            </main>
        </SuperAdminLayout>
    );
} 