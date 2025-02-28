import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import Toast from '@/Components/Toast';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import UsersManagement from '@/Components/UsersManagement';

export default function Edit({ auth, mustVerifyEmail, status, userName }) {
    const { flash } = usePage().props;
    const [showToast, setShowToast] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    
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

    // Función para validar campos
    const validateField = (field, value) => {
        let error = null;
        
        // Validación para nombre y apellido
        if (field === 'name' || field === 'lastname') {
            // Verificar si está vacío
            if (!value || value.trim() === '') {
                error = `El campo ${field === 'name' ? 'nombre' : 'apellidos'} es obligatorio`;
            }
            // Verificar si contiene números o caracteres especiales
            else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                error = `El campo ${field === 'name' ? 'nombre' : 'apellidos'} solo debe contener letras y espacios`;
            }
            // Verificar longitud máxima
            else if (value.length > 50) {
                error = `El campo ${field === 'name' ? 'nombre' : 'apellidos'} no debe exceder los 50 caracteres`;
            }
        }
        
        // Validación para número de identificación
        if (field === 'id_number') {
            // Verificar si está vacío
            if (!value || value.trim() === '') {
                error = 'La cédula es obligatoria';
            }
            // Verificar longitud máxima
            else if (value.length > 20) {
                error = 'La cédula no debe exceder los 20 caracteres';
            }
        }
        
        // Validación para teléfono
        if (field === 'phone') {
            if (value && value.length > 20) {
                error = 'El teléfono no debe exceder los 20 caracteres';
            }
            // Verificar si contiene caracteres no válidos
            else if (value && !/^[0-9+\-\s]+$/.test(value)) {
                error = 'El teléfono solo debe contener números, +, - y espacios';
            }
        }
        
        return error;
    };

    // Función para manejar cambios en los campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validar caracteres según el tipo de campo
        if (name === 'name' || name === 'lastname') {
            // Solo permitir letras y espacios
            const lastChar = value.charAt(value.length - 1);
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(lastChar) && lastChar !== '') {
                // Si el último carácter no es válido, no actualizar el valor
                return;
            }
            
            // Verificar longitud máxima
            if (value.length > 50) {
                return;
            }
        }
        
        if (name === 'id_number') {
            if (value.length > 20) {
                return;
            }
        }
        
        if (name === 'phone') {
            // Solo permitir números, +, - y espacios para teléfono
            const lastChar = value.charAt(value.length - 1);
            if (!/^[0-9+\-\s]$/.test(lastChar) && lastChar !== '') {
                return;
            }
            
            if (value.length > 20) {
                return;
            }
        }
        
        // Validar el campo
        const error = validateField(name, value);
        
        // Actualizar errores de validación
        setValidationErrors(prev => ({
            ...prev,
            [name]: error
        }));
        
        // Actualizar el valor del campo
        setData(name, value);
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Validar todos los campos antes de enviar
        let hasErrors = false;
        const newErrors = {};
        
        Object.entries(data).forEach(([field, value]) => {
            if (typeof value === 'string') {
                const error = validateField(field, value);
                if (error) {
                    newErrors[field] = error;
                    hasErrors = true;
                }
            }
        });
        
        setValidationErrors(newErrors);
        
        if (hasErrors) {
            return;
        }
        
        // Eliminar espacios al inicio y final antes de enviar
        const trimmedData = { ...data };
        Object.keys(trimmedData).forEach(key => {
            if (typeof trimmedData[key] === 'string' && key !== 'name' && key !== 'lastname') {
                trimmedData[key] = trimmedData[key].trim();
            }
        });
        
        // Eliminar espacios al final de nombre y apellido
        if (trimmedData.name) trimmedData.name = trimmedData.name.replace(/\s+$/, '');
        if (trimmedData.lastname) trimmedData.lastname = trimmedData.lastname.replace(/\s+$/, '');
        
        patch(route('profile.update'), {
            data: trimmedData,
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation');
                setShowToast(true);
            }
        });
    };

    console.log(auth.user);

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
                <div className="mx-auto space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <span className="text-md p-3 font-semibold text-green-800 mb-1 badge rounded-lg border border-green-200">
                            {auth.user.role === 'admin' ? 'Admin' : auth.user.role === 'super_admin' ? 'Super Admin' : 'Usuario'}
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Perfil de Usuario
                        </h1>
                    </div>
                    <div className="bg-white p-8 shadow-sm rounded-lg border border-gray-200">
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
                                        onChange={handleChange}
                                        name="name"
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Solo letras y espacios. Máx. 50 caracteres.</p>
                                    <InputError message={errors.name || validationErrors.name} className="mt-2" />
                                </div>

                                {/* Apellidos */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Apellidos<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.lastname}
                                        onChange={handleChange}
                                        name="lastname"
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Solo letras y espacios. Máx. 50 caracteres.</p>
                                    <InputError message={errors.lastname || validationErrors.lastname} className="mt-2" />
                                </div>

                                {/* Cédula */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Cédula<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.id_number}
                                        onChange={handleChange}
                                        name="id_number"
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Máx. 20 caracteres.</p>
                                    <InputError message={errors.id_number || validationErrors.id_number} className="mt-2" />
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-2">
                                    <label className="block text-sm">
                                        Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={handleChange}
                                        name="phone"
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Solo números, +, - y espacios. Máx. 20 caracteres.</p>
                                    <InputError message={errors.phone || validationErrors.phone} className="mt-2" />
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
            <div>
                {(auth.user.role === 'admin' || auth.user.role === 'super_admin') && (
                    <UsersManagement />
                )}
            </div>
        </DashboardLayout>
    );
}
