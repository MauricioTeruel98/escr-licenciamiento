import { useState, useRef } from 'react';

export default function FileManager({
    onFileSelect,
    onFileRemove,
    files = [],
    maxFiles = 10,
    maxSize = 5242880,
    acceptedTypes = '*',
    className = '',
    dragDropText = 'Arrastre documentos o',
    buttonText = 'Cargar',
    errorMessages = {
        maxFiles: 'Número máximo de archivos excedido',
        maxSize: 'El archivo excede el tamaño máximo permitido',
        fileType: 'Tipo de archivo no permitido'
    },
    indicatorId,
    onSuccess,
    onError
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const validateFile = (file) => {
        // Validar tamaño
        if (file.size > maxSize) {
            setError(errorMessages.maxSize);
            return false;
        }

        // Validar tipo si se especificaron tipos aceptados
        if (acceptedTypes !== '*') {
            const types = acceptedTypes.split(',').map(type => type.trim());
            if (!types.some(type => file.type.match(type))) {
                setError(errorMessages.fileType);
                return false;
            }
        }

        return true;
    };

    const processFiles = (fileList) => {
        setError('');

        // Validar número máximo de archivos
        if (files.length + fileList.length > maxFiles) {
            setError(errorMessages.maxFiles);
            return;
        }

        // Convertir FileList a Array y procesar cada archivo
        Array.from(fileList).forEach(file => {
            if (validateFile(file)) {
                onFileSelect(file);
            }
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const { files: droppedFiles } = e.dataTransfer;
        processFiles(droppedFiles);
    };

    const handleFileInput = (e) => {
        const { files: selectedFiles } = e.target;
        processFiles(selectedFiles);
        // Limpiar input para permitir seleccionar el mismo archivo
        e.target.value = '';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const basename = (path) => {
        return path.split('/').pop();
    };

    const handleFileRemove = async (fileToRemove) => {
        try {
            // Si el archivo tiene una ruta en el servidor (archivo existente)
            if (fileToRemove.path) {
                const response = await axios.delete(route('evaluacion.delete-file'), {
                    data: {
                        indicator_id: indicatorId,
                        file_path: fileToRemove.path
                    }
                });

                if (response.data.success) {
                    onFileRemove(fileToRemove);
                    if (typeof onSuccess === 'function') {
                        onSuccess('Archivo eliminado correctamente');
                    }
                }
            } else {
                // Para archivos que aún no se han subido
                onFileRemove(fileToRemove);
            }
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            if (typeof onError === 'function') {
                onError(error.response?.data?.message || 'Error al eliminar el archivo');
            }
        }
    };

    return (
        <div className={className}>
            {/* Área de arrastre */}
            <div
                className={`relative border border-gray-300 rounded-lg transition-colors bg-white`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept={acceptedTypes}
                    onChange={handleFileInput}
                />

                <div className="text-center py-4">
                    <p className="text-gray-600 text-sm">
                        {dragDropText}{' '}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-green-600 hover:text-green-700 font-medium focus:outline-none"
                        >
                            {buttonText}
                        </button>
                    </p>
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>
            </div>

            {/* Lista de archivos */}
            <div className="space-y-2 mt-2">
                {files.map((file, index) => (
                    <div
                        key={`${file.name || file.path}-${index}`}
                        className="flex items-center justify-between bg-gray-600 rounded-lg px-4 py-2"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white">
                                {file.name || basename(file.path)}
                            </span>
                            <span className="text-xs text-gray-300">
                                {formatFileSize(file.size)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleFileRemove(file)}
                                className="p-1 hover:bg-gray-500 rounded"
                            >
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {file.path && (
                                <a
                                    href={`/storage/${file.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 hover:bg-gray-500 rounded"
                                >
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 