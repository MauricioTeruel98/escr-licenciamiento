import ImageLayout from '@/Layouts/ImageLayout';
import { AlertTriangle } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function PendingApproval({ status }) {
    const { post } = useForm();

    useEffect(() => {
        // Si el usuario está aprobado, redirigir al dashboard
        if (status === 'approved') {
            router.visit(route('dashboard'));
        }
    }, [status]);

    const handleLogout = () => {
        post(route('logout'));
    };

    // Si el usuario está aprobado, no renderizar nada mientras se redirige
    if (status === 'approved') {
        return null;
    }

    return (
        <ImageLayout title="Aprobación Pendiente">
            <div className="max-w-md w-full mx-auto">
                <div className="flex flex-col space-y-6">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl font-semibold">
                            Aprobación Pendiente
                        </h1>

                        <p className="text-gray-600">
                            Su solicitud de acceso está siendo revisada por el administrador de la empresa.
                            Por favor, espere a que su solicitud sea procesada.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </ImageLayout>
    );
} 