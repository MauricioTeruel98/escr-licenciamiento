import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InstructionsLayout from '@/Layouts/InstructionsLayout';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const validateEmail = (email) => {
        // Regex para permitir solo letras, números, guiones, puntos y arroba (sin espacios)
        const emailRegex = /^[a-zA-Z0-9._@+\-]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // Verificar que no contenga espacios, comillas simples o dobles
        return !(/[\s'"]/.test(password));
    };

    const handleEmailChange = (e) => {
        // Filtrar espacios y caracteres especiales no permitidos
        const value = e.target.value.replace(/[^a-zA-Z0-9._@+\-]/g, '');
        
        // Actualizar el valor en el formulario con el texto filtrado
        setData('email', value);
        
        if (value && !validateEmail(value)) {
            setValidationErrors({
                ...validationErrors,
                email: 'El correo no puede contener espacios ni caracteres especiales excepto guiones, arroba, punto y signo más.'
            });
        } else {
            const newErrors = {...validationErrors};
            delete newErrors.email;
            setValidationErrors(newErrors);
        }
    };

    const handlePasswordChange = (e) => {
        // Filtrar espacios y comillas
        const value = e.target.value.replace(/[\s'"]/g, '');
        
        // Actualizar el valor en el formulario con el texto filtrado
        setData('password', value);
        
        if (value && !validatePassword(value)) {
            setValidationErrors({
                ...validationErrors,
                password: 'La contraseña no puede contener espacios, comillas simples o dobles.'
            });
        } else {
            const newErrors = {...validationErrors};
            delete newErrors.password;
            setValidationErrors(newErrors);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Validar antes de enviar
        if (data.email && !validateEmail(data.email)) {
            return;
        }
        
        if (data.password && !validatePassword(data.password)) {
            return;
        }
        
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <InstructionsLayout title="Log in">
            <div className="max-w-md w-full mx-auto">
                <h1 className="text-2xl font-semibold mb-8">Ingresar</h1>

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
                            value={data.email}
                            onChange={handleEmailChange}
                            className="w-full rounded-md border border-gray-300 p-2"
                            placeholder="nombre@empresa.com"
                        />
                        <InputError message={errors.email || validationErrors.email} className="mt-2" />
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
                                onChange={handlePasswordChange}
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
                            <InputError message={errors.password || validationErrors.password} className="mt-2" />
                        </div>
                    </div>

                    {canResetPassword && (
                        <a href={route('password.request')} className="text-sm text-green-700 hover:underline block">
                            ¿Olvidaste tu contraseña?
                        </a>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors"
                    >
                        Acceder
                    </button>

                    <div className="text-sm text-center">
                        ¿No tiene cuenta?{" "}
                        <a href={route('register')} className="text-green-700 hover:underline">
                            Crear cuenta
                        </a>
                    </div>
                </form>
            </div>
        </InstructionsLayout>
    );
}