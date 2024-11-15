import { useState } from 'react';
import { Trash2, X } from 'lucide-react';

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
    const [usuarios, setUsuarios] = useState([
        {
            id: 1,
            nombreCompleto: 'Diana Badilla',
            correo: 'diana@buzz.com',
            puesto: 'Administrador',
            telefono: '8162855',
            editando: false
        },
        {
            id: 2,
            nombreCompleto: 'Fabián Sanabria',
            correo: 'fabian@buzz.com',
            puesto: 'Administrador',
            telefono: '8162855',
            editando: false
        }
    ]);

    // Agregamos estados para el modal
    const [modalOpen, setModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleEdit = (id) => {
        setUsuarios(usuarios.map(usuario =>
            usuario.id === id ? { ...usuario, editando: true } : usuario
        ));
    };

    const handleSave = (id) => {
        setUsuarios(usuarios.map(usuario =>
            usuario.id === id ? { ...usuario, editando: false } : usuario
        ));
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

    const nuevoUsuario = {
        nombreCompleto: '',
        correo: '',
        puesto: '',
        telefono: ''
    };

    // Nueva función para confirmar la eliminación
    const confirmDelete = () => {
        setUsuarios(usuarios.filter(usuario => usuario.id !== userToDelete.id));
        setModalOpen(false);
        setUserToDelete(null);
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
                            <form onSubmit={''} className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">
                                        Nombre Completo<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreCompleto"
                                        value={nuevoUsuario.nombreCompleto}
                                        onChange={''}
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
                                        onChange={''}
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
                                        onChange={''}
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
                                        onChange={''}
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
                        {usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <div key={usuario.id} className="bg-white p-6 rounded-lg shadow-sm">
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
                            ))
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