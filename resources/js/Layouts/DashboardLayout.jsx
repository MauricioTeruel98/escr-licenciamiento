import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import EvaluadorSidebar from '@/Components/EvaluadorSidebar';
import { Head, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children, userName, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { auth } = usePage().props;

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-50">
                <Navbar 
                    userName={userName} 
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="flex pt-16">
                    {auth.user.role === 'evaluador' ? (
                        <EvaluadorSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    ) : (
                        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    )}
                    <main className="flex-1 p-4 lg:p-8 w-full">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
} 