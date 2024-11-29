import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import SuperAdminSidebar from '@/Components/SuperAdminSidebar';
import { LayoutDashboard, Building2, Users, Award, Settings, Scale, ListOrdered, Target, Building2Icon } from 'lucide-react';

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
            name: 'Subcategorías',
            href: route('super.subcategories'),
            icon: ListOrdered,
            active: route().current('super.subcategories')
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
                
                <main className="flex-1 p-8 mt-16">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 