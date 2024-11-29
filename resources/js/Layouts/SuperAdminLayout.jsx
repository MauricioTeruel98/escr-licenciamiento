import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import SuperAdminSidebar from '@/Components/SuperAdminSidebar';
import { ListOrdered, Scale, Award } from 'lucide-react';

export default function SuperAdminLayout({ children, title = null }) {
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        // ... otros items del menú ...
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
        // ... otros items del menú ...
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={title} />
            
            <Navbar onMenuClick={() => setIsOpen(true)} />
            
            <div className="flex">
                <SuperAdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                
                <main className="flex-1 p-8 mt-16">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 