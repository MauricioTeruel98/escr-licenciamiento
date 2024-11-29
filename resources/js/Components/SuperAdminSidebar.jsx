import { Link } from '@inertiajs/react';

export default function SuperAdminSidebar({ isOpen, setIsOpen, navigation = [] }) {
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

                <nav className="mt-4">
                    {navigation && navigation.map((item) => {
                        const Icon = item.icon;
                        return item && (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center px-4 py-2 mx-2 text-sm font-medium rounded-lg
                                    transition-colors duration-200
                                    ${item.active 
                                        ? 'bg-green-700 text-white' 
                                        : 'text-green-100 hover:bg-green-700 hover:text-white'}
                                `}
                            >
                                {Icon && <Icon className="mr-3 h-5 w-5" />}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
} 