import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { Head } from '@inertiajs/react';

export default function DashboardLayout({ children, userName, title }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-50 mt-16">
                <Navbar userName={userName} />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-8">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
} 