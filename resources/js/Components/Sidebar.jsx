export default function Sidebar() {
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
        <div className="bg-green-700 min-h-screen w-64 text-white">
            <ul className="menu p-4">
                {menuItems.map((item, index) => (
                    <li key={index} className="mb-1">
                        <a 
                            // href={route(item.route)} 
                            className={`py-2 hover:bg-green-800 rounded-lg ${
                                item.active ? 'bg-green-800' : ''
                            }`}
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
} 