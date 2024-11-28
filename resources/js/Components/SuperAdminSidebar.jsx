import { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function SuperAdminSidebar({ isOpen, setIsOpen }) {
    const { url } = usePage();
    
    const menuItems = [
        { 
            name: 'Dashboard', 
            route: 'super.dashboard', 
            active: url === '/super/dashboard' 
        },
        { 
            name: 'Empresas', 
            route: 'super.companies', 
            active: url === '/super/companies'
        },
        { 
            name: 'Usuarios', 
            route: 'super.users', 
            active: url === '/super/users'
        },
        { 
            name: 'Certificaciones', 
            route: 'super.certifications', 
            active: url === '/super/certifications'
        },
        { 
            name: 'Configuración', 
            route: 'super.settings', 
            active: url === '/super/settings'
        }
    ];

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
                bg-green-800 w-72 text-white
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex lg:hidden justify-end p-4">
                    <button onClick={() => setIsOpen(false)} className="text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 border-b border-green-700">
                    <span className="text-lg font-semibold">Panel Super Admin</span>
                </div>

                <ul className="menu p-4">
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-1">
                            <a
                                href={route(item.route)}
                                className={`block px-4 py-2 hover:bg-green-700 rounded-lg ${
                                    item.active ? 'bg-green-700' : ''
                                }`}
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
} 