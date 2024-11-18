import ImageLayout from '@/Layouts/ImageLayout';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
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
        <ImageLayout title="Solicitud Enviada">
            <div className="max-w-lg w-full mx-auto">
                <div className="flex flex-col space-y-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-circle-check text-green-800"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl font-semibold">
                            ¡Solicitud enviada!
                        </h1>

                        <p className="text-gray-600">
                            Hemos enviado un correo solicitando acceso al administrador de su empresa.
                            Una vez confirmado le enviaremos un correo y podrá ingresar a la plataforma de licenciamiento.
                        </p>
                    </div>

                    <div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                    <div className="text-sm text-gray-600">
                        Necesita ayuda?{' '}
                        <a href={''} className="text-green-700 hover:underline">
                            Soporte técnico
                        </a>
                    </div>
                </div>
            </div>
        </ImageLayout>
    );
} 