import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Sidebar({ isOpen, setIsOpen }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
    const [isEvaluacionOpen, setIsEvaluacionOpen] = useState(false);
    const [autoEvaluationItems, setAutoEvaluationItems] = useState([]);
    const [isApto, setIsApto] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [statusChecked, setStatusChecked] = useState(false);

    useEffect(() => {
        if (url.startsWith('/indicadores/')) {
            setIsEvaluationOpen(true);
        }
        if (url.startsWith('/evaluacion/')) {
            setIsEvaluacionOpen(true);
        }

        // Verificar el estado de autoevaluación y autorización
        const checkStatus = async () => {
            try {
                const response = await axios.get('/api/user-status');
                const newIsApto = response.data.auto_evaluation_status === 'apto';
                const newIsAuthorized = Boolean(response.data.company_authorized);
                
                setIsApto(newIsApto);
                setIsAuthorized(newIsAuthorized);
                setStatusChecked(true);
                
                // console.log('Estado actualizado:', { 
                //     isApto: newIsApto, 
                //     isAuthorized: newIsAuthorized, 
                //     url: url 
                // });
            } catch (error) {
                console.error('Error al verificar estado:', error);
                // Usar valores del auth como fallback solo si no se han establecido previamente
                if (!statusChecked) {
                    const fallbackIsApto = auth.user.auto_evaluation_status === 'apto';
                    const fallbackIsAuthorized = Boolean(auth.user.company?.authorized);
                    
                    setIsApto(fallbackIsApto);
                    setIsAuthorized(fallbackIsAuthorized);
                    
                    // console.log('Usando valores fallback:', { 
                    //     isApto: fallbackIsApto, 
                    //     isAuthorized: fallbackIsAuthorized, 
                    //     url: url 
                    // });
                }
            }
        };

        const fetchValues = async () => {
            try {
                const response = await axios.get('/api/sidebar-values');
                const values = Array.isArray(response.data) ? response.data.map(value => ({
                    name: value.name || 'Sin nombre',
                    route: `/indicadores/${value.id}`,
                    active: url === `/indicadores/${value.id}`
                })) : [];
                setAutoEvaluationItems(values);
            } catch (error) {
                console.error('Error al cargar valores:', error);
                setAutoEvaluationItems([]);
            }
        };

        checkStatus();
        fetchValues();
    }, [url]);

    return (
        <>
            {/* Overlay para móvil */}
            <div
                className={`w-1/4 fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div className={`
                min-h-screen fixed lg:static inset-y-0 left-0 z-50 lg:z-30
                transform lg:transform-none transition duration-200 ease-in-out
                bg-green-700 w-64 text-white
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
                    <li className="mb-1">
                        <Link
                            href={route('dashboard')}
                            className={`block px-4 py-2 hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800 ${url === '/dashboard' ? 'bg-green-800' : ''
                                }`}
                        >
                            Inicio
                        </Link>
                    </li>

                    {/* Menú desplegable de Auto-evaluación */}
                    <li className="mb-1">
                        <button
                            onClick={() => setIsEvaluationOpen(!isEvaluationOpen)}
                            className="w-full px-4 py-2 flex items-center justify-between hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800"
                        >
                            <span>Autoevaluación</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${isEvaluationOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Submenú de Auto-evaluación */}
                        <ul className={`ml-4 mt-1 space-y-1 ${isEvaluationOpen ? 'block' : 'hidden'}`}>
                            {Array.isArray(autoEvaluationItems) && autoEvaluationItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.route}
                                        className={`block px-4 py-2 hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800 ${item.active ? 'bg-green-800' : ''
                                            }`}
                                    >
                                        {item.name || 'Sin nombre'}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    {/* Menú desplegable de Evaluación - Mostrar siempre que isApto y isAuthorized sean true */}
                    {isApto && isAuthorized && (
                        <li className="mb-1">
                            <button
                                onClick={() => setIsEvaluacionOpen(!isEvaluacionOpen)}
                                className="w-full px-4 py-2 flex items-center justify-between hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800"
                            >
                                <span>Evaluación</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${isEvaluacionOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Submenú de Evaluación */}
                            <ul className={`ml-4 mt-1 space-y-1 ${isEvaluacionOpen ? 'block' : 'hidden'}`}>
                                {Array.isArray(autoEvaluationItems) && autoEvaluationItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={`/evaluacion/${item.route.split('/').pop()}`}
                                            className={`block px-4 py-2 hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800 ${url === `/evaluacion/${item.route.split('/').pop()}` ? 'bg-green-800' : ''}`}
                                        >
                                            {item.name || 'Sin nombre'}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )}

                    {/* Certificaciones separado */}
                    <li className="mb-1">
                        <Link
                            href={route('certifications.create')}
                            className={`block px-4 py-2 hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800 ${url.includes('certifications') ? 'bg-green-800' : ''
                                }`}
                        >
                            Certificaciones
                        </Link>
                    </li>

                    {auth.user.role === 'super_admin' && (
                        <>
                            <div className="divider"></div>
                            <li className="mb-1">
                                <Link href={route('super.dashboard')} className="block px-4 py-2 hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800">
                                    Ir al Panel de Super Admin
                                </Link>
                            </li>
                        </>
                    )}

                    {auth.user.role === 'evaluador' && (
                        <>
                            <div className="divider"></div>
                            <li className="mb-1">
                                <Link href={route('evaluador.dashboard')} className="block px-4 py-2 hover:bg-green-800 rounded-lg focus:text-white focus:bg-green-800 active:text-white active:bg-green-800">
                                    Evaluador
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
} 