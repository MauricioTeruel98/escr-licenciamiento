import { useState } from 'react';
import SuperAdminSidebar from '@/Components/SuperAdminSidebar';
import Navbar from '@/Components/Navbar';

export default function SuperAdminDashboard({ auth }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar userName={auth.user.name} onMenuClick={() => setIsOpen(true)} />
            
            <div className="flex">
                <SuperAdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                
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
            </div>
        </div>
    );
} 