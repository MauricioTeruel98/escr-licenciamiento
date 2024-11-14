import { useForm, usePage } from "@inertiajs/react";

export default function Navbar({ userName, onMenuClick }) {
    const { post } = useForm();
    const { auth } = usePage().props;

    const handleLogout = () => {
        post(route('logout'));
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

    console.log(getInitials(auth.user.name));

    return (
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
                <img
                    src="/assets/img/logo_esc.png"
                    alt="Costa Rica Logo"
                    className="h-8"
                />
            </div>
            <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="badge badge-xs badge-primary indicator-item"></span>
                        </div>
                    </div>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="w-10 h-10 rounded-full bg-green-900 text-white flex items-center justify-center" style={{display: 'flex !important'}}>
                            <p className="text-xl">
                                {getInitials(auth.user.name)}
                            </p>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {
                            auth.user.role === 'admin' && (
                                <li>
                                    <a href={route('company.edit')} className="justify-between">
                                        Editar Empresa
                                    </a>
                                </li>
                            )
                        }
                        <li>
                            <a href={route('profile.edit')} className="justify-between">
                                Editar Perfil
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li>
                            <button
                                type="button"
                                onClick={handleLogout}
                            >
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 