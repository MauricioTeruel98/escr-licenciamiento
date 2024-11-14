export default function Sidebar({ isOpen, setIsOpen }) {
    const menuItems = [
        { name: 'Inicio', route: 'dashboard', active: true },
        { name: 'Auto-evaluación', route: 'evaluation' },
        { name: 'Excelencia', route: 'excellence' },
        { name: 'Sostenibilidad', route: 'sustainability' },
        { name: 'Progreso Social', route: 'social-progress' },
        { name: 'Sostenibilidad', route: 'sustainability-2' },
        { name: 'Vinculación', route: 'linking' },
        { name: 'Certificaciones', route: 'certifications' },
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
                min-h-screen
                fixed lg:static inset-y-0 left-0 z-50 lg:z-30
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
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-1">
                            <a
                                // href={route(item.route)} 
                                className={`py-2 hover:bg-green-800 rounded-lg ${item.active ? 'bg-green-800' : ''
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