import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function SuperAdminSidebar({ isOpen, setIsOpen, navigation = [] }) {
    const [isEvaluacionOpen, setIsEvaluacionOpen] = useState(false);
    const [isUsuariosOpen, setIsUsuariosOpen] = useState(false);

    // Agrupar los items de navegación
    const evaluacionItems = navigation.filter(item =>
        ['Valores', 'Componentes', 'Homologaciones', 'Certificaciones', 'Indicadores'].includes(item.name)
    );

    const usuariosItems = navigation.filter(item =>
        ['Usuarios', 'Empresas'].includes(item.name)
    );

    return (
        <>
            {/* Overlay para móvil */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div className={`
                min-h-screen fixed lg:static inset-y-0 left-0 z-50 lg:z-30
                transform lg:transform-none transition duration-200 ease-in-out
                bg-green-700 w-72 text-white
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex lg:hidden justify-end p-4">
                    <button onClick={() => setIsOpen(false)} className="text-white focus:text-white focus:bg-green-800 active:text-white active:bg-green-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <ul className="menu p-4 lg:pt-24">
                    <li className="mb-1">
                        <Link
                            href={route('dashboard')}
                            className="block px-4 py-2 hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800"
                        >
                            Ir al Panel de Empresa
                        </Link>
                    </li>

                    <div className="divider"></div>

                    {/* Dashboard */}
                    <li className="mb-1">
                        <Link
                            href={route('super.dashboard')}
                            className={`
                                block px-4 py-2 rounded-lg text-white
                                focus:text-white focus:bg-green-800
                                active:text-white active:bg-green-800
                                transition-colors duration-200
                                ${route().current('super.dashboard')
                                    ? 'bg-green-800'
                                    : 'hover:bg-green-800'}
                            `}
                        >
                            <div className="flex items-center">
                                Inicio
                            </div>
                        </Link>
                    </li>

                    {/* Menú Administrar Evaluación */}
                    <li className="mb-1">
                        <button
                            onClick={() => setIsEvaluacionOpen(!isEvaluacionOpen)}
                            className="
                            focus:text-white focus:bg-green-800
                                active:text-white active:bg-green-800 w-full px-4 py-2 flex items-center justify-between hover:bg-green-800 rounded-lg"
                        >
                            <span>Administrar Evaluación</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${isEvaluacionOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Submenú de Evaluación */}
                        <ul className={`ml-4 mt-1 space-y-1 ${isEvaluacionOpen ? 'block' : 'hidden'}`}>
                            {evaluacionItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`
                                                block px-4 py-2 rounded-lg
                                                transition-colors duration-200
                                                focus:text-white focus:bg-green-800
                                                active:text-white active:bg-green-800
                                                ${item.active
                                                    ? 'bg-green-800'
                                                    : 'hover:bg-green-800'}
                                            `}
                                        >
                                            <div className="flex items-center">
                                                {Icon && <Icon className="mr-3 h-5 w-5" />}
                                                {item.name}
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>

                    {/* Menú Administrar Usuarios */}
                    <li className="mb-1">
                        <button
                            onClick={() => setIsUsuariosOpen(!isUsuariosOpen)}
                            className="w-full px-4 py-2 flex items-center justify-between hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800"
                        >
                            <span>Administrar Perfiles</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${isUsuariosOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Submenú de Usuarios */}
                        <ul className={`ml-4 mt-1 space-y-1 ${isUsuariosOpen ? 'block' : 'hidden'}`}>
                            {usuariosItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`
                                                block px-4 py-2 rounded-lg
                                                transition-colors duration-200
                                                focus:text-white focus:bg-green-800
                                                active:text-white active:bg-green-800
                                                ${item.active
                                                    ? 'bg-green-800'
                                                    : 'hover:bg-green-800'}
                                            `}
                                        >
                                            <div className="flex items-center">
                                                {Icon && <Icon className="mr-3 h-5 w-5" />}
                                                {item.name}
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>

                    {/* Reportes */}
                    <li className="mb-1">
                        <Link
                            href={route('super.reportes')}
                            className={`
                                block px-4 py-2 rounded-lg
                                transition-colors duration-200
                                focus:text-white focus:bg-green-800
                                active:text-white active:bg-green-800
                                ${route().current('super.reportes')
                                    ? 'bg-green-800'
                                    : 'hover:bg-green-800'}
                            `}
                        >
                            <div className="flex items-center">
                                Reportes
                            </div>
                        </Link>
                    </li>

                    {/* Progresos */}
                    <li className="mb-1">
                        <Link
                            href={route('super.progresos')}
                            className={`
                                block px-4 py-2 rounded-lg
                                transition-colors duration-200
                                focus:text-white focus:bg-green-800
                                active:text-white active:bg-green-800
                                ${route().current('super.progresos')
                                    ? 'bg-green-800'
                                    : 'hover:bg-green-800'}
                            `}
                        >
                            <div className="flex items-center">
                                Progresos
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
} 