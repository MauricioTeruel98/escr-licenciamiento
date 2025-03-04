import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import HomologationModal from '@/Components/Modals/HomologationModal';
import DeleteModal from '@/Components/Modals/DeleteModal';
import Toast from '@/Components/Toast';
import axios from 'axios';
import EditIcon from '@/Components/Icons/EditIcon';
import TrashIcon from '@/Components/Icons/TrashIcon';

export default function HomologationsIndex() {
    const [homologations, setHomologations] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedHomologation, setSelectedHomologation] = useState(null);
    const [homologationToDelete, setHomologationToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });

    const TIPOS = {
        'INTE': 'INTE',
        'ISO': 'ISO',
        'IEC': 'IEC',
        'OTRO': 'Otro'
    };

    const CATEGORIAS = {
        'EXCELENCIA': 'Excepcional',
        'INNOVACION': 'Innovación',
        'PROGRESO_SOCIAL': 'Progreso Social',
        'SOSTENIBILIDAD': 'Sostenibilidad',
        'VINCULACION': 'Vinculación'
    };

    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { 
            key: 'tipo', 
            label: 'Tipo',
            render: (item) => TIPOS[item.tipo] || item.tipo
        },
        // { 
        //     key: 'categoria', 
        //     label: 'Categoría',
        //     render: (item) => CATEGORIAS[item.categoria] || item.categoria
        // },
        // { 
        //     key: 'descripcion', 
        //     label: 'Descripción',
        //     render: (item) => item.descripcion || 'Sin descripción'
        // },
        {
            key: 'activo',
            label: 'Estado',
            render: (item) => (
                <span className={`text-md p-3 font-semibold mb-1 badge rounded-lg border ${
                    item.activo 
                        ? 'text-green-800 border-green-200 bg-green-50' 
                        : 'text-red-800 border-red-200 bg-red-50'
                }`}>
                    {item.activo ? 'Activo' : 'Inactivo'}
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
        loadHomologations();
    }, []);

    const loadHomologations = async (page = 1, perPage = 10, search = '') => {
        try {
            const response = await axios.get('/api/homologations', {
                params: {
                    page,
                    per_page: perPage,
                    search
                }
            });
            setHomologations(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error al cargar homologaciones:', error);
            showNotification('error', 'Error al cargar las homologaciones');
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    const handleCreate = () => {
        setSelectedHomologation(null);
        setModalOpen(true);
    };

    const handleEdit = (homologation) => {
        setSelectedHomologation(homologation);
        setModalOpen(true);
    };

    const handleDelete = (homologation) => {
        setHomologationToDelete(homologation);
        setDeleteModalOpen(true);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        loadHomologations(1, pagination.perPage, term);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        loadHomologations(page, pagination.perPage, searchTerm);
    };

    const handlePerPageChange = (perPage) => {
        setPagination(prev => ({ ...prev, perPage, currentPage: 1 }));
        loadHomologations(1, perPage, searchTerm);
    };

    const handleBulkDelete = async (ids) => {
        try {
            await axios.post('/api/homologations/bulk-delete', { ids });
            loadHomologations(pagination.currentPage, pagination.perPage, searchTerm);
            showNotification('success', `${ids.length} ${ids.length === 1 ? 'homologación eliminada' : 'homologaciones eliminadas'} exitosamente`);
        } catch (error) {
            console.error('Error al eliminar homologaciones:', error);
            showNotification('error', 'Error al eliminar las homologaciones');
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/homologations/${homologationToDelete.id}`);
            loadHomologations(pagination.currentPage, pagination.perPage, searchTerm);
            setDeleteModalOpen(false);
            setHomologationToDelete(null);
            showNotification('success', 'Homologación eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar:', error);
            showNotification('error', 'Error al eliminar la homologación');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedHomologation) {
                await axios.put(`/api/homologations/${selectedHomologation.id}`, formData);
                showNotification('success', 'Homologación actualizada exitosamente');
            } else {
                await axios.post('/api/homologations', formData);
                showNotification('success', 'Homologación creada exitosamente');
            }
            loadHomologations(pagination.currentPage, pagination.perPage, searchTerm);
            setModalOpen(false);
        } catch (error) {
            console.error('Error al guardar homologación:', error);
            showNotification('error', 'Error al guardar la homologación');
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="Listado de Homologaciones" />

            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Homologaciones</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona las homologaciones del sistema
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Nueva Homologación
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <TableList
                    columns={columns}
                    data={homologations}
                    onSearch={handleSearch}
                    onSort={() => {}}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onBulkDelete={handleBulkDelete}
                />
            </div>

            <HomologationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                certification={selectedHomologation}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setHomologationToDelete(null);
                }}
                onConfirm={confirmDelete}
                title={`¿Eliminar homologación "${homologationToDelete?.nombre}"?`}
                description="¿Está seguro de que desea eliminar esta homologación? Esta acción no se puede deshacer."
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