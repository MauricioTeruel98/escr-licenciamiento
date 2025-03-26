import { useEffect, useState } from "react";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Navbar({ userName, onMenuClick }) {
    const { post } = useForm();
    const { auth } = usePage().props;
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleLogout = () => {
        post(route('logout'));
    };

    useEffect(() => {
        if (auth.user.role === 'admin' || auth.user.role === 'super_admin') {
            cargarSolicitudesPendientes();
        }
    }, []);

    const cargarSolicitudesPendientes = async () => {
        try {
            const response = await axios.get('/api/pending-users/company');
            setSolicitudesPendientes(response.data);
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
        }
    };

    const handleApprove = (userId) => {
        setIsLoading(true);
        post(route('user.approve', userId), {}, {
            onSuccess: () => {
                cargarSolicitudesPendientes();
            }
        });
        setIsLoading(false);
        window.location.reload();
    };

    const handleReject = (userId) => {
        setIsLoading(true);
        post(route('user.reject', userId), {}, {
            onSuccess: () => {
                cargarSolicitudesPendientes();
            }
        });
        setIsLoading(false);
        window.location.reload();
    };

    // Función para obtener las iniciales del nombre
    const getInitials = (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <>
            <div className="navbar bg-white border-b fixed top-0 w-full z-50">
                <div className="flex-1">
                    <button
                        className="btn btn-ghost lg:hidden mr-2"
                        onClick={onMenuClick}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link href={'/'}>
                        <img
                            src="/assets/img/logo_esc.png"
                            alt="Costa Rica Logo"
                            className="h-8"
                        />
                    </Link>
                </div>
                <div className="flex-none gap-2 pe-5">
                    {(auth.user.role === 'admin' || auth.user.role === 'super_admin') && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {solicitudesPendientes.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {solicitudesPendientes.length}
                                    </span>
                                )}
                            </div>
                            <div tabIndex={0} className="dropdown-content dropdown-notify z-[1] menu shadow-lg bg-base-100 rounded-lg w-80 mt-4">
                                {solicitudesPendientes.map((solicitud) => (
                                    <div key={solicitud.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-medium">Solicitud de colaboración</h3>
                                                    <p className="text-sm text-gray-600">{solicitud.name} {solicitud.lastname}</p>
                                                    <p className="text-xs text-gray-500">{solicitud.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleApprove(solicitud.id)}
                                                    className="p-1 text-green-600 hover:text-green-700"
                                                    title="Aprobar"
                                                >
                                                    <CheckCircle className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(solicitud.id)}
                                                    className="p-1 text-red-600 hover:text-red-700"
                                                    title="Rechazar"
                                                >
                                                    <XCircle className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {solicitudesPendientes.length === 0 && (
                                    <div className="p-4 text-center text-gray-500">
                                        No hay solicitudes pendientes
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <div className="w-10 h-10 rounded-full bg-green-900 text-white flex items-center justify-center">
                                <p className="text-xl">
                                    {getInitials(auth.user.name)}
                                </p>
                            </div>
                        </div>
                        <div tabIndex={0} className="dropdown-content z-[1] mt-3 w-64 rounded-2xl shadow-lg bg-white">
                            <div className="bg-green-900 text-white p-4 rounded-t-xl">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium">{auth.user.name}</p>
                                    <span className="bg-white text-green-900 px-3 py-1 rounded-full text-sm">
                                        {auth.user.role === 'admin' ? 'Admin' : auth.user.role === 'super_admin' ? 'Admin' : auth.user.role === 'evaluador' ? 'Evaluador' : 'Usuario'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-2">
                                <Link
                                    href={route('profile.edit')}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Perfil Usuario
                                </Link>
                                {(auth.user.role === 'admin' || auth.user.role === 'super_admin' || auth.user.role === 'evaluador') && (
                                    <Link
                                        href={route('company.edit')}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Perfil Empresa
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                isLoading && (
                    <div className="fixed inset-0 z-50">
                        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    {/* Header con botón de cerrar (solo visible en estado inicial o completado) */}
                                    {isLoading && (
                                        <div className="absolute right-0 top-0 pr-4 pt-4">
                                            <button
                                                onClick={() => setIsLoading(false)}
                                                className="text-gray-400 hover:text-gray-500"
                                                disabled={isLoading}
                                            >
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Contenido */}
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 mb-4">
                                                <svg className="animate-spin h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                Procesando su solicitud
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Por favor espere un momento...
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
} 