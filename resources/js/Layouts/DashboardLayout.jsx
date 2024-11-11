import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';

export default function DashboardLayout({ children, userName }) {
    return (
        <div className="min-h-screen bg-gray-50 mt-16">
            <Navbar userName={userName} />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
} 