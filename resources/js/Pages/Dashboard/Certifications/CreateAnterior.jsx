import DashboardLayout from "@/Layouts/DashboardLayout";
import { useState, useRef, useEffect } from "react";
import { Trash2, X } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';

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

export default function Certifications({ userName }) {
    // Estados existentes para el buscador
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState("");
    const dropdownRef = useRef(null);

    // Nuevos estados para gestión de certificaciones
    const [certificaciones, setCertificaciones] = useState([
        {
            id: 1,
            nombre: "INTE G12:2019",
            fechaObtencion: "2023-11-29",
            fechaExpiracion: "2023-11-29",
            indicadores: 2,
            editando: false
        }
    ]);
    const [modalOpen, setModalOpen] = useState(false);
    const [certToDelete, setCertToDelete] = useState(null);
    const [nuevaCertificacion, setNuevaCertificacion] = useState({
        fechaObtencion: "",
        fechaExpiracion: ""
    });

    // Lista de certificaciones disponibles
    const certificacionesDisponibles = [
        "INTE B5:2020",
        "INTE G12:2019",
        "INTE G8:2013",
        "INTE G38:2015",
        "INTE G8:2013"
    ];

    const filteredCerts = certificacionesDisponibles.filter(cert =>
        cert.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };

    const handleSelectCert = (cert) => {
        setSelectedCert(cert);
        setSearchTerm(cert);
        setIsDropdownOpen(false);
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedCert("");
        setIsDropdownOpen(false);
    };

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

    // Nuevas funciones para gestión de certificaciones
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCert || !nuevaCertificacion.fechaObtencion || !nuevaCertificacion.fechaExpiracion) return;

        const newCert = {
            id: Date.now(),
            nombre: selectedCert,
            fechaObtencion: nuevaCertificacion.fechaObtencion,
            fechaExpiracion: nuevaCertificacion.fechaExpiracion,
            indicadores: Math.floor(Math.random() * 5) + 1,
            editando: false
        };

        setCertificaciones([...certificaciones, newCert]);
        setSelectedCert("");
        setSearchTerm("");
        setNuevaCertificacion({ fechaObtencion: "", fechaExpiracion: "" });
    };

    const handleEdit = (id) => {
        setCertificaciones(certificaciones.map(cert =>
            cert.id === id ? { ...cert, editando: true } : cert
        ));
    };

    const handleSave = (id) => {
        setCertificaciones(certificaciones.map(cert =>
            cert.id === id ? { ...cert, editando: false } : cert
        ));
    };

    const handleDelete = (cert) => {
        setCertToDelete(cert);
        setModalOpen(true);
    };

    const confirmDelete = () => {
        setCertificaciones(certificaciones.filter(cert => cert.id !== certToDelete.id));
        setModalOpen(false);
        setCertToDelete(null);
    };

    const handleChange = (id, field, value) => {
        setCertificaciones(certificaciones.map(cert =>
            cert.id === id ? { ...cert, [field]: value } : cert
        ));
    };

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
                                <div className="flex items-center border rounded-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className="pl-10 pr-8 py-2 w-full border-none rounded-md shadow-sm border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={handleClear}
                                            className="absolute right-2 p-1"
                                        >
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {isDropdownOpen && filteredCerts.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                                        {filteredCerts.map((cert, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleSelectCert(cert)}
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
                                    selected={nuevaCertificacion.fechaObtencion ? new Date(nuevaCertificacion.fechaObtencion) : null}
                                    onChange={(date) => setNuevaCertificacion({
                                        ...nuevaCertificacion,
                                        fechaObtencion: date.toISOString().split('T')[0]
                                    })}
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    yearDropdownItemNumber={10}
                                    scrollableYearDropdown
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Fecha de expiración<span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <DatePicker
                                    selected={nuevaCertificacion.fechaExpiracion ? new Date(nuevaCertificacion.fechaExpiracion) : null}
                                    onChange={(date) => setNuevaCertificacion({
                                        ...nuevaCertificacion,
                                        fechaExpiracion: date.toISOString().split('T')[0]
                                    })}
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    yearDropdownItemNumber={10}
                                    scrollableYearDropdown
                                />
                            </div>

                            <button
                                type="submit"
                                className="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
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
                                                                    selected={cert.fechaObtencion ? new Date(cert.fechaObtencion) : null}
                                                                    onChange={(date) => handleChange(cert.id, 'fechaObtencion', date.toISOString().split('T')[0])}
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
                                                                    selected={cert.fechaExpiracion ? new Date(cert.fechaExpiracion) : null}
                                                                    onChange={(date) => handleChange(cert.id, 'fechaExpiracion', date.toISOString().split('T')[0])}
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
                                                                    {new Date(cert.fechaObtencion).toLocaleDateString('es-ES', {
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
                                                                    {new Date(cert.fechaExpiracion).toLocaleDateString('es-ES', {
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