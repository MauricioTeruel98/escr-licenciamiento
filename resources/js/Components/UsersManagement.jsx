import { useState, useEffect } from 'react';
import { Trash2, X, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { router } from '@inertiajs/react';

// Primero, creamos el componente Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
                {/* Botón de cerrar (X) */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Ícono de eliminar */}
                <div className="flex justify-center mb-4">
                    <div className="rounded-full p-2 bg-red-50">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                </div>

                {/* Título y mensaje */}
                <h3 className="text-center text-lg font-semibold mb-2">
                    Eliminar usuario {userName}
                </h3>
                <p className="text-center text-gray-600 text-sm mb-6">
                    ¿Está seguro que quiere eliminar al usuario?
                </p>

                {/* Botones */}
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
            const response = await axios.get(`/api/users?page=${page}`);
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
            const response = await axios.get('/api/pending-users');
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
            await axios.post('/api/users', nuevoUsuario);
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
            await axios.put(`/api/users/${id}`, {
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
            await axios.delete(`/api/users/${userToDelete.id}`);
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
        <>
            <div className="p-6 mx-auto">
                <h1 className="text-2xl font-bold mb-2">Administrar Usuarios</h1>
                <p className="text-gray-600 mb-8">
                    En este panel podrá administrar el acceso de otros usuarios de su empresa a la plataforma.
                </p>

                <div className="flex gap-8">
                    {/* Formulario para nuevo usuario */}
                    <div className="lg:w-1/4">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
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
                    <div className="lg:w-3/4 space-y-4">
                        {/* Sección de Solicitudes Pendientes */}
                        {solicitudesPendientes.length > 0 && (
                            <div className="mb-8">
                                <div className="space-y-4">
                                    {solicitudesPendientes.map((solicitud) => (
                                        <div key={solicitud.id}
                                            className="bg-green-100/30 p-4 rounded-lg shadow-sm flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <h2 className="text-lg text-green-800 font-semibold">Solicitud de colaboración</h2>
                                                        <p className="text-sm text-green-800">{solicitud.name} {solicitud.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(solicitud.id)}
                                                    className="p-2 text-green-600 hover:text-green-700"
                                                    title="Aprobar"
                                                >
                                                    <CheckCircle className="h-6 w-6" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(solicitud.id)}
                                                    className="p-2 text-red-600 hover:text-red-700"
                                                    title="Rechazar"
                                                >
                                                    <XCircle className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {usuarios.length > 0 ? (
                            <>
                                {usuarios.map((usuario) => (
                                    <div key={usuario.id} className="bg-white p-6 rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className={`text-sm px-2 py-1 rounded ${usuario.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {usuario.status === 'approved' ? 'Aprobado' : 'Pendiente'}
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

                                <Pagination />
                            </>
                        ) : (
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        Agregue usuarios de su empresa.
                                    </h2>
                                    <p className="text-gray-600">
                                        Si su empresa requiere más de un colaborador en la plataforma, puede agregarlos como usuarios.
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
                    setUserToDelete(null);
                }}
                onConfirm={confirmDelete}
                userName={userToDelete?.nombreCompleto}
            />
        </>
    );
}