import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import SuperAdminSidebar from '@/Components/SuperAdminSidebar';
import { LayoutDashboard, Building2, Users, Award, Settings, Scale, ListOrdered, Target, Building2Icon, File, FileText, Upload } from 'lucide-react';

export default function SuperAdminLayout({ children, title = null }) {
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('super.dashboard'),
            icon: LayoutDashboard,
            active: route().current('super.dashboard')
        },
        {
            name: 'Valores',
            href: route('super.values'),
            icon: Scale,
            active: route().current('super.values')
        },
        {
            name: 'Componentes',
            href: route('super.subcategories'),
            icon: ListOrdered,
            active: route().current('super.subcategories')
        },
        {
            name: 'Requisitos',
            href: route('super.requisitos'),
            icon: FileText,
            active: route().current('super.requisitos')
        },
        {
            name: 'Homologaciones',
            href: route('super.homologations'),
            icon: Award,
            active: route().current('super.homologations')
        },
        {
            name: 'Indicadores',
            href: route('super.indicators'),
            icon: Target,
            active: route().current('super.indicators')
        },
        {
            name: 'Usuarios',
            href: route('super.users'),
            icon: Users,
            active: route().current('super.users')
        },
        {
            name: 'Empresas',
            href: route('super.companies'),
            icon: Building2Icon,
            active: route().current('super.companies')
        },
        {
            name: 'Certificaciones',
            href: route('super.certifications'),
            icon: File,
            active: route().current('super.certifications')
        },
        {
            name: 'Reportes',
            href: route('super.reportes'),
            icon: FileText,
            active: route().current('super.reportes')
        },
        {
            name: 'Progresos',
            href: route('super.progresos'),
            icon: FileText,
            active: route().current('super.progresos')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={title} />

            <Navbar onMenuClick={() => setIsOpen(true)} />

            <div className="flex">
                <SuperAdminSidebar
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    navigation={navigation}
                />

                <main className="flex-1 p-8 mt-16 w-3/4">
                    <div className="max-w-8xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 