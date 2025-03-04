import { useState, useEffect } from 'react';
import { Trash2, X, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import Toast from './Toast';

// Primero, creamos el componente Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, userName }) => {
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
                                    Eliminar usuario {userName}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        ¿Está seguro que quiere eliminar al usuario? Esta acción no se puede deshacer.
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

// Modificamos el componente principal para incluir el modal
export default function UsersManagement() {
    const [usuarios, setUsuarios] = useState([]);
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        name: '',
        lastname: '',
        correo: '',
        puesto: '',
        telefono: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [editValidationErrors, setEditValidationErrors] = useState({});
    const [emailCheckInProgress, setEmailCheckInProgress] = useState(false);

    // Agregamos estados para el modal
    const [modalOpen, setModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        cargarUsuarios();
        cargarSolicitudesPendientes();
    }, []);

    // Función para validar campos
    const validateField = (field, value) => {
        let error = null;
        
        // Verificar caracteres peligrosos para SQL injection en todos los campos
        if (value && /['";\\=]/.test(value)) {
            return `El campo contiene caracteres no permitidos`;
        }
        
        // Verificar espacios al inicio en todos los campos
        if (value && value.startsWith(' ')) {
            return `No se permiten espacios al inicio del campo`;
        }
        
        // Validación para nombre y apellidos
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
                error = `El ${field === 'name' ? 'nombre' : 'apellidos'} no debe exceder los 50 caracteres`;
            }
        }
        
        // Validación para puesto
        if (field === 'puesto') {
            // Verificar si está vacío
            if (!value || value.trim() === '') {
                error = 'El puesto es obligatorio';
            }
            // Verificar si contiene números o caracteres especiales
            else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                error = 'El puesto solo debe contener letras y espacios';
            }
            // Verificar longitud máxima
            else if (value.length > 50) {
                error = 'El puesto no debe exceder los 50 caracteres';
            }
        }
        
        // Validación para teléfono
        if (field === 'telefono') {
            // Verificar si está vacío
            if (!value || value.trim() === '') {
                error = 'El teléfono es obligatorio';
            }
            // Verificar si contiene caracteres no válidos
            else if (!/^[0-9+\-\s]+$/.test(value)) {
                error = 'El teléfono solo debe contener números, +, - y espacios';
            }
            // Verificar longitud máxima
            else if (value.length > 20) {
                error = 'El teléfono no debe exceder los 20 caracteres';
            }
        }
        
        // Validación para correo
        if (field === 'correo') {
            // Verificar si está vacío
            if (!value || value.trim() === '') {
                error = 'El correo electrónico es obligatorio';
            }
            // Verificar longitud máxima
            else if (value.length > 255) {
                error = 'El correo no debe exceder los 255 caracteres';
            }
            // Validar formato de correo
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = 'Ingrese un correo electrónico válido';
            }
        }
        
        return error;
    };

    const handlePageChange = (page) => {
        cargarUsuarios(page);
    };

    const cargarUsuarios = async (page = 1) => {
        try {
            const response = await axios.get(`/api/users/company?page=${page}`);

            const usuariosFormateados = response.data.data
                .filter(user => user.role !== 'super_admin') // Filtro adicional en el frontend
                .map(user => ({
                    id: user.id,
                    name: user.name || '',
                    lastname: user.lastname || '',
                    correo: user.email,
                    puesto: user.puesto || '',
                    telefono: user.phone || '',
                    editando: false,
                    status: user.status
                }));

            setUsuarios(usuariosFormateados);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            if (error.response) {
                console.error('Respuesta del servidor:', error.response.data);
            }
        }
    };

    const cargarSolicitudesPendientes = async () => {
        try {
            const response = await axios.get('/api/pending-users/company');
            setSolicitudesPendientes(response.data);
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
        }
    };

    const handleApprove = (userId) => {
        router.post(route('user.approve', userId), {}, {
            onSuccess: () => {
                cargarUsuarios();
                cargarSolicitudesPendientes();
            }
        });
    };

    const handleReject = (userId) => {
        router.post(route('user.reject', userId), {}, {
            onSuccess: () => {
                cargarSolicitudesPendientes();
            }
        });
    };

    // Función para verificar si un correo ya existe
    const checkEmailExists = async (email, userId = null) => {
        try {
            setEmailCheckInProgress(true);
            const response = await axios.post('/api/check-email-exists', { 
                email,
                userId // Si es null, se está creando un usuario nuevo
            });
            setEmailCheckInProgress(false);
            return response.data.exists;
        } catch (error) {
            console.error('Error al verificar email:', error);
            setEmailCheckInProgress(false);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar todos los campos antes de enviar
        let hasErrors = false;
        const newErrors = {};
        
        Object.entries(nuevoUsuario).forEach(([field, value]) => {
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
            setToastMessage('Por favor corrija los errores en el formulario');
            setShowToast(true);
            return;
        }
        
        // Verificar si el correo ya existe
        const emailExists = await checkEmailExists(nuevoUsuario.correo.trim());
        if (emailExists) {
            setValidationErrors(prev => ({
                ...prev,
                correo: 'Este correo electrónico ya está registrado'
            }));
            setToastMessage('El correo electrónico ya está en uso');
            setShowToast(true);
            return;
        }
        
        // Eliminar espacios al inicio y final de todos los campos antes de enviar
        const trimmedData = { ...nuevoUsuario };
        Object.keys(trimmedData).forEach(key => {
            if (typeof trimmedData[key] === 'string') {
                trimmedData[key] = trimmedData[key].trim();
            }
        });
        
        try {
            const response = await axios.post('/api/users/company', {
                name: trimmedData.name,
                lastname: trimmedData.lastname,
                email: trimmedData.correo,
                puesto: trimmedData.puesto,
                phone: trimmedData.telefono
            });
            setNuevoUsuario({
                name: '',
                lastname: '',
                correo: '',
                puesto: '',
                telefono: ''
            });
            
            // Limpiar los errores de validación después de guardar correctamente
            setValidationErrors({});
            
            cargarUsuarios();
            
            // Mostrar mensaje con la contraseña generada
            if (response.data.password) {
                setToastMessage(`Usuario creado exitosamente. Contraseña generada: ${response.data.password}`);
            } else {
                setToastMessage(response.data.message || 'Usuario creado exitosamente');
            }
            setShowToast(true);
        } catch (error) {
            console.error('Error al crear usuario:', error);

            // Manejo específico de errores
            let errorMessage = 'Error al crear usuario';

            if (error.response) {
                // El servidor respondió con un estado de error
                if (error.response.data.messages) {
                    // Error de validación
                    errorMessage = Object.values(error.response.data.messages)[0][0];
                } else if (error.response.data.message) {
                    // Error general del servidor con mensaje
                    errorMessage = error.response.data.message;
                }
            }

            setToastMessage(errorMessage);
            setShowToast(true);
        }
    };

    const handleSave = async (id) => {
        const usuario = usuarios.find(u => u.id === id);
        
        // Validar todos los campos antes de enviar
        let hasErrors = false;
        const newErrors = {};
        
        Object.entries(usuario).forEach(([field, value]) => {
            if (typeof value === 'string' && field !== 'status' && field !== 'id') {
                const error = validateField(field, value);
                if (error) {
                    newErrors[field] = error;
                    hasErrors = true;
                }
            }
        });
        
        setEditValidationErrors(newErrors);
        
        if (hasErrors) {
            setToastMessage('Por favor corrija los errores en el formulario');
            setShowToast(true);
            return;
        }
        
        // Verificar si el correo ya existe (excluyendo el usuario actual)
        const emailExists = await checkEmailExists(usuario.correo.trim(), usuario.id);
        if (emailExists) {
            setEditValidationErrors(prev => ({
                ...prev,
                correo: 'Este correo electrónico ya está registrado'
            }));
            setToastMessage('El correo electrónico ya está en uso');
            setShowToast(true);
            return;
        }
        
        // Eliminar espacios al inicio y final de todos los campos antes de enviar
        const trimmedData = { ...usuario };
        Object.keys(trimmedData).forEach(key => {
            if (typeof trimmedData[key] === 'string' && key !== 'id' && key !== 'status' && key !== 'editando') {
                trimmedData[key] = trimmedData[key].trim();
            }
        });
        
        try {
            await axios.put(`/api/users/company/${id}`, {
                name: trimmedData.name,
                lastname: trimmedData.lastname,
                email: trimmedData.correo,
                puesto: trimmedData.puesto,
                phone: trimmedData.telefono
            });
            
            setUsuarios(usuarios.map(usuario =>
                usuario.id === id ? { ...trimmedData, editando: false } : usuario
            ));
            
            // Limpiar los errores de validación después de guardar correctamente
            setEditValidationErrors({});
            
            setToastMessage('Usuario actualizado exitosamente');
            setShowToast(true);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            
            // Manejo específico de errores
            let errorMessage = 'Error al actualizar usuario';
            
            if (error.response) {
                // El servidor respondió con un estado de error
                if (error.response.data.messages) {
                    // Error de validación
                    errorMessage = Object.values(error.response.data.messages)[0][0];
                } else if (error.response.data.message) {
                    // Error general del servidor con mensaje
                    errorMessage = error.response.data.message;
                }
            }
            
            setToastMessage(errorMessage);
            setShowToast(true);
        }
    };

    const handleDelete = (id) => {
        setUserToDelete(usuarios.find(user => user.id === id));
        setModalOpen(true);
    };

    const handleChange = (id, field, value) => {
        // No permitir espacios al inicio
        if (value.startsWith(' ')) {
            return;
        }
        
        // No permitir caracteres peligrosos para SQL injection
        if (/['";\\=]/.test(value)) {
            return;
        }
        
        // Validar caracteres según el tipo de campo
        let processedValue = value;
        
        if (field === 'name' || field === 'lastname' || field === 'puesto') {
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
        
        if (field === 'telefono') {
            // Solo permitir números, +, - y espacios para teléfono
            const lastChar = value.charAt(value.length - 1);
            if (!/^[0-9+\-\s]$/.test(lastChar) && lastChar !== '') {
                return;
            }
            
            if (value.length > 20) {
                return;
            }
        }
        
        if (field === 'correo') {
            // Permitir caracteres válidos para email
            const lastChar = value.charAt(value.length - 1);
            if (!/^[a-zA-Z0-9@._\-]$/.test(lastChar) && lastChar !== '') {
                return;
            }
            
            if (value.length > 255) {
                return;
            }
            
            // Verificar formato de correo
            const error = validateField(field, value);
            
            // Si el formato es válido, verificar si ya existe (con debounce)
            if (!error && value.includes('@') && value.includes('.')) {
                clearTimeout(window.emailCheckTimeout);
                window.emailCheckTimeout = setTimeout(async () => {
                    const usuario = usuarios.find(u => u.id === id);
                    const emailExists = await checkEmailExists(value.trim(), usuario.id);
                    if (emailExists) {
                        setEditValidationErrors(prev => ({
                            ...prev,
                            correo: 'Este correo electrónico ya está registrado'
                        }));
                    } else {
                        // Limpiar el error si el correo es válido
                        setEditValidationErrors(prev => ({
                            ...prev,
                            correo: null
                        }));
                    }
                }, 500);
            }
        }
        
        // Validar el campo
        const error = validateField(field, processedValue);
        
        // Actualizar errores de validación
        setEditValidationErrors(prev => ({
            ...prev,
            [field]: error
        }));
        
        setUsuarios(usuarios.map(usuario =>
            usuario.id === id ? { ...usuario, [field]: processedValue } : usuario
        ));
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/users/company/${userToDelete.id}`);
            setUsuarios(usuarios.filter(usuario => usuario.id !== userToDelete.id));
            setModalOpen(false);
            setUserToDelete(null);
            setToastMessage('Usuario eliminado exitosamente');
            setShowToast(true);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            setToastMessage('Error al eliminar usuario');
            setShowToast(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // No permitir espacios al inicio
        if (value.startsWith(' ')) {
            return;
        }
        
        // No permitir caracteres peligrosos para SQL injection
        if (/['";\\=]/.test(value)) {
            return;
        }
        
        // Validar caracteres según el tipo de campo
        if (name === 'name' || name === 'lastname' || name === 'puesto') {
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
        
        if (name === 'telefono') {
            // Solo permitir números, +, - y espacios para teléfono
            const lastChar = value.charAt(value.length - 1);
            if (!/^[0-9+\-\s]$/.test(lastChar) && lastChar !== '') {
                return;
            }
            
            if (value.length > 20) {
                return;
            }
        }
        
        if (name === 'correo') {
            // Permitir caracteres válidos para email
            const lastChar = value.charAt(value.length - 1);
            if (!/^[a-zA-Z0-9@._\-]$/.test(lastChar) && lastChar !== '') {
                return;
            }
            
            if (value.length > 255) {
                return;
            }
            
            // Verificar formato de correo
            const error = validateField(name, value);
            
            // Si el formato es válido, verificar si ya existe (con debounce)
            if (!error && value.includes('@') && value.includes('.')) {
                clearTimeout(window.emailCheckTimeout);
                window.emailCheckTimeout = setTimeout(async () => {
                    const emailExists = await checkEmailExists(value.trim());
                    if (emailExists) {
                        setValidationErrors(prev => ({
                            ...prev,
                            correo: 'Este correo electrónico ya está registrado'
                        }));
                    } else {
                        // Limpiar el error si el correo es válido
                        setValidationErrors(prev => ({
                            ...prev,
                            correo: null
                        }));
                    }
                }, 500);
            }
        }
        
        // Validar el campo
        const error = validateField(name, value);
        
        // Actualizar errores de validación
        setValidationErrors(prev => ({
            ...prev,
            [name]: error
        }));
        
        setNuevoUsuario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (id) => {
        // Limpiar los errores de validación de edición al comenzar a editar
        setEditValidationErrors({});
        setUsuarios(usuarios.map(usuario =>
            usuario.id === id ? { ...usuario, editando: true } : usuario
        ));
    };

    // Agregar una función para cancelar la edición
    const handleCancelEdit = (id) => {
        // Limpiar los errores de validación
        setEditValidationErrors({});
        
        // Recargar los datos originales del usuario
        cargarUsuarios();
    };

    const Pagination = () => {
        if (pagination.lastPage <= 1) return null;

        return (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${pagination.currentPage === 1
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage}
                        className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${pagination.currentPage === pagination.lastPage
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Siguiente
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Mostrando{' '}
                            <span className="font-medium">
                                {((pagination.currentPage - 1) * pagination.perPage) + 1}
                            </span>{' '}
                            a{' '}
                            <span className="font-medium">
                                {Math.min(pagination.currentPage * pagination.perPage, pagination.total)}
                            </span>{' '}
                            de{' '}
                            <span className="font-medium">{pagination.total}</span>{' '}
                            resultados
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${pagination.currentPage === 1 ? 'cursor-not-allowed' : ''
                                    }`}
                            >
                                <span className="sr-only">Anterior</span>
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {/* Números de página */}
                            {[...Array(pagination.lastPage)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${pagination.currentPage === index + 1
                                        ? 'z-10 bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.lastPage}
                                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${pagination.currentPage === pagination.lastPage ? 'cursor-not-allowed' : ''
                                    }`}
                            >
                                <span className="sr-only">Siguiente</span>
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 mx-auto">
            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Administrar Usuarios
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    En este panel podrá administrar el acceso de otros usuarios de su empresa a la plataforma.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Formulario para nuevo usuario */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-sm font-medium text-gray-900">
                                Nuevo Usuario
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm mb-1">
                                    Nombre<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={nuevoUsuario.name}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Solo letras y espacios. Máx. 50 caracteres.</p>
                                {validationErrors.name && (
                                    <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-1">
                                    Apellidos<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={nuevoUsuario.lastname}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Solo letras y espacios. Máx. 50 caracteres.</p>
                                {validationErrors.lastname && (
                                    <p className="text-sm text-red-600 mt-1">{validationErrors.lastname}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-1">
                                    Correo Electrónico<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={nuevoUsuario.correo}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-md border ${validationErrors.correo ? 'border-red-500' : 'border-gray-300'} p-2`}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Formato válido: ejemplo@dominio.com</p>
                                {validationErrors.correo && (
                                    <p className="text-sm text-red-600 mt-1">{validationErrors.correo}</p>
                                )}
                                {/* {emailCheckInProgress && (
                                    <p className="text-xs text-blue-600 mt-1">Verificando disponibilidad...</p>
                                )} */}
                            </div>

                            <div>
                                <label className="block text-sm mb-1">
                                    Puesto<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="puesto"
                                    value={nuevoUsuario.puesto}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Solo letras y espacios. Máx. 50 caracteres.</p>
                                {validationErrors.puesto && (
                                    <p className="text-sm text-red-600 mt-1">{validationErrors.puesto}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-1">
                                    Teléfono<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={nuevoUsuario.telefono}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Solo números, +, - y espacios. Máx. 20 caracteres.</p>
                                {validationErrors.telefono && (
                                    <p className="text-sm text-red-600 mt-1">{validationErrors.telefono}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors w-fit"
                            >
                                Agregar Usuario
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lista de usuarios */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Sección de Solicitudes Pendientes */}
                    {solicitudesPendientes.length > 0 && (
                        <div className="bg-green-100/50 rounded-xl shadow-sm p-4">
                            <div className="">
                                <h2 className="text-sm font-medium text-gray-900 mb-4">
                                    Solicitudes Pendientes
                                </h2>
                            </div>
                            {solicitudesPendientes.map((solicitud, index) => (
                                <>
                                    <div key={solicitud.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {solicitud.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {solicitud.email}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(solicitud.id)}
                                                className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 hover:bg-green-700"
                                                title="Aprobar"
                                            >
                                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleReject(solicitud.id)}
                                                className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600 hover:bg-red-700"
                                                title="Rechazar"
                                            >
                                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    {index < solicitudesPendientes.length - 1 && <div className="divider"></div>}
                                </>
                            ))}
                        </div>
                    )}

                    {/* Lista de usuarios */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        {usuarios.map((usuario) => (
                            <div key={usuario.id} className="p-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${usuario.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : usuario.status === 'rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {usuario.status === 'approved'
                                            ? 'Aprobado'
                                            : usuario.status === 'rejected'
                                                ? 'Rechazado'
                                                : 'Pendiente'
                                        }
                                    </span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <label className="block text-sm mb-1">
                                            Nombre
                                            {usuario.editando && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            value={usuario.name}
                                            onChange={(e) => handleChange(usuario.id, 'name', e.target.value)}
                                            disabled={!usuario.editando}
                                            className={`w-full p-2 border rounded-md ${!usuario.editando ? 'bg-gray-50 text-gray-700' : editValidationErrors.name ? 'border-red-500 bg-white' : 'bg-white'}`}
                                        />
                                        {usuario.editando && <p className="text-xs text-gray-500 mt-1">Solo letras y espacios. Máx. 50 caracteres.</p>}
                                        {usuario.editando && editValidationErrors.name && (
                                            <p className="text-sm text-red-600 mt-1">{editValidationErrors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">
                                            Apellidos
                                            {usuario.editando && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            value={usuario.lastname}
                                            onChange={(e) => handleChange(usuario.id, 'lastname', e.target.value)}
                                            disabled={!usuario.editando}
                                            className={`w-full p-2 border rounded-md ${!usuario.editando ? 'bg-gray-50 text-gray-700' : editValidationErrors.lastname ? 'border-red-500 bg-white' : 'bg-white'}`}
                                        />
                                        {usuario.editando && <p className="text-xs text-gray-500 mt-1">Solo letras y espacios. Máx. 50 caracteres.</p>}
                                        {usuario.editando && editValidationErrors.lastname && (
                                            <p className="text-sm text-red-600 mt-1">{editValidationErrors.lastname}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">
                                            Correo Electrónico
                                            {usuario.editando && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="email"
                                            value={usuario.correo}
                                            onChange={(e) => handleChange(usuario.id, 'correo', e.target.value)}
                                            disabled={!usuario.editando}
                                            className={`w-full p-2 border rounded-md ${!usuario.editando ? 'bg-gray-50 text-gray-700' : editValidationErrors.correo ? 'border-red-500 bg-white' : 'bg-white'}`}
                                        />
                                        {usuario.editando && <p className="text-xs text-gray-500 mt-1">Formato válido: ejemplo@dominio.com</p>}
                                        {usuario.editando && editValidationErrors.correo && (
                                            <p className="text-sm text-red-600 mt-1">{editValidationErrors.correo}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">
                                            Puesto
                                            {usuario.editando && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            value={usuario.puesto}
                                            onChange={(e) => handleChange(usuario.id, 'puesto', e.target.value)}
                                            disabled={!usuario.editando}
                                            className={`w-full p-2 border rounded-md ${!usuario.editando ? 'bg-gray-50 text-gray-700' : editValidationErrors.puesto ? 'border-red-500 bg-white' : 'bg-white'}`}
                                        />
                                        {usuario.editando && <p className="text-xs text-gray-500 mt-1">Solo letras y espacios. Máx. 50 caracteres.</p>}
                                        {usuario.editando && editValidationErrors.puesto && (
                                            <p className="text-sm text-red-600 mt-1">{editValidationErrors.puesto}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    {usuario.editando ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(usuario.id)}
                                                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
                                            >
                                                Guardar Cambios
                                            </button>
                                            <button
                                                onClick={() => handleCancelEdit(usuario.id)}
                                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(usuario.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(usuario.id)}
                                            className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            Editar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginación */}
                    <Pagination />
                </div>
            </div>

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmDelete}
                userName={userToDelete?.name}
            />
        </div>
    );
}