import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InstructionsLayout from '@/Layouts/InstructionsLayout';

export default function Login({ status: initialStatus, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [status, setStatus] = useState(initialStatus);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [isMigrated, setIsMigrated] = useState(false);

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
            const newErrors = { ...validationErrors };
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
            const newErrors = { ...validationErrors };
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
            onError: (errors) => {
                // Comprueba si el email tiene el campo from_migration en 1
                axios.get(route('users.check-migration', { email: data.email })).then(response => {
                    console.log(response.data);
                    if (response.data.from_migration) {
                        // Mostrar mensaje de éxito sobre el envío del email de recuperación
                        if (response.data.status === 'passwords.sent') {
                            setIsMigrated(true);
                            setStatus('Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.');
                        } else {
                            setStatus('Hubo un problema al enviar el enlace de restablecimiento. Por favor, intenta de nuevo más tarde.');
                        }
                    }
                });
            }
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
                            Email
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
                        <InputError message={isMigrated ? errors.email || validationErrors.email : ''} className="mt-2" />
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

                {isMigrated && (
                    <div className="fixed inset-0 z-50">
                        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    {/* Header con botón de cerrar (solo visible en estado inicial o completado) */}
                                    {status !== 'processing' && (
                                        <div className="absolute right-0 top-0 pr-4 pt-4">
                                            <button
                                                onClick={() => setIsMigrated(false)}
                                                className="text-gray-400 hover:text-gray-500"
                                            >
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Contenido */}
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check text-green-700"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                Enlace enviado
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Tu cuenta se ha migrado a la nueva plataforma. Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsMigrated(false)}
                                            className="inline-flex w-full justify-center rounded-md bg-green-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 sm:ml-3 sm:w-auto"
                                        >
                                            Aceptar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </InstructionsLayout>
    );
}