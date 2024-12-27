import { Head } from '@inertiajs/react';
import EvaluadorLayout from '@/Layouts/EvaluadorLayout';
import { Link } from '@inertiajs/react';
import { Building2, ClipboardList, Users } from 'lucide-react';

export default function EvaluadorDashboard({ auth }) {
    return (
        <EvaluadorLayout>
            <Head title="Dashboard Evaluador" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            ¡Bienvenido, {auth.user.name}!
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Panel de control para evaluadores
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link href={route('evaluador.companies')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                    <Building2 className="h-6 w-6 text-amber-700" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Empresas Asignadas</h3>
                                <p className="mt-2 text-sm text-gray-600">Ver y evaluar empresas asignadas</p>
                            </div>
                        </Link>

                        <Link href={route('evaluador.evaluations')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                    <ClipboardList className="h-6 w-6 text-amber-700" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Evaluaciones</h3>
                                <p className="mt-2 text-sm text-gray-600">Gestionar evaluaciones pendientes</p>
                            </div>
                        </Link>

                        <Link href={route('evaluador.profile.edit')} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-amber-700" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Mi Perfil</h3>
                                <p className="mt-2 text-sm text-gray-600">Gestionar información personal</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </EvaluadorLayout>
    );
} 