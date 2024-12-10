import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import ValueModal from '@/Components/Modals/ValueModal';
import DeleteModal from '@/Components/Modals/DeleteModal';
import axios from 'axios';
import Toast from '@/Components/ToastAdmin';
import EditIcon from '@/Components/Icons/EditIcon';
import TrashIcon from '@/Components/Icons/TrashIcon';

export default function ValuesIndex() {
    const [values, setValues] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [valueToDelete, setValueToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });
    const [notification, setNotification] = useState(null);

    const columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'slug', label: 'Slug' },
        { key: 'minimum_score', label: 'Puntaje mínimo' },
        {
            key: 'subcategories',
            label: 'Subcategorías',
            render: (item) => (
                <div className="max-w-md">
                    {item.subcategories && item.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {item.subcategories.map((subcategory) => (
                                <span
                                    key={subcategory.id}
                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                                >
                                    {subcategory.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-sm text-gray-500 italic">
                            Sin subcategorías
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'is_active',
            label: 'Estado',
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {item.is_active ? 'Activo' : 'Inactivo'}
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

    const loadValues = async (page = 1, perPage = 10, search = '') => {
        try {
            const response = await axios.get('/api/values', {
                params: {
                    page,
                    per_page: perPage,
                    search
                }
            });
            setValues(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error al cargar valores:', error);
        }
    };

    useEffect(() => {
        loadValues(pagination.currentPage, pagination.perPage, searchTerm);
    }, [pagination.currentPage, pagination.perPage, searchTerm]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleSort = (key) => {
        // Implementar ordenamiento si es necesario
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (perPage) => {
        setPagination(prev => ({ ...prev, perPage, currentPage: 1 }));
    };

    const handleCreate = () => {
        setSelectedValue(null);
        setModalOpen(true);
    };

    const handleEdit = (value) => {
        setSelectedValue(value);
        setModalOpen(true);
    };

    const handleDelete = (value) => {
        setValueToDelete(value);
        setDeleteModalOpen(true);
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    const handleBulkDelete = async (ids) => {
        try {
            await axios.post('/api/values/bulk-delete', { ids });
            loadValues(pagination.currentPage, pagination.perPage, searchTerm);
            showNotification('success', `${ids.length} ${ids.length === 1 ? 'valor eliminado' : 'valores eliminados'} exitosamente`);
        } catch (error) {
            console.error('Error al eliminar valores:', error);
            showNotification('error', 'Error al eliminar los valores');
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/values/${valueToDelete.id}`);
            loadValues(pagination.currentPage, pagination.perPage, searchTerm);
            setDeleteModalOpen(false);
            setValueToDelete(null);
            showNotification('success', 'Valor eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar:', error);
            showNotification('error', 'Error al eliminar el valor');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedValue) {
                await axios.put(`/api/values/${selectedValue.id}`, formData);
                showNotification('success', 'Valor actualizado exitosamente');
            } else {
                await axios.post('/api/values', formData);
                showNotification('success', 'Valor creado exitosamente');
            }
            loadValues(pagination.currentPage, pagination.perPage, searchTerm);
            setModalOpen(false);
        } catch (error) {
            console.error('Error al guardar valor:', error);
            showNotification('error', 'Error al guardar el valor');
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="Listado de Valores" />

            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Valores</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona los valores del sistema
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-4">
                    <Link
                        href={route('super.subcategories')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Subcategorías
                    </Link>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Nuevo Valor
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <TableList
                    columns={columns}
                    data={values}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onBulkDelete={handleBulkDelete}
                />
            </div>

            <ValueModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                value={selectedValue}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setValueToDelete(null);
                }}
                onConfirm={confirmDelete}
                title={`¿Eliminar valor "${valueToDelete?.name}"?`}
                description="¿Está seguro de que desea eliminar este valor? Esta acción no se puede deshacer y podría afectar a los registros relacionados."
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