import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InstructionsLayout from "@/Layouts/InstructionsLayout";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <InstructionsLayout title="Registro">
            <div className="max-w-md w-full mx-auto">
                <h1 className="text-2xl font-semibold mb-8">Crear cuenta</h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm">
                            Nombre completo
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2"
                            placeholder="Juan Pérez"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="lastname" className="block text-sm">
                            Apellido
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="lastname"
                            type="text"
                            value={data.lastname}
                            onChange={(e) => setData('lastname', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2"
                            placeholder="Pérez"
                            required
                        />
                        <InputError message={errors.lastname} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm">
                            Correo electrónico
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2"
                            placeholder="nombre@empresa.com"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm">
                            Contraseña
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 pr-10"
                                required
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
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 pr-10"
                                required
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
                        Registrarse
                    </button>

                    <div className="text-sm text-center">
                        ¿Ya tiene una cuenta?{" "}
                        <a href={route('login')} className="text-green-700 hover:underline">
                            Iniciar sesión
                        </a>
                    </div>
                </form>
            </div>
        </InstructionsLayout>
    );
}