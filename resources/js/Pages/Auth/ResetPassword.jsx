import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ImageLayout from '@/Layouts/ImageLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword({ token, email, tokenExpired }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (errors) => {
                //console.log('Errores de validación:', errors);
            }
        });
    };

    return (
        <ImageLayout title="Restablecer Contraseña">
            <Head title="Restablecer Contraseña" />
            <div className="max-w-md w-full mx-auto">
                <h1 className="text-2xl font-semibold mb-8">Restablecer Contraseña</h1>

                {tokenExpired ? (
                    <div>
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            <h2 className="font-semibold text-lg mb-2">El enlace ha expirado</h2>
                            <p className="mb-4">
                                El enlace para restablecer la contraseña ha expirado o no es válido.
                                Los enlaces de restablecimiento son válidos por 60 minutos.
                            </p>
                        </div>
                        <Link
                            href={route('password.request')}
                            className="inline-block bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors"
                        >
                            Solicitar un nuevo enlace
                        </Link>
                    </div>
                ) : (
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
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-100"
                                autoComplete="username"
                                readOnly
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm">
                                Nueva contraseña
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="w-full rounded-md border border-gray-300 p-2 pr-10"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password_confirmation" className="block text-sm">
                                Confirmar contraseña
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full rounded-md border border-gray-300 p-2 pr-10"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors"
                        >
                            Restablecer Contraseña
                        </button>
                    </form>
                )}
            </div>
        </ImageLayout>
    );
}
