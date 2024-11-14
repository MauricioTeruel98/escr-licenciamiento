import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { Head } from '@inertiajs/react';

export default function DashboardLayout({ children, userName, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-50">
                <Navbar 
                    userName={userName} 
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="flex pt-16">
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    <main className="flex-1 p-4 lg:p-8 w-full">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
} 