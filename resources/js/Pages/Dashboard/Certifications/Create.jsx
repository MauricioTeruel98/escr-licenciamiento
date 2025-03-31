import DashboardLayout from "@/Layouts/DashboardLayout";
import { useState, useRef, useEffect } from "react";
import { Trash2, X } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import axios from 'axios';
import Toast from '@/Components/Toast';

// Componente Modal de confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, certName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">
                                    Borrar {certName}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        ¿Está seguro que quiere borrar el certificado? Esta acción no se puede deshacer.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                            <button
                                onClick={onConfirm}
                                className="inline-flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={onClose}
                                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Agregar estos componentes para el diseño del input de archivos
const FileUploadInput = ({ onFileChange, selectedFiles, onRemoveFile }) => {
    const inputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        onFileChange({ target: { files } });
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return (
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        } else if (fileType === 'application/pdf') {
            return (
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            );
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        } else if (fileType.includes('sheet') || fileType.includes('excel')) {
            return (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        }
        return (
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        );
    };

    return (
        <div className="space-y-4">
            <div
                className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors duration-200 ease-in-out"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={inputRef}
                    onChange={onFileChange}
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                />
                <div className="flex flex-col items-center text-center">
                    <div className="flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-upload text-gray-400"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 9l5 -5l5 5" /><path d="M12 4l0 12" /></svg>
                    </div>
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
                            <span>Cargar archivos</span>
                        </label>
                        <p className="pl-1">o arrastrar y soltar</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                        JPG, JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX hasta 5MB
                    </p>
                </div>
            </div>

            {/* Lista de archivos seleccionados */}
            {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
                    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-3">
                                    {getFileIcon(file.type)}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemoveFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Certifications({ certifications: initialCertifications, availableCertifications, userName }) {

    const [certificaciones, setCertificaciones] = useState(
        initialCertifications.map(cert => {
            const obtenerFechaLocal = (fecha) => {
                if (!fecha) return null;
                const [year, month, day] = fecha.split("T")[0].split("-");
                return new Date(year, month - 1, day);
            };

            return {
                ...cert,
                fecha_obtencion: obtenerFechaLocal(cert.fecha_obtencion),
                fecha_expiracion: obtenerFechaLocal(cert.fecha_expiracion)
            };
        })
    );

    // Simplificamos los estados del formulario
    const [nombreCertificacion, setNombreCertificacion] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedCertification, setSelectedCertification] = useState(null);
    const [nuevaCertificacion, setNuevaCertificacion] = useState({
        fechaObtencion: null,
        fechaExpiracion: null,
        organismoCertificador: ""
    });

    // Agregar estados para el modal
    const [modalOpen, setModalOpen] = useState(false);
    const [certToDelete, setCertToDelete] = useState(null);

    // Agregar estados necesarios para el buscador
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Filtrar sugerencias basadas en el término de búsqueda
    const filteredSuggestions = availableCertifications.filter(cert =>
        cert.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Agregar funciones de validación para los campos
    const validarInput = (value, tipo) => {
        // Si el valor es undefined o no es una cadena, devolverlo sin cambios
        if (value === undefined || value === null || typeof value !== 'string') {
            return value;
        }

        // Eliminar espacios al inicio para todos los campos
        let valorLimpio = value.trimStart();

        switch (tipo) {
            case 'nombre':
                // No permitir comillas simples o dobles, barras o barras invertidas
                valorLimpio = valorLimpio.replace(/['"\\\/]/g, '');
                break;
            case 'fecha':
                // Solo permitir números y barras
                valorLimpio = valorLimpio.replace(/[^0-9\/]/g, '');
                break;
            case 'organismo':
                // Solo permitir letras y números
                valorLimpio = valorLimpio.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
                break;
            default:
                break;
        }

        return valorLimpio;
    };

    const handleSearchChange = (e) => {
        const value = validarInput(e.target.value, 'nombre');
        setSearchTerm(value);
        setIsDropdownOpen(true);
    };

    const handleClear = () => {
        setSearchTerm("");
        setNombreCertificacion("");
        setSelectedCertification(null);
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
    const [fechaErrores, setFechaErrores] = useState({}); // Para manejar errores por certificación

    // Función para validar la fecha de expiración
    const validarFechaExpiracion = (fecha, id = null) => {
        if (!fecha) return false;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fecha < hoy) {
            if (id) {
                setFechaErrores(prev => ({
                    ...prev,
                    [id]: "El certificado ha expirado."
                }));
            } else {
                setFechaError("El certificado ha expirado.");
            }
            return false;
        }

        if (id) {
            setFechaErrores(prev => ({
                ...prev,
                [id]: ""
            }));
        } else {
            setFechaError("");
        }
        return true;
    };

    // Agregar estado para el error de fecha de obtención
    const [fechaObtencionError, setFechaObtencionError] = useState("");
    const [fechaObtencionErrores, setFechaObtencionErrores] = useState({}); // Para manejar errores por certificación

    // Función para validar la fecha de obtención
    const validarFechaObtencion = (fecha, id = null) => {
        if (!fecha) return false;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fecha > hoy) {
            if (id) {
                setFechaObtencionErrores(prev => ({
                    ...prev,
                    [id]: "La fecha de obtención no puede ser posterior a la fecha actual."
                }));
            } else {
                setFechaObtencionError("La fecha de obtención no puede ser posterior a la fecha actual.");
            }
            return false;
        }

        if (id) {
            setFechaObtencionErrores(prev => ({
                ...prev,
                [id]: ""
            }));
        } else {
            setFechaObtencionError("");
        }
        return true;
    };

    // Agregar después de los estados existentes
    const [notification, setNotification] = useState({ type: '', message: '' });

    // Función helper para mostrar notificaciones
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    };

    // Agregar estado para el indicador de carga
    const [loading, setLoading] = useState(false);

    // Agregar estos estados después de los estados existentes
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileErrors, setFileErrors] = useState([]);

    // Agregar esta función para manejar la selección de archivos
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + selectedFiles.length > 3) {
            setFileErrors(['Solo se permiten hasta 3 archivos']);
            return;
        }

        const newErrors = [];
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        const validFiles = files.filter(file => {
            if (!validTypes.includes(file.type)) {
                newErrors.push(`Tipo de archivo no válido: ${file.name}`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                newErrors.push(`Archivo demasiado grande: ${file.name}`);
                return false;
            }
            return true;
        });

        setFileErrors(newErrors);
        if (validFiles.length > 0) {
            setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 3));
        }
    };

    // Modificar el handleSubmit para incluir los archivos
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCertification || !nuevaCertificacion.fechaObtencion || !nuevaCertificacion.fechaExpiracion) return;

        if (!validarFechaObtencion(nuevaCertificacion.fechaObtencion)) return;
        if (!validarFechaExpiracion(nuevaCertificacion.fechaExpiracion)) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('nombre', selectedCertification.nombre);
        formData.append('homologation_id', selectedCertification.id);
        formData.append('fecha_obtencion', nuevaCertificacion.fechaObtencion.toISOString().split('T')[0]);
        formData.append('fecha_expiracion', nuevaCertificacion.fechaExpiracion.toISOString().split('T')[0]);
        formData.append('organismo_certificador', nuevaCertificacion.organismoCertificador);

        selectedFiles.forEach(file => {
            formData.append('files[]', file);
        });

        try {
            const response = await axios.post('/certifications', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const newCertification = {
                ...response.data.certification,
                fecha_obtencion: new Date(response.data.certification.fecha_obtencion),
                fecha_expiracion: new Date(response.data.certification.fecha_expiracion)
            };

            setCertificaciones([newCertification, ...certificaciones]);
            setNombreCertificacion("");
            setSearchTerm("");
            setSelectedCertification(null);
            setNuevaCertificacion({
                fechaObtencion: null,
                fechaExpiracion: null,
                organismoCertificador: ""
            });
            setSelectedFiles([]);
            setFileErrors([]);

            showNotification('success', response.data.message);
            window.location.reload();
        } catch (error) {
            if (error.response?.status === 422 && error.response?.data?.error?.includes('Ya existe una certificación')) {
                showNotification('error', 'Ya existe una certificación con este nombre para su empresa');
                // Resaltar el campo de nombre de certificación
                const inputElement = document.getElementById('nombreCertificacion');
                if (inputElement) {
                    inputElement.focus();
                    inputElement.classList.add('border-red-500');
                    setTimeout(() => {
                        inputElement.classList.remove('border-red-500');
                    }, 3000);
                }
            } else {
                showNotification('error', error.response?.data?.error || 'Error al crear la certificación');
            }
        } finally {
            setLoading(false); // Finalizar el estado de carga
        }
    };

    const handleSave = async (id) => {
        const cert = certificaciones.find(c => c.id === id);

        if (!validarFechaObtencion(cert.fecha_obtencion, id)) return;
        if (!validarFechaExpiracion(cert.fecha_expiracion, id)) return;

        try {
            const formData = new FormData();
            formData.append('fecha_obtencion', cert.fecha_obtencion.toISOString().split('T')[0]);
            formData.append('fecha_expiracion', cert.fecha_expiracion.toISOString().split('T')[0]);
            formData.append('organismo_certificador', cert.organismo_certificador || '');

            // Agregar nuevos archivos si existen
            if (cert.newFiles) {
                cert.newFiles.forEach(file => {
                    formData.append('files[]', file);
                });
            }

            const response = await axios.post(`/certifications/${id}?_method=PUT`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setCertificaciones(certificaciones.map(cert =>
                cert.id === id ? { ...cert, editando: false } : cert
            ));

            setFechaErrores(prev => ({
                ...prev,
                [id]: ""
            }));

            showNotification('success', response.data.message);
            window.location.reload();
        } catch (error) {
            showNotification('error', error.response?.data?.error || 'Error al actualizar la certificación');
        }
    };

    // Agregar esta función para manejar la carga de nuevos archivos en modo edición
    const handleEditFileChange = (id, files) => {
        setCertificaciones(certificaciones.map(cert =>
            cert.id === id ? {
                ...cert,
                newFiles: [...(cert.newFiles || []), ...Array.from(files)]
            } : cert
        ));
    };

    const handleChange = (id, field, value) => {
        // Crear copia local del objeto de certificación
        const certToUpdate = certificaciones.find(cert => cert.id === id);
        if (!certToUpdate) return;

        let updatedValue = value;

        // Validar fecha de expiración si es necesario
        if (field === 'fecha_expiracion' && value instanceof Date) {
            validarFechaExpiracion(value, id);
        }

        // Solo aplicar validación de texto a valores de tipo string
        if (typeof value === 'string') {
            let tipo = '';
            if (field.includes('fecha')) {
                tipo = 'fecha';
            } else if (field === 'organismo_certificador') {
                tipo = 'organismo';
            } else {
                tipo = 'nombre';
            }
            updatedValue = validarInput(value, tipo);
        }

        // Actualizar la certificación en el estado
        setCertificaciones(certificaciones.map(cert =>
            cert.id === id ? { ...cert, [field]: updatedValue } : cert
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
            const response = await axios.delete(`/certifications/${certToDelete.id}`);
            setCertificaciones(certificaciones.filter(cert => cert.id !== certToDelete.id));
            setModalOpen(false);
            setCertToDelete(null);
            showNotification('success', response.data.message);
        } catch (error) {
            showNotification('error', error.response?.data?.error || 'Error al eliminar la certificación');
        }
    };

    // Agregar función para editar
    const handleEdit = (id) => {
        setCertificaciones(certificaciones.map(cert =>
            cert.id === id ? { ...cert, editando: true } : cert
        ));
    };

    // Agregar función para cancelar la edición
    const handleCancelEdit = (id) => {
        // Obtener la certificación original de initialCertifications
        const certOriginal = initialCertifications.find(c => c.id === id);

        if (!certOriginal) return;

        // Restaurar los valores originales y desactivar el modo de edición
        setCertificaciones(certificaciones.map(cert =>
            cert.id === id ? {
                ...cert,
                fecha_obtencion: new Date(certOriginal.fecha_obtencion),
                fecha_expiracion: new Date(certOriginal.fecha_expiracion),
                organismo_certificador: certOriginal.organismo_certificador,
                editando: false
            } : cert
        ));

        // Limpiar cualquier error asociado a esta certificación
        setFechaErrores(prev => ({
            ...prev,
            [id]: ""
        }));
    };

    const estaExpirado = (fecha) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return new Date(fecha) < hoy;
    };

    // Agregar este componente para mostrar los archivos seleccionados
    const FileList = ({ files, onRemove }) => {
        return (
            <div className="mt-2">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    // Agregar esta función para descargar archivos
    const handleDownload = (filePath, fileName) => {
        const link = document.createElement('a');
        link.href = `/storage/${filePath}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Agregar esta función para eliminar archivos
    const handleDeleteFile = async (certificationId, filePath) => {
        try {
            const response = await axios.delete(`/certifications/${certificationId}/files`, {
                data: { file_path: filePath }
            });

            if (response.data.success) {
                // Actualizar el estado de las certificaciones
                setCertificaciones(certificaciones.map(cert => {
                    if (cert.id === certificationId) {
                        const updatedFiles = JSON.parse(cert.file_paths).filter(path => path !== filePath);
                        return { ...cert, file_paths: JSON.stringify(updatedFiles) };
                    }
                    return cert;
                }));
                showNotification('success', 'Archivo eliminado correctamente');
            }
        } catch (error) {
            showNotification('error', 'Error al eliminar el archivo');
        }
    };

    // En la parte del formulario, reemplazamos el buscador por un input simple
    return (
        <DashboardLayout userName={userName} title="Certificaciones">
            <div className="space-y-8">
                <h1 className="text-2xl font-bold">
                    Certificaciones
                </h1>
                <p className="text-gray-600">
                    Registre sus certificaciones en nuestro plataforma para su homologación con la marca país.
                </p>

                <div className="md:grid md:grid-cols-3 gap-8">
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
                                        id="nombreCertificacion"
                                        placeholder="Seleccione una certificación"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className={`pl-10 pr-8 py-2 w-full border-none rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 ${nombreCertificacion && !availableCertifications.includes(nombreCertificacion)
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : ''
                                            }`}
                                        required
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            className="absolute right-2 p-1"
                                        >
                                            <X className="h-5 w-5 text-gray-400" />
                                        </button>
                                    )}
                                </div>
                                {isDropdownOpen && filteredSuggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredSuggestions.map((cert) => (
                                            <div
                                                key={cert.id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setNombreCertificacion(cert.nombre);
                                                    setSearchTerm(cert.nombre);
                                                    setSelectedCertification(cert);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {cert.nombre}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {isDropdownOpen && filteredSuggestions.length === 0 && searchTerm && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-gray-500">
                                        No hay certificaciones disponibles que coincidan con su búsqueda
                                    </div>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    Seleccione una certificación de la lista disponible
                                </p>
                            </div>

                            <div className="form-control">
                                <label className={`label ${fechaObtencionError ? 'text-red-600' : ''}`}>
                                    <span className={`label-text text-sm font-medium ${fechaObtencionError ? 'text-red-600 font-bold' : ''}`}>
                                        Fecha de obtención<span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <DatePicker
                                    selected={nuevaCertificacion.fechaObtencion}
                                    onChange={(date) => {
                                        setNuevaCertificacion({
                                            ...nuevaCertificacion,
                                            fechaObtencion: date
                                        });
                                        validarFechaObtencion(date);
                                    }}
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className={`w-full px-3 py-2 border rounded-md ${fechaObtencionError
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
                                {fechaObtencionError && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {fechaObtencionError}
                                    </p>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
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

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Organismo certificador<span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={nuevaCertificacion.organismoCertificador}
                                    onChange={(e) => setNuevaCertificacion({
                                        ...nuevaCertificacion,
                                        organismoCertificador: validarInput(e.target.value, 'organismo')
                                    })}
                                    className={`w-full px-3 py-2 border rounded-md ${!nuevaCertificacion.organismoCertificador
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                        }`}
                                    required
                                />
                                {!nuevaCertificacion.organismoCertificador && (
                                    <p className="mt-1 text-sm text-red-600">
                                        El organismo certificador es obligatorio
                                    </p>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Archivos de evidencia<span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <FileUploadInput
                                    onFileChange={handleFileChange}
                                    selectedFiles={selectedFiles}
                                    onRemoveFile={(index) => {
                                        setSelectedFiles(files => files.filter((_, i) => i !== index));
                                    }}
                                />
                                {fileErrors.length > 0 && (
                                    <div className="mt-2">
                                        {fileErrors.map((error, index) => (
                                            <p key={index} className="text-sm text-red-600">{error}</p>
                                        ))}
                                    </div>
                                )}
                                {selectedFiles.length === 0 && (
                                    <p className="mt-1 text-sm text-red-600">
                                        Debe cargar al menos un archivo de evidencia
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50 flex items-center justify-center"
                                disabled={!nombreCertificacion ||
                                    !nuevaCertificacion.fechaObtencion ||
                                    !nuevaCertificacion.fechaExpiracion ||
                                    !nuevaCertificacion.organismoCertificador ||
                                    fechaError ||
                                    loading ||
                                    selectedFiles.length === 0}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        {!nuevaCertificacion.organismoCertificador ? (
                                            <span className="text-sm">Debe ingresar el organismo certificador</span>
                                        ) : selectedFiles.length === 0 ? (
                                            <span className="text-sm">Debe cargar al menos un archivo de evidencia</span>
                                        ) : (
                                            'Agregar'
                                        )}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Columna derecha - Listado de certificaciones */}
                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold mb-6">Certificaciones agregadas</h2>
                        {certificaciones.length > 0 ? (
                            <div className="space-y-4">
                                {certificaciones.map((cert) => {
                                    const certificadoExpirado = estaExpirado(cert.fecha_expiracion);
                                    const files = JSON.parse(cert.file_paths || '[]');

                                    return (
                                        <>
                                            <div key={cert.id} className={`p-4 rounded-lg shadow-sm border border-gray-200 ${certificadoExpirado ? 'border-2 border-red-400 rounded-lg bg-red-100/50' : 'bg-white'}`}>
                                                <div className="flex flex-col xl:flex-row justify-between space-y-4 gap-4">
                                                    {/* Primera fila: Nombre y botón editar */}
                                                    <div>
                                                        <div className="flex flex-col justify-between items-start">
                                                            <h3 className="text-lg font-semibold">{cert.nombre}</h3>
                                                            <div className="mt-2">
                                                                <span className="text-sm text-gray-600 font-medium">Organismo certificador:</span>
                                                                {cert.editando ? (
                                                                    <input
                                                                        type="text"
                                                                        value={cert.organismo_certificador || ''}
                                                                        onChange={(e) => handleChange(cert.id, 'organismo_certificador', e.target.value)}
                                                                        className="ml-2 px-2 py-1 border rounded-md text-sm w-56"
                                                                    />
                                                                ) : (
                                                                    <span className="ml-2 text-sm">{cert.organismo_certificador || 'N/A'}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center mt-5">
                                                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-blue-600/20">
                                                                    {cert.indicadores} Indicadores homologados.

                                                                </span>
                                                            </div>
                                                        </div>


                                                    </div>

                                                    <div className="divider flex lg:hidden"></div>

                                                    <div>
                                                        {cert.editando ? (
                                                            <div className="grid xl:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className={`block text-md font-semibold ${fechaObtencionErrores[cert.id] ? 'text-red-600' : ''}`}>
                                                                        Fecha de obtención<span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="">
                                                                        <DatePicker
                                                                            selected={cert.fecha_obtencion}
                                                                            onChange={(date) => {
                                                                                handleChange(cert.id, 'fecha_obtencion', date);
                                                                                validarFechaObtencion(date, cert.id);
                                                                            }}
                                                                            locale={es}
                                                                            dateFormat="dd/MM/yyyy"
                                                                            className={`w-full px-3 py-2 border rounded-md ${fechaObtencionErrores[cert.id]
                                                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                                : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                                                                }`}
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            yearDropdownItemNumber={10}
                                                                            scrollableYearDropdown
                                                                        />
                                                                        {fechaObtencionErrores[cert.id] && (
                                                                            <p className="mt-1 text-sm text-red-600">
                                                                                {fechaObtencionErrores[cert.id]}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className={`block text-md font-semibold ${fechaErrores[cert.id] ? 'text-red-600' : ''}`}>
                                                                        Fecha de expiración<span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="">
                                                                        <DatePicker
                                                                            selected={cert.fecha_expiracion}
                                                                            onChange={(date) => handleChange(cert.id, 'fecha_expiracion', date)}
                                                                            locale={es}
                                                                            dateFormat="dd/MM/yyyy"
                                                                            className={`w-full px-3 py-2 border rounded-md ${fechaErrores[cert.id]
                                                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                                : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                                                                }`}
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            yearDropdownItemNumber={10}
                                                                            scrollableYearDropdown
                                                                        />
                                                                        {fechaErrores[cert.id] && (
                                                                            <p className="mt-1 text-sm text-red-600">
                                                                                {fechaErrores[cert.id]}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col xl:flex-row justify-between gap-6 xl:gap-10">
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
                                                                        className="px-4 py-1 text-sm bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 flex items-center"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                        Editar
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {/* Botones de acción en modo edición */}
                                                            {cert.editando && (
                                                                <div className="flex justify-end gap-2 mt-4">
                                                                    <button
                                                                        onClick={() => handleDelete(cert)}
                                                                        className="text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="h-5 w-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleCancelEdit(cert.id)}
                                                                        className="px-4 py-1 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                        Cancelar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSave(cert.id)}
                                                                        className={`px-4 py-1 text-sm bg-green-600 text-white border border-green-700 rounded-md hover:bg-green-700 flex items-center ${fechaErrores[cert.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        disabled={fechaErrores[cert.id]}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        Aceptar
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Sección de archivos */}
                                                <div className="mt-4">
                                                    <h4 className="text-md font-semibold mb-2">Archivos evidencia:</h4>
                                                    <div className="space-y-4">
                                                        {/* Mostrar archivos existentes */}
                                                        {files.length > 0 && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-start gap-2 flex-wrap">
                                                                    {files.map((filePath, index) => {
                                                                        const fileName = filePath.split('/').pop();
                                                                        const fileExtension = fileName.split('.').pop().toLowerCase();

                                                                        // Determinar el icono basado en la extensión
                                                                        let icon;
                                                                        if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                                                                            icon = (
                                                                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                                </svg>
                                                                            );
                                                                        } else if (fileExtension === 'pdf') {
                                                                            icon = (
                                                                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                                </svg>
                                                                            );
                                                                        } else {
                                                                            icon = (
                                                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                </svg>
                                                                            );
                                                                        }

                                                                        return (
                                                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                                                <div className="flex items-center space-x-2">
                                                                                    {icon}
                                                                                    <span className="text-sm text-gray-600">
                                                                                        {fileName.length > 20 ? fileName.substring(0, 25) + '...' : fileName}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex space-x-2">
                                                                                    <button
                                                                                        onClick={() => handleDownload(filePath, fileName)}
                                                                                        className="p-1 text-blue-600 hover:text-blue-800"
                                                                                        title="Descargar archivo"
                                                                                    >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-download"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>
                                                                                    </button>
                                                                                    {cert.editando && (
                                                                                        <button
                                                                                            onClick={() => handleDeleteFile(cert.id, filePath)}
                                                                                            className="p-1 text-red-600 hover:text-red-800"
                                                                                            title="Eliminar archivo"
                                                                                        >
                                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Input para nuevos archivos - Solo mostrar en modo edición */}
                                                        {cert.editando && (
                                                            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
                                                                <p className="text-sm font-medium text-gray-700 mb-2">Agregar nuevos archivos:</p>
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="file"
                                                                        onChange={(e) => handleEditFileChange(cert.id, e.target.files)}
                                                                        multiple
                                                                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                                                                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                                                    />
                                                                </div>
                                                                {/* Mostrar nuevos archivos seleccionados */}
                                                                {cert.newFiles && cert.newFiles.length > 0 && (
                                                                    <div className="mt-2 space-y-1">
                                                                        {cert.newFiles.map((file, index) => (
                                                                            <div key={index} className="flex items-center justify-between py-1">
                                                                                <span className="text-sm text-gray-600">{file.name}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setCertificaciones(certificaciones.map(c =>
                                                                                            c.id === cert.id ? {
                                                                                                ...c,
                                                                                                newFiles: (c.newFiles || []).filter((_, i) => i !== index)
                                                                                            } : c
                                                                                        ));
                                                                                    }}
                                                                                    className="text-red-500 hover:text-red-700"
                                                                                >
                                                                                    <X className="h-4 w-4" />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                certificadoExpirado && (
                                                    <div>
                                                        <p className="text-sm text-red-700">
                                                            Este certificado ha expirado.
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            <div className="divider"></div>
                                        </>
                                    );
                                })}
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

            {/* Implementar el Toast para mostrar notificaciones */}
            {notification.message && (
                <Toast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ type: '', message: '' })}
                />
            )}
        </DashboardLayout>
    );
}