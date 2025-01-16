import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import SuperAdminSidebar from '@/Components/SuperAdminSidebar';
import { LayoutDashboard, Building2, ClipboardList, UserCircle } from 'lucide-react';
import EvaluadorSidebar from '@/Components/EvaluadorSidebar';

export default function EvaluadorLayout({ children, title = null }) {
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('evaluador.dashboard'),
            icon: LayoutDashboard,
            active: route().current('evaluador.dashboard')
        },
        {
            name: 'Empresas',
            href: route('evaluador.companies'),
            icon: Building2,
            active: route().current('evaluador.companies')
        },
        {
            name: 'Evaluaciones',
            href: route('evaluador.evaluations'),
            icon: ClipboardList,
            active: route().current('evaluador.evaluations')
        },
        {
            name: 'Mi Perfil',
            href: route('evaluador.profile.edit'),
            icon: UserCircle,
            active: route().current('evaluador.profile.edit')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={title} />
            
            <Navbar onMenuClick={() => setIsOpen(true)} />
            
            <div className="flex pt-16">
                <EvaluadorSidebar 
                    isOpen={isOpen} 
                    setIsOpen={setIsOpen} 
                    navigation={navigation}
                />
                
                <main className="flex-1 p-8 mt-16">
                    <div className="max-w-8xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 