import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import UserModal from '@/Components/Modals/UserModal';
import DeleteModal from '@/Components/Modals/DeleteModal';
import Toast from '@/Components/Toast';
import axios from 'axios';
import EditIcon from '@/Components/Icons/EditIcon';
import TrashIcon from '@/Components/Icons/TrashIcon';

export default function UsersIndex() {
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });
    const [activeFilter, setActiveFilter] = useState('todos');
    const [isLoading, setIsLoading] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);

    const columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'email', label: 'Email' },
        {
            key: 'puesto',
            label: 'Puesto',
            render: (item) => (
                <div className="text-sm text-gray-700">
                    {item.puesto || 'No especificado'}
                </div>
            )
        },
        {
            key: 'phone',
            label: 'Teléfono',
            render: (item) => (
                <div className="text-sm text-gray-700">
                    {item.phone || 'No especificado'}
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'Fecha de Registro',
            render: (item) => {
                const date = new Date(item.created_at);
                return (
                    <div className="text-sm text-gray-700">
                        {date.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </div>
                );
            }
        },
        {
            key: 'role',
            label: 'Rol',
            render: (item) => {
                const roles = {
                    'super_admin': 'Super Admin',
                    'admin': 'Administrador',
                    'user': 'Usuario',
                    'evaluador': 'Evaluador'
                };

                const roleColors = {
                    'super_admin': 'text-purple-800 border-purple-200 bg-purple-50',
                    'admin': 'text-blue-800 border-blue-200 bg-blue-50',
                    'user': 'text-gray-800 border-gray-200 bg-gray-50',
                    'evaluador': 'text-amber-800 border-amber-200 bg-amber-50'
                };

                return (
                    <span className={`text-md p-3 font-semibold mb-1 badge rounded-lg border ${roleColors[item.role] || 'text-gray-800 border-gray-200 bg-gray-50'}`}>
                        {roles[item.role] || item.role}
                    </span>
                );
            }
        },
        {
            key: 'company',
            label: 'Empresa',
            render: (item) => {
                if (item.role === 'evaluador') {
                    return (
                        <div className="flex flex-col">
                            {item.evaluated_companies && item.evaluated_companies.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {item.evaluated_companies.map((company) => (
                                        <div 
                                            key={company.id} 
                                            className="text-sm py-1 px-3 font-medium badge rounded-md border text-gray-800 border-gray-200 bg-gray-50 h-auto"
                                        >
                                            <span>{company.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-sm text-gray-500">No hay empresas asignadas</span>
                            )}
                        </div>
                    );
                }
                return (
                    <div className="text-md py-1 px-3 font-semibold mb-1 badge rounded-lg border text-gray-800 border-gray-200 bg-gray-50 h-auto">
                        <span>{item.company?.name || 'N/A'}</span>
                    </div>
                );
            }
        },
        {
            key: 'status',
            label: 'Estado',
            render: (item) => {
                const statusStyles = {
                    'approved': 'text-green-800 border-green-200 bg-green-50',
                    'pending': 'text-yellow-800 border-yellow-200 bg-yellow-50',
                    'rejected': 'text-red-800 border-red-200 bg-red-50'
                };

                const statusLabels = {
                    'approved': 'Aprobado',
                    'pending': 'Pendiente',
                    'rejected': 'Rechazado'
                };

                return (
                    <span className={`text-md p-3 font-semibold mb-1 badge rounded-lg border ${
                        statusStyles[item.status] || 'text-gray-800 border-gray-200 bg-gray-50'
                    }`}>
                        {statusLabels[item.status] || item.status}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: 'Acciones',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="text-green-700 hover:text-green-800 flex items-center gap-1"
                    >
                        <EditIcon />
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        className="p-1 text-red-600 hover:text-red-900 flex items-center gap-1"
                    >
                        <TrashIcon />
                        Eliminar
                    </button>
                </div>
            )
        }
    ];

    useEffect(() => {
        fetchUsers();
    }, [pagination.currentPage, pagination.perPage, searchTerm, activeFilter]);

    const fetchUsers = async () => {
        if (abortController) {
            abortController.abort();
        }

        const controller = new AbortController();
        setAbortController(controller);

        setIsLoading(true);
        try {
            const response = await axios.get('/api/users', {
                params: {
                    page: pagination.currentPage,
                    per_page: pagination.perPage,
                    search: searchTerm,
                    role: activeFilter === 'todos' ? null : activeFilter
                },
                signal: controller.signal
            });
            setUsers(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error al cargar usuarios:', error);
                setNotification({
                    type: 'error',
                    message: 'Error al cargar los usuarios'
                });
            }
        } finally {
            setIsLoading(false);
            setAbortController(null);
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedUser) {
                await axios.put(`/api/users/${selectedUser.id}`, formData);
                setNotification({
                    type: 'success',
                    message: 'Usuario actualizado exitosamente'
                });
                setModalOpen(false);
                fetchUsers();
            } else {
                await axios.post('/api/users', formData);
                setNotification({
                    type: 'success',
                    message: 'Usuario creado exitosamente'
                });
                setModalOpen(false);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error:', error);
            
            // Verificar si hay errores de validación
            if (error.response && error.response.data && error.response.data.errors) {
                // Pasar los errores al modal para que los muestre
                return error.response.data.errors;
            } else {
                setNotification({
                    type: 'error',
                    message: error.response?.data?.message || 'Error al guardar el usuario'
                });
            }
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/users/${userToDelete.id}`);
            setNotification({
                type: 'success',
                message: 'Usuario eliminado exitosamente'
            });
            setDeleteModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                type: 'error',
                message: 'Error al eliminar el usuario'
            });
        }
    };

    const handleSearch = (term) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        setSearchTerm(term);
        
        const timeout = setTimeout(() => {
            setPagination({...pagination, currentPage: 1});
        }, 500);

        setSearchTimeout(timeout);
    };

    const handlePageChange = (newPage) => {
        setPagination({ ...pagination, currentPage: newPage });
    };

    const handlePerPageChange = (newPerPage) => {
        setPagination({
            ...pagination,
            perPage: newPerPage,
            currentPage: 1
        });
    };

    const handleBulkDelete = async (ids) => {
        try {
            await axios.post('/api/users/bulk-delete', { ids });
            setNotification({
                type: 'success',
                message: 'Usuarios eliminados exitosamente'
            });
            fetchUsers();
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                type: 'error',
                message: 'Error al eliminar los usuarios'
            });
        }
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setPagination({ ...pagination, currentPage: 1 });
    };

    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            if (abortController) {
                abortController.abort();
            }
        };
    }, [searchTimeout, abortController]);

    return (
        <SuperAdminLayout>
            <Head title="Usuarios" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona los usuarios del sistema
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Nuevo Usuario
                    </button>
                </div>
            </div>

            <div className='flex justify-center items-center mb-6'>
                <div className="bg-gray-50 p-1 rounded-xl inline-flex">
                    {[
                        { id: 'todos', name: 'Todos' },
                        { id: 'user', name: 'Usuarios' },
                        { id: 'admin', name: 'Empresas' },
                        { id: 'evaluador', name: 'Evaluadores' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleFilterChange(tab.id)}
                            className={`
                            px-6 py-2 text-sm font-medium rounded-xl transition-colors
                            ${activeFilter === tab.id
                                    ? 'bg-white text-green-700 shadow'
                                    : 'text-gray-500 hover:text-gray-700'
                                }
                        `}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <TableList
                    columns={columns}
                    data={users}
                    onSearch={handleSearch}
                    onSort={() => { }}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onBulkDelete={handleBulkDelete}
                    isLoading={isLoading}
                />
            </div>

            <UserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                user={selectedUser}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={confirmDelete}
                title={`¿Eliminar usuario "${userToDelete?.name}"?`}
                description="¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer."
            />

            {notification && (
                <Toast
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </SuperAdminLayout>
    );
} 