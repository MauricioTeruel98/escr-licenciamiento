import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function CompanyExpiration({ title, description }) {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [stats, setStats] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');

    // Cargar estadísticas al montar el componente
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await axios.get('/api/company-expiration/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const showMessage = (text, type = 'info') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage(null);
            setMessageType('');
        }, 5000);
    };

    const handleUpload = async () => {
        if (!file) {
            showMessage('Por favor selecciona un archivo Excel para subir.', 'warning');
            return;
        }

        // Validar tipo de archivo
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];

        if (!allowedTypes.includes(file.type)) {
            showMessage('Solo se permiten archivos Excel (.xlsx, .xls) o CSV.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('excel_file', file);

        setIsUploading(true);

        try {
            const response = await axios.post('/api/company-expiration/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const { processed, updated, not_found, not_found_details } = response.data.data;
                
                let message = `Procesamiento completado: ${updated} empresas actualizadas de ${processed} registros procesados.`;
                if (not_found > 0) {
                    message += ` ${not_found} empresas no encontradas.`;
                }

                showMessage(message, 'success');

                // Limpiar el archivo y recargar estadísticas
                setFile(null);
                loadStats();
            }
        } catch (error) {
            console.error('Error al subir archivo:', error);
            const errorMessage = error.response?.data?.message || 'Error al procesar el archivo';
            
            showMessage(errorMessage, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        // Crear un template simple en CSV
        const csvContent = "data:text/csv;charset=utf-8,Fecha Vencimiento,Cedula Juridica,Nombre Empresa\n2025-12-31,123456789,Empresa Ejemplo";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "template_fechas_vencimiento.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <SuperAdminLayout>
            <Head title={title} />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                            <p className="text-gray-600">{description}</p>
                        </div>

                        {/* Mensajes de notificación */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                                messageType === 'success' ? 'bg-green-50 border-green-400 text-green-700' :
                                messageType === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
                                messageType === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
                                'bg-blue-50 border-blue-400 text-blue-700'
                            }`}>
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        {messageType === 'success' && <span className="text-2xl">✅</span>}
                                        {messageType === 'error' && <span className="text-2xl">❌</span>}
                                        {messageType === 'warning' && <span className="text-2xl">⚠️</span>}
                                        {messageType === 'info' && <span className="text-2xl">ℹ️</span>}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium">{message}</p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <button
                                            onClick={() => {setMessage(null); setMessageType('');}}
                                            className="text-sm font-medium hover:opacity-75"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Estadísticas */}
                        {stats && (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm font-medium text-blue-800">Total Empresas</p>
                                    <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <p className="text-sm font-medium text-green-800">Nuevas</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.nueva}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <p className="text-sm font-medium text-yellow-800">En Evaluación</p>
                                    <p className="text-2xl font-bold text-yellow-900">{stats.en_evaluacion}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <p className="text-sm font-medium text-red-800">En Renovación</p>
                                    <p className="text-2xl font-bold text-red-900">{stats.en_renovacion}</p>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                    <p className="text-sm font-medium text-indigo-800">Con Fecha Venc.</p>
                                    <p className="text-2xl font-bold text-indigo-900">{stats.con_fecha_vencimiento}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-sm font-medium text-gray-800">Sin Fecha Venc.</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.sin_fecha_vencimiento}</p>
                                </div>
                            </div>
                        )}

                        {/* Instrucciones */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">Instrucciones</h3>
                            <div className="text-blue-700">
                                <p className="mb-2">El archivo Excel debe contener las siguientes columnas en este orden:</p>
                                <ol className="list-decimal list-inside space-y-1 ml-4">
                                    <li><strong>Fecha de Vencimiento:</strong> En formato DD/MM/AAAA o AAAA-MM-DD</li>
                                    <li><strong>Cédula Jurídica:</strong> Número de cédula jurídica de la empresa</li>
                                    <li><strong>Nombre de la Empresa:</strong> Nombre completo de la empresa</li>
                                </ol>
                                <p className="mt-3 text-sm">
                                    El sistema buscará primero por cédula jurídica, y si no encuentra coincidencia, buscará por nombre de empresa.
                                    Si no encuentra ninguna coincidencia, la empresa se omitirá y su fecha de vencimiento quedará como nula.
                                </p>
                            </div>
                        </div>

                        {/* Botón para descargar template */}
                        <div className="mb-6">
                            <button
                                onClick={downloadTemplate}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                            >
                                📥 Descargar Plantilla
                            </button>
                        </div>

                        {/* Área de carga de archivo */}
                        <div className="mb-6">
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                                    dragOver
                                        ? 'border-blue-400 bg-blue-50'
                                        : file
                                        ? 'border-green-400 bg-green-50'
                                        : 'border-gray-300 bg-gray-50'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="space-y-4">
                                    <div className="text-4xl">
                                        {file ? '📄' : '📁'}
                                    </div>
                                    <div>
                                        {file ? (
                                            <div>
                                                <p className="text-lg font-medium text-green-700">
                                                    Archivo seleccionado: {file.name}
                                                </p>
                                                <p className="text-sm text-green-600">
                                                    Tamaño: {(file.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-lg text-gray-600">
                                                    Arrastra tu archivo Excel aquí o haz clic para seleccionar
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Formatos soportados: .xlsx, .xls, .csv
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                                        >
                                            Seleccionar Archivo
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleUpload}
                                disabled={!file || isUploading}
                                className={`px-6 py-3 rounded-lg font-medium transition duration-150 ease-in-out ${
                                    !file || isUploading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {isUploading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        Procesando...
                                    </div>
                                ) : (
                                    '🚀 Procesar Archivo'
                                )}
                            </button>
                            
                            {file && (
                                <button
                                    onClick={() => setFile(null)}
                                    className="px-6 py-3 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition duration-150 ease-in-out"
                                >
                                    🗑️ Limpiar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
