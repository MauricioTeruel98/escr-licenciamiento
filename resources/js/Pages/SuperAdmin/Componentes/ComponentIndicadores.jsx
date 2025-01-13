import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import { PlusCircle, Pencil, Trash2, Eye } from 'lucide-react';
import IndicatorModal from '@/Components/Modals/IndicatorModal';
import DeleteModal from '@/Components/Modals/DeleteModal';
import Toast from '@/Components/Toast';
import axios from 'axios';
import ViewQuestionsModal from '@/Components/ViewQuestionsModal';
import EditIcon from '@/Components/Icons/EditIcon';
import TrashIcon from '@/Components/Icons/TrashIcon';

export default function ComponentIndicadores() {
    const [indicators, setIndicators] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [indicatorToDelete, setIndicatorToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [relatedData, setRelatedData] = useState({
        values: [],
        subcategories: [],
        homologations: []
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });
    const [viewQuestionsModalOpen, setViewQuestionsModalOpen] = useState(false);
    const [selectedIndicatorForQuestions, setSelectedIndicatorForQuestions] = useState(null);

    const columns = [
        { key: 'name', label: 'Nombre' },
        { 
            key: 'homologations', 
            label: 'Homologaciones',
            render: (item) => (
                <div className="flex flex-wrap gap-1">
                    {item.homologations && item.homologations.length > 0 ? (
                        item.homologations.map((homologation) => (
                            <span
                                key={homologation.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                title={homologation.descripcion || homologation.nombre}
                            >
                                {homologation.nombre}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm">Sin homologaciones</span>
                    )}
                </div>
            )
        },
        {
            key: 'binding',
            label: 'Vinculante',
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.binding ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {item.binding ? 'Sí' : 'No'}
                </span>
            )
        },
        { 
            key: 'value', 
            label: 'Valor',
            render: (item) => item.value?.name || 'N/A'
        },
        { 
            key: 'subcategory', 
            label: 'Subcategoría',
            render: (item) => item.subcategory?.name || 'N/A'
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
                        onClick={() => handleViewQuestions(item)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        title="Ver preguntas"
                    >
                        <Eye className="h-5 w-5" />
                        Ver
                    </button>
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
        loadIndicators();
        loadRelatedData();
    }, []);

    const loadIndicators = async (page = 1, perPage = 10, search = '') => {
        try {
            const response = await axios.get('/api/indicators', {
                params: {
                    page,
                    per_page: perPage,
                    search,
                    with: ['homologations', 'value', 'subcategory']
                }
            });
            setIndicators(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error al cargar indicadores:', error);
            showNotification('error', 'Error al cargar los indicadores');
        }
    };

    const loadRelatedData = async () => {
        try {
            const response = await axios.get('/api/indicators/related-data');
            setRelatedData(response.data);
        } catch (error) {
            console.error('Error al cargar datos relacionados:', error);
            showNotification('error', 'Error al cargar datos relacionados');
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    const handleCreate = () => {
        setSelectedIndicator(null);
        setModalOpen(true);
    };

    const handleEdit = (indicator) => {
        setSelectedIndicator(indicator);
        setModalOpen(true);
    };

    const handleDelete = (indicator) => {
        setIndicatorToDelete(indicator);
        setDeleteModalOpen(true);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        loadIndicators(1, pagination.perPage, term);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        loadIndicators(page, pagination.perPage, searchTerm);
    };

    const handlePerPageChange = (perPage) => {
        setPagination(prev => ({ ...prev, perPage, currentPage: 1 }));
        loadIndicators(1, perPage, searchTerm);
    };

    const handleBulkDelete = async (ids) => {
        try {
            await axios.post('/api/indicators/bulk-delete', { ids });
            loadIndicators(pagination.currentPage, pagination.perPage, searchTerm);
            showNotification('success', `${ids.length} ${ids.length === 1 ? 'indicador eliminado' : 'indicadores eliminados'} exitosamente`);
        } catch (error) {
            console.error('Error al eliminar indicadores:', error);
            showNotification('error', 'Error al eliminar los indicadores');
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/indicators/${indicatorToDelete.id}`);
            loadIndicators(pagination.currentPage, pagination.perPage, searchTerm);
            setDeleteModalOpen(false);
            setIndicatorToDelete(null);
            showNotification('success', 'Indicador eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar:', error);
            showNotification('error', 'Error al eliminar el indicador');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedIndicator) {
                await axios.put(`/api/indicators/${selectedIndicator.id}`, formData);
                showNotification('success', 'Indicador actualizado exitosamente');
            } else {
                await axios.post('/api/indicators', formData);
                showNotification('success', 'Indicador creado exitosamente');
            }
            loadIndicators(pagination.currentPage, pagination.perPage, searchTerm);
            setModalOpen(false);
        } catch (error) {
            console.error('Error al guardar indicador:', error);
            showNotification('error', 'Error al guardar el indicador');
        }
    };

    const handleViewQuestions = (indicator) => {
        setSelectedIndicatorForQuestions(indicator);
        setViewQuestionsModalOpen(true);
    };

    return (
        <>
            <Head title="Listado de Indicadores" />

            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Indicadores</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona los indicadores del sistema
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Nuevo Indicador
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <TableList
                    columns={columns}
                    data={indicators}
                    onSearch={handleSearch}
                    onSort={() => {}}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onBulkDelete={handleBulkDelete}
                />
            </div>

            <IndicatorModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                indicator={selectedIndicator}
                relatedData={relatedData}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setIndicatorToDelete(null);
                }}
                onConfirm={confirmDelete}
                title={`¿Eliminar indicador "${indicatorToDelete?.name}"?`}
                description="¿Está seguro de que desea eliminar este indicador? Esta acción no se puede deshacer."
            />

            <ViewQuestionsModal
                isOpen={viewQuestionsModalOpen}
                onClose={() => {
                    setViewQuestionsModalOpen(false);
                    setSelectedIndicatorForQuestions(null);
                }}
                indicator={selectedIndicatorForQuestions}
            />

            {notification && (
                <Toast
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    );
} 