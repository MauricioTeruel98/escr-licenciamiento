import { useState, useEffect } from 'react';
import { Trash2, X, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { router } from '@inertiajs/react';

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
        nombreCompleto: '',
        correo: '',
        puesto: '',
        telefono: ''
    });

    // Agregamos estados para el modal
    const [modalOpen, setModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });

    useEffect(() => {
        cargarUsuarios();
        cargarSolicitudesPendientes();
    }, []);

    const cargarUsuarios = async (page = 1) => {
        try {
            console.log('Intentando cargar usuarios...');
            const response = await axios.get(`/api/users/company?page=${page}`);
            console.log('Respuesta:', response.data);

            const usuariosFormateados = response.data.data.map(user => ({
                id: user.id,
                nombreCompleto: `${user.name} ${user.lastname}`,
                correo: user.email,
                puesto: user.position || '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/users/company', nuevoUsuario);
            setNuevoUsuario({
                nombreCompleto: '',
                correo: '',
                puesto: '',
                telefono: ''
            });
            cargarUsuarios();
        } catch (error) {
            console.error('Error al crear usuario:', error);
        }
    };

    const handleSave = async (id) => {
        const usuario = usuarios.find(u => u.id === id);
        try {
            await axios.put(`/api/users/company/${id}`, {
                nombreCompleto: usuario.nombreCompleto,
                correo: usuario.correo,
                puesto: usuario.puesto,
                telefono: usuario.telefono
            });
            setUsuarios(usuarios.map(u =>
                u.id === id ? { ...u, editando: false } : u
            ));
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
        }
    };

    const handleDelete = (id) => {
        setUserToDelete(usuarios.find(user => user.id === id));
        setModalOpen(true);
    };

    const handleChange = (id, field, value) => {
        setUsuarios(usuarios.map(usuario =>
            usuario.id === id ? { ...usuario, [field]: value } : usuario
        ));
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/users/company/${userToDelete.id}`);
            setUsuarios(usuarios.filter(usuario => usuario.id !== userToDelete.id));
            setModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoUsuario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (id) => {
        setUsuarios(usuarios.map(usuario =>
            usuario.id === id ? { ...usuario, editando: true } : usuario
        ));
    };

    const handlePageChange = (page) => {
        cargarUsuarios(page);
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
                                    Nombre Completo<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombreCompleto"
                                    value={nuevoUsuario.nombreCompleto}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    required
                                />
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
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    required
                                />
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
                            <div className="p-4">
                                <h2 className="text-sm font-medium text-gray-900">
                                    Solicitudes Pendientes
                                </h2>
                            </div>
                            {solicitudesPendientes.map((solicitud) => (
                                <div key={solicitud.id} className="p-4 flex items-center justify-between">
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
                                            className="text-green-600 hover:text-green-700"
                                            title="Aprobar"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleReject(solicitud.id)}
                                            className="text-red-600 hover:text-red-700"
                                            title="Rechazar"
                                        >
                                            <XCircle className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Lista de usuarios */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        {usuarios.map((usuario) => (
                            <div key={usuario.id} className="p-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        usuario.status === 'approved' 
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
                                            Nombre Completo
                                            {usuario.editando && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            value={usuario.nombreCompleto}
                                            onChange={(e) => handleChange(usuario.id, 'nombreCompleto', e.target.value)}
                                            disabled={!usuario.editando}
                                            className={`w-full p-2 border rounded-md ${!usuario.editando ? 'bg-gray-50 text-gray-700' : 'bg-white'}`}
                                        />
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
                                            className={`w-full p-2 border rounded-md ${!usuario.editando ? 'bg-gray-50 text-gray-700' : 'bg-white'}`}
                                        />
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
                                            className={`w-full p-2 border rounded-md ${!usuario.editando ? 'bg-gray-50 text-gray-700' : 'bg-white'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">
                                            Teléfono
                                            {usuario.editando && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="tel"
                                            value={usuario.telefono}
                                            onChange={(e) => handleChange(usuario.id, 'telefono', e.target.value)}
                                            disabled={!usuario.editando}
                                            className={`w-full p-2 border rounded-md ${!usuario.editando ? 'bg-gray-50 text-gray-700' : 'bg-white'}`}
                                        />
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
                userName={userToDelete?.nombreCompleto}
            />
        </div>
    );
}