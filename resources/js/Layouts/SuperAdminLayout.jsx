import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import SuperAdminSidebar from '@/Components/SuperAdminSidebar';

export default function SuperAdminLayout({ children, title = null }) {
    const [isOpen, setIsOpen] = useState(false);

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