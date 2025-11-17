import { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

export default function CertificationModal({ isOpen, onClose, onSubmit, certification = null }) {
    const initialFormData = {
        nombre: '',
        fecha_obtencion: null,
        fecha_expiracion: null,
        indicadores: 0,
        company_id: '',
        homologation_id: '',
        organismo_certificador: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [companies, setCompanies] = useState([]);
    const [availableCertifications, setAvailableCertifications] = useState([]);
    const [errors, setErrors] = useState({});
    const [fechaError, setFechaError] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileErrors, setFileErrors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCertifications, setFilteredCertifications] = useState([]);
    const [selectedCertification, setSelectedCertification] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchCompanies();
            fetchAvailableCertifications();
            if (certification) {
                setFormData({
                    nombre: certification.nombre,
                    fecha_obtencion: new Date(certification.fecha_obtencion),
                    fecha_expiracion: new Date(certification.fecha_expiracion),
                    indicadores: certification.indicadores,
                    company_id: certification.company_id,
                    homologation_id: certification.homologation_id || '',
                    organismo_certificador: certification.organismo_certificador || ''
                });
                // Establecer la certificación seleccionada para la búsqueda
                setSelectedCertification({
                    id: certification.homologation_id,
                    nombre: certification.nombre
                });
                setSearchTerm(certification.nombre);
                // Si hay archivos existentes, cargarlos
                if (certification.file_paths) {
                    try {
                        const files = JSON.parse(certification.file_paths || '[]');
                        if (Array.isArray(files)) {
                            setSelectedFiles(files.map(file => ({
                                name: file.name || (file.path ? basename(file.path) : 'archivo'),
                                path: file.path || '',
                                size: file.size || 0,
                                type: file.type || 'application/octet-stream',
                                isExisting: true
                            })));
                        } else {
                            setSelectedFiles([]);
                        }
                    } catch (error) {
                        console.error('Error al parsear file_paths:', error);
                        setSelectedFiles([]);
                    }
                } else {
                    setSelectedFiles([]);
                }
            } else {
                setFormData(initialFormData);
                setSelectedFiles([]);
            }
            setErrors({});
            setFechaError("");
            setFileErrors([]);
            setSearchTerm("");
            setSelectedCertification(null);
        }
    }, [isOpen, certification]);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/companies/active');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error al cargar empresas:', error);
        }
    };

    const fetchAvailableCertifications = async () => {
        try {
            const response = await axios.get('/api/available-certifications');
            const certifications = Array.isArray(response.data) ? response.data : [];
            setAvailableCertifications(certifications);
            setFilteredCertifications(certifications);
        } catch (error) {
            console.error('Error al cargar certificaciones disponibles:', error);
            setAvailableCertifications([]);
            setFilteredCertifications([]);
        }
    };

    // Función helper para obtener el nombre del archivo
    const basename = (path) => {
        if (!path || typeof path !== 'string') {
            return 'archivo';
        }
        return path.split('/').pop() || 'archivo';
    };

    // Filtrar certificaciones disponibles
    useEffect(() => {
        if (!Array.isArray(availableCertifications)) {
            setFilteredCertifications([]);
            return;
        }
        
        if (searchTerm.trim() === '') {
            setFilteredCertifications(availableCertifications);
        } else {
            const filtered = availableCertifications.filter(cert =>
                cert.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCertifications(filtered);
        }
    }, [searchTerm, availableCertifications]);

    const handleCertificationSelect = (cert) => {
        setSelectedCertification(cert);
        setFormData({
            ...formData,
            nombre: cert.nombre,
            homologation_id: cert.id
        });
        setSearchTerm(cert.nombre);
        // Limpiar cualquier error de validación
        if (errors.certificacion_disponible) {
            setErrors({
                ...errors,
                certificacion_disponible: null
            });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const maxFiles = 3;
        const maxTotalSize = 15 * 1024 * 1024; // 15MB total
        let totalSize = 0;

        // Calcular tamaño total de archivos existentes
        selectedFiles.forEach(file => {
            if (!file.isExisting) {
                totalSize += file.size;
            }
        });

        if (selectedFiles.length + files.length > maxFiles) {
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

            totalSize += file.size;
            if (totalSize > maxTotalSize) {
                newErrors.push(`El tamaño total de los archivos no puede exceder 15MB`);
                return false;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB por archivo
                newErrors.push(`El archivo ${file.name} excede el límite de 5MB`);
                return false;
            }
            return true;
        });

        setFileErrors(newErrors);
        if (validFiles.length > 0) {
            setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 3));
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar que se haya seleccionado una certificación disponible
        if (!selectedCertification || !formData.homologation_id) {
            setErrors({
                ...errors,
                certificacion_disponible: 'Debe seleccionar una certificación disponible de la lista'
            });
            return;
        }
        
        // Validar que todos los campos requeridos estén presentes
        if (!formData.nombre || !formData.fecha_obtencion || !formData.fecha_expiracion || 
            !formData.company_id || !formData.homologation_id) {
            console.error('Faltan campos requeridos:', formData);
            return;
        }
        
        // Validar fechas
        if (!validarFechaExpiracion(formData.fecha_expiracion)) {
            return;
        }

        const submitData = new FormData();
        submitData.append('nombre', formData.nombre);
        submitData.append('fecha_obtencion', formData.fecha_obtencion.toISOString().split('T')[0]);
        submitData.append('fecha_expiracion', formData.fecha_expiracion.toISOString().split('T')[0]);
        submitData.append('indicadores', formData.indicadores || 0);
        submitData.append('company_id', formData.company_id);
        submitData.append('homologation_id', formData.homologation_id);
        submitData.append('organismo_certificador', formData.organismo_certificador || '');

        // Agregar archivos nuevos (no los existentes)
        selectedFiles.forEach(file => {
            if (!file.isExisting) {
                submitData.append('files[]', file);
            }
        });

        // Debug: mostrar datos que se van a enviar
        console.log('Datos a enviar:', {
            nombre: formData.nombre,
            fecha_obtencion: formData.fecha_obtencion.toISOString().split('T')[0],
            fecha_expiracion: formData.fecha_expiracion.toISOString().split('T')[0],
            indicadores: formData.indicadores || 0,
            company_id: formData.company_id,
            homologation_id: formData.homologation_id,
            organismo_certificador: formData.organismo_certificador || ''
        });

        onSubmit(submitData);
    };

    const validarFechaExpiracion = (fecha) => {
        if (formData.fecha_obtencion && fecha) {
            if (fecha <= formData.fecha_obtencion) {
                setFechaError("La fecha de expiración debe ser posterior a la fecha de obtención");
                return false;
            }
        }
        setFechaError("");
        return true;
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                        <div className="absolute right-0 top-0 pr-4 pt-4">
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 rounded-t-lg">
                                <h3 className="text-lg font-semibold mb-4">
                                    {certification ? 'Editar Certificación' : 'Nueva Certificación'}
                                </h3>

                                <div className="space-y-4">
                                    {/* Selección de certificación disponible */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Certificación Disponible <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    placeholder="Buscar certificación..."
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        setSearchTerm(newValue);
                                                        
                                                        // Si el usuario borra caracteres y ya no coincide con la certificación seleccionada
                                                        if (selectedCertification && newValue !== selectedCertification.nombre) {
                                                            setSelectedCertification(null);
                                                            setFormData({
                                                                ...formData,
                                                                nombre: '',
                                                                homologation_id: ''
                                                            });
                                                        }
                                                        
                                                        // Limpiar error cuando el usuario empiece a escribir
                                                        if (errors.certificacion_disponible) {
                                                            setErrors({
                                                                ...errors,
                                                                certificacion_disponible: null
                                                            });
                                                        }
                                                    }}
                                                    className={`flex-1 rounded-l-lg shadow-sm sm:text-sm ${
                                                        errors.certificacion_disponible 
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                            : selectedCertification
                                                                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                                                : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                                    }`}
                                                />
                                                {selectedCertification && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCertification(null);
                                                            setFormData({
                                                                ...formData,
                                                                nombre: '',
                                                                homologation_id: ''
                                                            });
                                                            setSearchTerm('');
                                                        }}
                                                        className="px-3 py-2 bg-red-100 text-red-600 border border-red-300 rounded-r-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        title="Limpiar selección"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {/* Indicador de certificación seleccionada */}
                                            {selectedCertification && (
                                                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                        <span className="text-sm text-green-700 font-medium">
                                                            Certificación seleccionada: {selectedCertification.nombre}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Mensaje de advertencia cuando hay texto pero no hay selección */}
                                            {searchTerm && !selectedCertification && (
                                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                                        <span className="text-sm text-yellow-700">
                                                            Debe seleccionar una certificación de la lista para continuar
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {searchTerm && !selectedCertification && (
                                                <>
                                                    {filteredCertifications.length > 0 ? (
                                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                            {filteredCertifications.map((cert) => (
                                                                <div
                                                                    key={cert.id}
                                                                    onClick={() => handleCertificationSelect(cert)}
                                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                                >
                                                                    {cert.nombre}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                                                            <p className="text-sm text-gray-500 text-center">
                                                                No se encontraron certificaciones con ese nombre
                                                            </p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        {errors.certificacion_disponible && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.certificacion_disponible}
                                            </p>
                                        )}
                                    </div>

                                    {/* Nombre de la certificación */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Organismo certificador */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Organismo Certificador
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.organismo_certificador}
                                            onChange={(e) => setFormData({...formData, organismo_certificador: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Fecha de obtención */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de Obtención <span className="text-red-500">*</span>
                                        </label>
                                        <DatePicker
                                            selected={formData.fecha_obtencion}
                                            onChange={(date) => setFormData({...formData, fecha_obtencion: date})}
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

                                    {/* Fecha de expiración */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-1 ${fechaError ? 'text-red-600' : ''}`}>
                                            Fecha de Expiración <span className="text-red-500">*</span>
                                        </label>
                                        <DatePicker
                                            selected={formData.fecha_expiracion}
                                            onChange={(date) => {
                                                setFormData({...formData, fecha_expiracion: date});
                                                validarFechaExpiracion(date);
                                            }}
                                            locale={es}
                                            dateFormat="dd/MM/yyyy"
                                            className={`w-full px-3 py-2 border rounded-md ${
                                                fechaError 
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

                                    {/* Indicadores (oculto) */}
                                    <div className='hidden'>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Indicadores <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.indicadores}
                                            onChange={(e) => setFormData({...formData, indicadores: parseInt(e.target.value)})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Empresa */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Empresa <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.company_id}
                                            onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Seleccione una empresa</option>
                                            {companies.map((company) => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Carga de archivos (opcional) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Evidencia (Opcional)
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                                                    >
                                                        <span>Subir archivos</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            multiple
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                                                        />
                                                    </label>
                                                    <p className="pl-1">o arrastrar y soltar</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, PDF, DOC, DOCX, XLS, XLSX hasta 5MB cada uno (máximo 3 archivos)
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Mostrar archivos seleccionados */}
                                        {selectedFiles.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos seleccionados:</h4>
                                                <div className="space-y-2">
                                                    {selectedFiles.map((file, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-gray-600">
                                                                    {file.name || basename(file.path)}
                                                                </span>
                                                                {file.isExisting && (
                                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                        Existente
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Mostrar errores de archivos */}
                                        {fileErrors.length > 0 && (
                                            <div className="mt-2">
                                                {fileErrors.map((error, index) => (
                                                    <p key={index} className="text-sm text-red-600">
                                                        {error}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-lg">
                                <button
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                >
                                    {certification ? 'Actualizar' : 'Crear'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 