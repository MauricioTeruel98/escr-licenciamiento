import { useState } from "react";
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import ImageLayout from "@/Layouts/ImageLayout";
export default function LegalId() {
    const { data, setData, post, processing, errors } = useForm({
        legal_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('legal-id.verify'));
    };

    // Función para manejar el logout
    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <ImageLayout title="Verificación de Identidad">
            <div className="max-w-md w-full mx-auto">
                <h1 className="text-2xl font-semibold mb-4">¡Bienvenido!</h1>

                <p className="text-gray-600 mb-8">
                    La autoevaluación estará asociada a la cédula jurídica de la empresa, no al perfil del usuario. Complete el registro de su empresa.
                </p>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="legal_id" className="block text-sm">
                            Cédula Jurídica
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="legal_id"
                            type="text"
                            value={data.legal_id}
                            onChange={(e) => setData('legal_id', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="#-###-######"
                            required
                        />
                        <InputError message={errors.legal_id} className="mt-2" />
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors"
                        >
                            Continuar
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        ¿Su empresa ya fue registrada?{" "}
                        {/* <a href={route('request-access')} className="text-green-700 hover:underline">
                                Solicitar acceso
                            </a> */}
                    </div>
                </form>
            </div>
        </ImageLayout>
    );
} 