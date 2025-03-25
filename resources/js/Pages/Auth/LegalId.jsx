import { useState } from "react";
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import ImageLayout from "@/Layouts/ImageLayout";

export default function LegalId() {
    const { data, setData, post, processing, errors } = useForm({
        legal_id: '',
    });
    
    const [validationErrors, setValidationErrors] = useState({});

    const validateLegalId = (legalId) => {
        // Solo permitir números y limitar a 10 dígitos
        const legalIdRegex = /^\d{1,12}$/;
        return legalIdRegex.test(legalId);
    };

    const handleLegalIdChange = (e) => {
        // Filtrar cualquier carácter que no sea número
        const value = e.target.value.replace(/\D/g, '');
        
        // Limitar a 10 dígitos
        const truncatedValue = value.slice(0, 12);
        
        setData('legal_id', truncatedValue);
        
        if (truncatedValue && !validateLegalId(truncatedValue)) {
            setValidationErrors({
                ...validationErrors,
                legal_id: 'La cédula jurídica solo puede contener números y tener hasta 10 dígitos.'
            });
        } else {
            const newErrors = {...validationErrors};
            delete newErrors.legal_id;
            setValidationErrors(newErrors);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Validar antes de enviar
        if (data.legal_id && !validateLegalId(data.legal_id)) {
            return;
        }
        
        post(route('legal-id.verify'));
    };

    // Función para manejar el logout
    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <ImageLayout title="Verificación de Identidad">
            <div className="max-w-lg w-full mx-auto">
                <h1 className="text-2xl font-semibold mb-4">¡Bienvenido!</h1>

                <p className="text-gray-600 mb-8">
                    Le invitamos a continuar con el proceso de autoevaluación registrando la información de la empresa.
                </p>

                <form onSubmit={submit} className="">
                    <div className="space-y-2">
                        <label htmlFor="legal_id" className="block text-sm font-semibold">
                            Indique el número de cédula jurídica de la empresa
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="legal_id"
                            type="text"
                            value={data.legal_id}
                            onChange={handleLegalIdChange}
                            className="w-full rounded-lg border border-gray-300 p-2"
                            placeholder="0000000"
                            required
                            maxLength={10}
                        />
                        <InputError message={errors.legal_id || validationErrors.legal_id} className="mt-2" />
                        
                    </div>

                    <p className="text-gray-500 text-sm mt-3">
                            Importante: La autoevaluación y las siguientes etapas del licenciamiento Marca País estará asociado a la cédula jurídica de la empresa y no al perfil del usuario principal.
                        </p>

                    <div className="flex gap-4 mt-10">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors"
                        >
                            Continuar
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-gray-600 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors border border-gray-300"
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                    {/* <div className="text-sm mt-3">
                        ¿Su empresa ya fue registrada?{" "}
                        <a href={''} className="text-green-700 hover:underline">
                            Solicitar acceso
                        </a>
                    </div> */}
                </form>
            </div>
        </ImageLayout>
    );
} 