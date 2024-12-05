import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Sidebar({ isOpen, setIsOpen }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

    const evaluationItems = [
        { name: 'Valores', route: 'values', active: url === '/values' },
        { name: 'Excelencia', route: 'excellence', active: url === '/excellence' },
        { name: 'Innovacion', route: 'innovation', active: url === '/innovation' },
        { name: 'Progreso Social', route: 'social-progress', active: url === '/social-progress' },
        { name: 'Sostenibilidad', route: 'sustainability', active: url === '/sustainability' },
        { name: 'Vinculación', route: 'linking', active: url === '/linking' },
    ];

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
                    <button onClick={() => setIsOpen(false)} className="text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <ul className="menu p-4 lg:pt-12">
                    <li className="mb-1">
                        <Link
                            href={route('dashboard')}
                            className={`block px-4 py-2 hover:bg-green-800 rounded-lg ${url === '/dashboard' ? 'bg-green-800' : ''
                                }`}
                        >
                            Inicio
                        </Link>
                    </li>

                    {/* Menú desplegable de Auto-evaluación */}
                    <li className="mb-1">
                        <button
                            onClick={() => setIsEvaluationOpen(!isEvaluationOpen)}
                            className="w-full px-4 py-2 flex items-center justify-between hover:bg-green-800 rounded-lg"
                        >
                            <span>Auto-evaluacion</span>
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
                            {evaluationItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        //href={route(item.route)}
                                        className={`block px-4 py-2 hover:bg-green-800 rounded-lg ${item.active ? 'bg-green-800' : ''
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    {/* Certificaciones separado */}
                    <li className="mb-1">
                        <Link
                            href={route('certifications.create')}
                            className={`block px-4 py-2 hover:bg-green-800 rounded-lg ${url.includes('certifications') ? 'bg-green-800' : ''
                                }`}
                        >
                            Certificaciones
                        </Link>
                    </li>

                    {auth.user.role === 'super_admin' && (
                        <>
                            <div className="divider"></div>
                            <li className="mb-1">
                                <Link href={route('super.dashboard')} className="block px-4 py-2 hover:bg-green-800 rounded-lg">
                                    Super Admin
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
} 