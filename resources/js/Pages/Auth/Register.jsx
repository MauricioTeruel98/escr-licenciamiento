import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InstructionsLayout from "@/Layouts/InstructionsLayout";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms_accepted: false,
    });

    const validateName = (name) => {
        // Solo permitir letras, espacios y acentos para nombres
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
        return nameRegex.test(name);
    };

    const validateEmail = (email) => {
        // Regex para permitir solo letras, números, guiones, puntos y arroba (sin espacios)
        const emailRegex = /^[a-zA-Z0-9._@+\-]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // Verificar que no contenga espacios, comillas simples o dobles
        return !(/[\s'"]/.test(password));
    };

    const handleNameChange = (e) => {
        // Filtrar caracteres no permitidos (solo letras, espacios y acentos)
        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');

        setData('name', value);

        if (value && !validateName(value)) {
            setValidationErrors({
                ...validationErrors,
                name: 'El nombre solo puede contener letras y espacios.'
            });
        } else {
            const newErrors = { ...validationErrors };
            delete newErrors.name;
            setValidationErrors(newErrors);
        }
    };

    const handleLastnameChange = (e) => {
        // Filtrar caracteres no permitidos (solo letras, espacios y acentos)
        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');

        setData('lastname', value);

        if (value && !validateName(value)) {
            setValidationErrors({
                ...validationErrors,
                lastname: 'El apellido solo puede contener letras y espacios.'
            });
        } else {
            const newErrors = { ...validationErrors };
            delete newErrors.lastname;
            setValidationErrors(newErrors);
        }
    };

    const handleEmailChange = (e) => {
        // Filtrar espacios y caracteres especiales no permitidos
        const value = e.target.value.replace(/[^a-zA-Z0-9._@+\-]/g, '');

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

    const handleConfirmPasswordChange = (e) => {
        // Filtrar espacios y comillas
        const value = e.target.value.replace(/[\s'"]/g, '');

        setData('password_confirmation', value);

        if (value && !validatePassword(value)) {
            setValidationErrors({
                ...validationErrors,
                password_confirmation: 'La contraseña no puede contener espacios, comillas simples o dobles.'
            });
        } else {
            const newErrors = { ...validationErrors };
            delete newErrors.password_confirmation;
            setValidationErrors(newErrors);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Validar todos los campos antes de enviar
        if (data.name && !validateName(data.name)) {
            return;
        }

        if (data.lastname && !validateName(data.lastname)) {
            return;
        }

        if (data.email && !validateEmail(data.email)) {
            return;
        }

        if (data.password && !validatePassword(data.password)) {
            return;
        }

        if (data.password_confirmation && !validatePassword(data.password_confirmation)) {
            return;
        }

        if (!data.terms_accepted) {
            setValidationErrors({
                ...validationErrors,
                terms_accepted: 'Debe aceptar los términos y condiciones para registrarse.'
            });
            return;
        }

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
                            onChange={handleNameChange}
                            className="w-full rounded-md border border-gray-300 p-2"
                            placeholder="Juan Pérez"
                            required
                            maxLength={100}
                            minLength={2}
                        />
                        <InputError message={errors.name || validationErrors.name} className="mt-2" />
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
                            onChange={handleLastnameChange}
                            className="w-full rounded-md border border-gray-300 p-2"
                            placeholder="Pérez"
                            required
                            maxLength={100}
                            minLength={2}
                        />
                        <InputError message={errors.lastname || validationErrors.lastname} className="mt-2" />
                    </div>

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
                            required
                            maxLength={100}
                            minLength={2}
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
                                required
                                maxLength={100}
                                minLength={8}
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
                                onChange={handleConfirmPasswordChange}
                                className="w-full rounded-md border border-gray-300 p-2 pr-10"
                                required
                                maxLength={100}
                                minLength={8}
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
                            <InputError message={errors.password_confirmation || validationErrors.password_confirmation} className="mt-2" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms_accepted"
                                    type="checkbox"
                                    checked={data.terms_accepted}
                                    onChange={(e) => setData('terms_accepted', e.target.checked)}
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms_accepted" className="font-light text-gray-600">
                                    Acepto los <a
                                        href="/assets/pdfs/Consentimiento informado.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer" className="text-green-700 hover:underline"
                                    >términos y condiciones</a> del sitio web
                                    <span className="text-red-500">*</span>
                                </label>
                            </div>
                        </div>
                        <InputError message={errors.terms_accepted || validationErrors.terms_accepted} className="mt-2" />
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