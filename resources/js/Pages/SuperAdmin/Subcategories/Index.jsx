import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import SubcategoryModal from '@/Components/Modals/SubcategoryModal';
import DeleteModal from '@/Components/Modals/DeleteModal';
import Toast from '@/Components/Toast';
import axios from 'axios';
import TrashIcon from '@/Components/Icons/TrashIcon';
import EditIcon from '@/Components/Icons/EditIcon';

export default function SubcategoriesIndex() {
    const [subcategories, setSubcategories] = useState([]);
    const [values, setValues] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });

    const columns = [
        { key: 'name', label: 'Nombre' },
        { 
            key: 'value', 
            label: 'Valor',
            render: (item) => item.value?.name || 'N/A'
        },
        { 
            key: 'description', 
            label: 'Descripción',
            render: (item) => item.description || 'Sin descripción'
        },
        {
            key: 'is_active',
            label: 'Estado',
            render: (item) => (
                <span className={`text-md p-3 font-semibold mb-1 badge rounded-lg border ${
                    item.is_active 
                        ? 'text-green-800 border-green-200 bg-green-50' 
                        : 'text-red-800 border-red-200 bg-red-50'
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

    useEffect(() => {
        loadSubcategories();
        loadValues();
    }, []);

    const loadSubcategories = async (page = 1, perPage = 10, search = '') => {
        try {
            const response = await axios.get('/api/subcategories', {
                params: {
                    page,
                    per_page: perPage,
                    search
                }
            });
            setSubcategories(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error al cargar subcategorías:', error);
            showNotification('error', 'Error al cargar las subcategorías');
        }
    };

    const loadValues = async () => {
        try {
            const response = await axios.get('/api/values/active');
            setValues(response.data);
        } catch (error) {
            console.error('Error al cargar valores:', error);
            showNotification('error', 'Error al cargar los valores');
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    const handleCreate = () => {
        setSelectedSubcategory(null);
        setModalOpen(true);
    };

    const handleEdit = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setModalOpen(true);
    };

    const handleDelete = (subcategory) => {
        setSubcategoryToDelete(subcategory);
        setDeleteModalOpen(true);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        loadSubcategories(1, pagination.perPage, term);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        loadSubcategories(page, pagination.perPage, searchTerm);
    };

    const handlePerPageChange = (perPage) => {
        setPagination(prev => ({ ...prev, perPage, currentPage: 1 }));
        loadSubcategories(1, perPage, searchTerm);
    };

    const handleBulkDelete = async (ids) => {
        try {
            await axios.post('/api/subcategories/bulk-delete', { ids });
            loadSubcategories(pagination.currentPage, pagination.perPage, searchTerm);
            showNotification('success', `${ids.length} ${ids.length === 1 ? 'componente eliminado' : 'componentes eliminados'} exitosamente`);
        } catch (error) {
            console.error('Error al eliminar subcategorías:', error);
            showNotification('error', 'Error al eliminar las subcategorías');
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/subcategories/${subcategoryToDelete.id}`);
            loadSubcategories(pagination.currentPage, pagination.perPage, searchTerm);
            setDeleteModalOpen(false);
            setSubcategoryToDelete(null);
            showNotification('success', 'Subcategoría eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar:', error);
            showNotification('error', 'Error al eliminar la subcategoría');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedSubcategory) {
                await axios.put(`/api/subcategories/${selectedSubcategory.id}`, formData);
                showNotification('success', 'Subcategoría actualizada exitosamente');
            } else {
                await axios.post('/api/subcategories', formData);
                showNotification('success', 'Subcategoría creada exitosamente');
            }
            loadSubcategories(pagination.currentPage, pagination.perPage, searchTerm);
            setModalOpen(false);
        } catch (error) {
            console.error('Error al guardar subcategoría:', error);
            showNotification('error', 'Error al guardar la subcategoría');
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="Listado de Componentes" />

            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Componentes</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona los componentes del sistema
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Nuevo componente
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <TableList
                    columns={columns}
                    data={subcategories}
                    onSearch={handleSearch}
                    onSort={() => {}}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onBulkDelete={handleBulkDelete}
                />
            </div>

            <SubcategoryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                subcategory={selectedSubcategory}
                values={values}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSubcategoryToDelete(null);
                }}
                onConfirm={confirmDelete}
                title={`¿Eliminar componente "${subcategoryToDelete?.name}"?`}
                description="¿Está seguro de que desea eliminar este componente? Esta acción no se puede deshacer."
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