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

    const columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'email', label: 'Email' },
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
                    'super_admin': 'bg-purple-100 text-purple-800',
                    'admin': 'bg-blue-100 text-blue-800',
                    'user': 'bg-gray-100 text-gray-800',
                    'evaluador': 'bg-amber-100 text-amber-800'
                };
                
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[item.role] || 'bg-gray-100 text-gray-800'}`}>
                        {roles[item.role] || item.role}
                    </span>
                );
            }
        },
        { 
            key: 'company', 
            label: 'Empresa',
            render: (item) => item.company?.name || 'N/A'
        },
        {
            key: 'status',
            label: 'Estado',
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {
                        item.status === 'approved' ? 'Aprobado' :
                        item.status === 'pending' ? 'Pendiente' :
                        'Rechazado'
                    }
                </span>
            )
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
        try {
            const response = await axios.get('/api/users', {
                params: {
                    page: pagination.currentPage,
                    per_page: pagination.perPage,
                    search: searchTerm,
                    role: activeFilter === 'todos' ? null : activeFilter
                }
            });
            setUsers(response.data.data);
            setPagination({
                ...pagination,
                total: response.data.total,
                lastPage: response.data.last_page
            });
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setNotification({
                type: 'error',
                message: 'Error al cargar los usuarios'
            });
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
            } else {
                await axios.post('/api/users', formData);
                setNotification({
                    type: 'success',
                    message: 'Usuario creado exitosamente'
                });
            }
            setModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                type: 'error',
                message: 'Error al guardar el usuario'
            });
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
        setSearchTerm(term);
        setPagination({ ...pagination, currentPage: 1 });
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

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
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
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${activeFilter === tab.id
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-8">
                <TableList
                    columns={columns}
                    data={users}
                    onSearch={handleSearch}
                    onSort={() => {}}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onBulkDelete={handleBulkDelete}
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