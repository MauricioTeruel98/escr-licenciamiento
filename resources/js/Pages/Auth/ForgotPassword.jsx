import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ImageLayout from '@/Layouts/ImageLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <ImageLayout title="Recuperar Contraseña">
            <Head title="Olvidaste tu contraseña?" />

            <div className="max-w-md w-full mx-auto">
                <h1 className="text-2xl font-semibold mb-8">Recuperar Contraseña</h1>

                <div className="mb-6 text-sm text-gray-600">
                    ¿Olvidaste tu contraseña? No hay problema. Solo ingresa tu correo electrónico
                    y te enviaremos un enlace para que puedas crear una nueva contraseña.
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm">
                            Correo electrónico
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full rounded-md border border-gray-300 p-2"
                            placeholder="nombre@empresa.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors"
                    >
                        Enviar enlace de recuperación
                    </button>

                    <div className="text-sm text-center">
                        <a href={route('login')} className="text-green-700 hover:underline">
                            Volver al inicio de sesión
                        </a>
                    </div>
                </form>
            </div>
        </ImageLayout>
    );
}
