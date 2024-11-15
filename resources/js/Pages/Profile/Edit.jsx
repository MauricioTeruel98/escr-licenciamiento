import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import Toast from '@/Components/Toast';
import { useState } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function Edit({ auth, mustVerifyEmail, status, userName }) {
    const { flash } = usePage().props;
    const [showToast, setShowToast] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    
    const { data, setData, patch, errors, processing, reset } = useForm({
        name: auth.user.name || '',
        lastname: auth.user.lastname || '',
        id_number: auth.user.id_number || '',
        phone: auth.user.phone || '',
        email: auth.user.email || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation');
                setShowToast(true);
            }
        });
    };

    return (
        <DashboardLayout userName={userName} title="Perfil">
            <Head title="Perfil" />

            {showToast && flash.success && (
                <Toast 
                    message={flash.success} 
                    onClose={() => setShowToast(false)} 
                />
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <span className="text-sm text-green-700">Admin</span>
                        <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
                    </div>
                    <div className="bg-white p-8 shadow sm:rounded-lg">
                        {flash.success && (
                            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">
                                            {flash.success}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Nombre */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Nombre<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Apellidos */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Apellidos<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.lastname}
                                        onChange={e => setData('lastname', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <InputError message={errors.lastname} className="mt-2" />
                                </div>

                                {/* Cédula */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Cédula<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.id_number}
                                        onChange={e => setData('id_number', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <InputError message={errors.id_number} className="mt-2" />
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>

                                {/* Correo Electrónico */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        disabled
                                        className="w-full rounded-md border border-gray-300 bg-gray-50 p-2"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Para cambiar el correo, favor comunicarse con{' '}
                                        <a href="#" className="text-green-700 hover:underline">
                                            soporte técnico
                                        </a>
                                    </p>
                                </div>

                                {/* Contraseña Actual */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Contraseña Actual
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={data.current_password}
                                            onChange={e => setData('current_password', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-10"
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
                                    </div>
                                    <InputError message={errors.current_password} className="mt-2" />
                                </div>

                                {/* Nueva Contraseña */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-10"
                                        />
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>
                                </div>

                                {/* Confirmar Nueva Contraseña */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswordConfirmation ? "text" : "password"}
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPasswordConfirmation ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
