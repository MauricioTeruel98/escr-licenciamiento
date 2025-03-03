import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Building2, ClipboardList, BarChart } from 'lucide-react';

export default function EvaluadorSidebar({ isOpen, setIsOpen }) {
    const { url } = usePage();
    const [isEvaluacionOpen, setIsEvaluacionOpen] = useState(false);
    const [evaluacionItems, setEvaluacionItems] = useState([]);
    const [activeCompany, setActiveCompany] = useState(null);
    const [isCompanyAuthorized, setIsCompanyAuthorized] = useState(false);

    useEffect(() => {
        const fetchActiveCompany = async () => {
            try {
                const response = await axios.get('/api/evaluador/active-company');
                setActiveCompany(response.data);
                setIsCompanyAuthorized(response.data?.authorized === 1);
            } catch (error) {
                console.error('Error al cargar empresa activa:', error);
                setActiveCompany(null);
                setIsCompanyAuthorized(false);
            }
        };

        fetchActiveCompany();
    }, []);

    useEffect(() => {
        if (!isCompanyAuthorized) {
            setEvaluacionItems([]);
            return;
        }

        const fetchValues = async () => {
            try {
                const response = await axios.get('/api/active-values');
                const values = Array.isArray(response.data) ? response.data.map(value => ({
                    name: value.name || 'Sin nombre',
                    route: `/evaluacion/${value.id}`,
                    active: url === `/evaluacion/${value.id}`
                })) : [];
                setEvaluacionItems(values);
            } catch (error) {
                console.error('Error al cargar valores:', error);
                setEvaluacionItems([]);
            }
        };

        fetchValues();
    }, [url, isCompanyAuthorized]);

    return (
        <>
            {/* Overlay para móvil */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${
                    isOpen ? 'block' : 'hidden'
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

                <ul className="menu p-4 lg:pt-12">
                    {/* Inicio */}
                    <li className="mb-1">
                        <Link
                            href={route('evaluador.dashboard')}
                            className={`
                                block px-4 py-2 rounded-lg
                                transition-colors duration-200
                                focus:text-white focus:bg-green-800
                                active:text-white active:bg-green-800
                                ${route().current('evaluador.dashboard') 
                                    ? 'bg-green-800' 
                                    : 'hover:bg-green-800'}
                            `}
                        >
                            <div className="flex items-center">
                                <LayoutDashboard className="mr-3 h-5 w-5" />
                                Inicio
                            </div>
                        </Link>
                    </li>

                    {/* Menú Administrar Evaluación - Solo mostrar si la empresa está autorizada */}
                    {isCompanyAuthorized && activeCompany && (
                        <li className="mb-1">
                            <button
                                onClick={() => setIsEvaluacionOpen(!isEvaluacionOpen)}
                                className="w-full px-4 py-2 flex items-center justify-between hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800"
                            >
                                <div className="flex items-center">
                                    <ClipboardList className="mr-3 h-5 w-5" />
                                    <span>Administrar Evaluación</span>
                                </div>
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
                                {evaluacionItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.route}
                                            className={`block px-4 py-2 hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800 ${
                                                item.active ? 'bg-green-800' : ''
                                            }`}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )}

                    {/* Empresas */}
                    <li className="mb-1">
                        <Link
                            href={route('evaluador.empresas')}
                            className={`
                                block px-4 py-2 rounded-lg
                                transition-colors duration-200
                                focus:text-white focus:bg-green-800
                                active:text-white active:bg-green-800
                                ${route().current('evaluador.empresas') 
                                    ? 'bg-green-800' 
                                    : 'hover:bg-green-800'}
                            `}
                        >
                            <div className="flex items-center">
                                <Building2 className="mr-3 h-5 w-5" />
                                Empresas
                            </div>
                        </Link>
                    </li>

                    {/* Reportes */}
                    <li className="mb-1">
                        <Link
                            href={route('evaluador.reportes')}
                            className={`
                                block px-4 py-2 rounded-lg
                                transition-colors duration-200
                                focus:text-white focus:bg-green-800
                                active:text-white active:bg-green-800
                                ${route().current('evaluador.reportes') 
                                    ? 'bg-green-800' 
                                    : 'hover:bg-green-800'}
                            `}
                        >
                            <div className="flex items-center">
                                <BarChart className="mr-3 h-5 w-5" />
                                Reportes
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
} 