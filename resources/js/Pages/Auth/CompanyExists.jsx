import { useForm } from '@inertiajs/react';
import ImageLayout from '@/Layouts/ImageLayout';
import { AlertTriangle } from 'lucide-react';

export default function CompanyExists() {
    const { post, processing } = useForm();

    const handleRequestAccess = () => {
        post(route('company.request-access'));
    };

    return (
        <ImageLayout title="Empresa Registrada">
            <div className="max-w-md w-full mx-auto">
                <div className="flex flex-col space-y-6">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl font-semibold">
                            La empresa ya está registrada.
                        </h1>

                        <p className="text-gray-600">
                            La empresa ya ha sido registrada por otro usuario.
                            Solicite acceso al administrador de la empresa.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            type="button"
                            onClick={handleRequestAccess}
                            disabled={processing}
                            className="flex-1 bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50"
                        >
                            Solicitar Acceso
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Regresar
                        </button>
                    </div>

                    <div className="text-sm text-gray-600">
                        ¿Necesita ayuda?{" "}
                        <a href="#" className="text-green-700 hover:underline">
                            Soporte técnico
                        </a>
                    </div>
                </div>
            </div>
        </ImageLayout>
    );
} 