import DashboardLayout from "@/Layouts/DashboardLayout";
import { useState, useRef, useEffect } from "react";
import { Trash2, X } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import axios from 'axios';
import { router } from '@inertiajs/react';

// Componente Modal de confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, certName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex justify-center mb-4">
                    <div className="rounded-full p-2 bg-red-50">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                </div>

                <h3 className="text-center text-lg font-semibold mb-2">
                    Borrar {certName}
                </h3>
                <p className="text-center text-gray-600 text-sm mb-6">
                    ¿Esta seguro que quiere borrar el certificado?
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Certifications({ certifications: initialCertifications, availableCertifications, userName }) {
    const [certificaciones, setCertificaciones] = useState(
        initialCertifications.map(cert => ({
            ...cert,
            fecha_obtencion: cert.fecha_obtencion ? new Date(cert.fecha_obtencion) : null,
            fecha_expiracion: cert.fecha_expiracion ? new Date(cert.fecha_expiracion) : null
        }))
    );

    // Simplificamos los estados del formulario
    const [nombreCertificacion, setNombreCertificacion] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [nuevaCertificacion, setNuevaCertificacion] = useState({
        fechaObtencion: null,
        fechaExpiracion: null
    });

    // Agregar estados para el modal
    const [modalOpen, setModalOpen] = useState(false);
    const [certToDelete, setCertToDelete] = useState(null);

    // Agregar estados necesarios para el buscador
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Filtrar sugerencias basadas en el término de búsqueda
    const filteredSuggestions = availableCertifications.filter(cert =>
        cert.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setNombreCertificacion(value);
        setIsDropdownOpen(true);
    };

    const handleClear = () => {
        setSearchTerm("");
        setNombreCertificacion("");
        setIsDropdownOpen(false);
    };

    // Agregar useEffect para cerrar el dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Agregar estado para el error de fecha
    const [fechaError, setFechaError] = useState("");

    // Función para validar la fecha de expiración
    const validarFechaExpiracion = (fecha) => {
        if (!fecha) return;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fecha < hoy) {
            setFechaError("El certificado ha expirado.");
            return false;
        }

        setFechaError("");
        return true;
    };

    // Actualizar el handleSubmit para incluir la validación
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombreCertificacion || !nuevaCertificacion.fechaObtencion || !nuevaCertificacion.fechaExpiracion) return;

        // Validar fecha de expiración antes de enviar
        if (!validarFechaExpiracion(nuevaCertificacion.fechaExpiracion)) return;

        try {
            const response = await axios.post('/certifications', {
                nombre: nombreCertificacion,
                fecha_obtencion: nuevaCertificacion.fechaObtencion.toISOString().split('T')[0],
                fecha_expiracion: nuevaCertificacion.fechaExpiracion.toISOString().split('T')[0]
            });

            const newCertification = {
                ...response.data,
                fecha_obtencion: new Date(response.data.fecha_obtencion),
                fecha_expiracion: new Date(response.data.fecha_expiracion)
            };

            setCertificaciones([newCertification, ...certificaciones]);
            setNombreCertificacion("");
            setSearchTerm("");
            setNuevaCertificacion({
                fechaObtencion: null,
                fechaExpiracion: null
            });
        } catch (error) {
            console.error('Error al crear certificación:', error);
        }
    };

    const handleSave = async (id) => {
        const cert = certificaciones.find(c => c.id === id);
        try {
            await axios.put(`/certifications/${id}`, {
                fecha_obtencion: cert.fecha_obtencion.toISOString().split('T')[0],
                fecha_expiracion: cert.fecha_expiracion.toISOString().split('T')[0]
            });

            setCertificaciones(certificaciones.map(cert =>
                cert.id === id ? { ...cert, editando: false } : cert
            ));
        } catch (error) {
            console.error('Error al actualizar certificación:', error);
        }
    };

    const handleChange = (id, field, value) => {
        setCertificaciones(certificaciones.map(cert =>
            cert.id === id ? { ...cert, [field]: value } : cert
        ));
    };

    // Agregar función para manejar el inicio del borrado
    const handleDelete = (certification) => {
        setCertToDelete(certification);
        setModalOpen(true);
    };

    // Agregar función para confirmar el borrado
    const confirmDelete = async () => {
        if (!certToDelete) return;

        try {
            await axios.delete(`/certifications/${certToDelete.id}`);
            setCertificaciones(certificaciones.filter(cert => cert.id !== certToDelete.id));
            setModalOpen(false);
            setCertToDelete(null);
        } catch (error) {
            console.error('Error al eliminar certificación:', error);
        }
    };

    // Agregar función para editar
    const handleEdit = (id) => {
        setCertificaciones(certificaciones.map(cert =>
            cert.id === id ? { ...cert, editando: true } : cert
        ));
    };

    // En la parte del formulario, reemplazamos el buscador por un input simple
    return (
        <DashboardLayout userName={userName} title="Certificaciones">
            <div className="space-y-8">
                <h1 className="text-2xl font-bold">
                    Certificaciones
                </h1>
                <p className="text-gray-600">
                    Si su empresa cuenta con certificaciones previas, puede optar por homologarlas.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Columna izquierda - Formulario */}
                    <div className="p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-6">Agregar certificado</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative" ref={dropdownRef}>
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Nombre de la certificación<span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <div className="flex items-center border rounded-md">
                                    <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar o escribir certificación"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className="pl-10 pr-8 py-2 w-full border-none rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                        required
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            className="absolute right-2 p-1"
                                        >
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {isDropdownOpen && filteredSuggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                                        {filteredSuggestions.map((cert, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setNombreCertificacion(cert);
                                                    setSearchTerm(cert);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {cert}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Fecha de obtención<span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <DatePicker
                                    selected={nuevaCertificacion.fechaObtencion}
                                    onChange={(date) => setNuevaCertificacion({
                                        ...nuevaCertificacion,
                                        fechaObtencion: date
                                    })}
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full px-3 py-2 border rounded-md border-gray-300"
                                    required
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    yearDropdownItemNumber={10}
                                    scrollableYearDropdown
                                />
                            </div>

                            <div className="form-control">
                                <label className={`label ${fechaError ? 'text-red-600' : ''}`}>
                                    <span className="label-text text-sm font-medium">
                                        Fecha de expiración<span className="text-red-500">*</span>
                                    </span>
                                </label>

                                <DatePicker
                                    selected={nuevaCertificacion.fechaExpiracion}
                                    onChange={(date) => {
                                        setNuevaCertificacion({
                                            ...nuevaCertificacion,
                                            fechaExpiracion: date
                                        });
                                        validarFechaExpiracion(date);
                                    }}
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className={`w-full px-3 py-2 border rounded-md ${fechaError
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                        }`}
                                    required
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    yearDropdownItemNumber={10}
                                    scrollableYearDropdown
                                />

                                {fechaError && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {fechaError}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
                                disabled={!nombreCertificacion || !nuevaCertificacion.fechaObtencion || !nuevaCertificacion.fechaExpiracion || fechaError}
                            >
                                Agregar
                            </button>
                        </form>
                    </div>

                    {/* Columna derecha - Listado de certificaciones */}
                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold mb-6">Certificaciones agregadas</h2>
                        {certificaciones.length > 0 ? (
                            <div className="space-y-4">
                                {certificaciones.map((cert) => (
                                    <div key={cert.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex flex-col md:flex-row justify-between space-y-4">
                                            {/* Primera fila: Nombre y botón editar */}
                                            <div>
                                                <div className="flex flex-col justify-between items-start">
                                                    <h3 className="text-lg font-semibold">{cert.nombre}</h3>
                                                    <div className="flex items-center mt-5">
                                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold">
                                                            {cert.indicadores} Indicadores homologados.
                                                        </span>
                                                    </div>
                                                </div>


                                            </div>

                                            <div>
                                                {cert.editando ? (
                                                    <div className="grid grid-cols-2 gap-8">
                                                        <div>
                                                            <label className="block text-md font-semibold">
                                                                Fecha de obtención<span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="flex items-center h-16">
                                                                <DatePicker
                                                                    selected={cert.fecha_obtencion}
                                                                    onChange={(date) => handleChange(cert.id, 'fecha_obtencion', date)}
                                                                    locale={es}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    dropdownMode="select"
                                                                    yearDropdownItemNumber={10}
                                                                    scrollableYearDropdown
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-md font-semibold">
                                                                Fecha de expiración<span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="flex items-center h-16">
                                                                <DatePicker
                                                                    selected={cert.fecha_expiracion}
                                                                    onChange={(date) => handleChange(cert.id, 'fecha_expiracion', date)}
                                                                    locale={es}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    dropdownMode="select"
                                                                    yearDropdownItemNumber={10}
                                                                    scrollableYearDropdown
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-between gap-10">
                                                        <div className="flex flex-col">
                                                            <span className="text-md font-semibold">Fecha de obtención:</span>
                                                            <div className="flex items-center h-16">
                                                                <span className="text-center rounded-md bg-green-50/50 px-2 py-1 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                    {cert.fecha_obtencion.toLocaleDateString('es-ES', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-md font-semibold">Fecha de expiración:</span>
                                                            <div className="flex items-center h-16">
                                                                <span className="text-center rounded-md bg-amber-50/50 px-2 py-1 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                                    {cert.fecha_expiracion.toLocaleDateString('es-ES', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="mt-10">
                                                    {!cert.editando && (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(cert.id)}
                                                                className="px-4 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                                                            >
                                                                Editar
                                                            </button>
                                                        </div>
                                                    )}
                                                    {/* Botones de acción en modo edición */}
                                                    {cert.editando && (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleDelete(cert)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleSave(cert.id)}
                                                                className="px-4 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                                                            >
                                                                Aceptar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        Agregue sus certificaciones previas.
                                    </h2>
                                    <p className="text-gray-600">
                                        Si su empresa cuenta con certificaciones previas, puede optar por homologarlas.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setCertToDelete(null);
                }}
                onConfirm={confirmDelete}
                certName={certToDelete?.nombre}
            />
        </DashboardLayout>
    );
}