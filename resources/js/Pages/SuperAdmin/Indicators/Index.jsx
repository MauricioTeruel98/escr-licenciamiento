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

export default function IndicatorsIndex() {
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
    const [loading, setLoading] = useState(false);

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
                                className={`text-md px-3 py-1 font-semibold mb-1 badge rounded-lg border text-blue-800 border-blue-200 bg-blue-50 ${homologation.nombre.length > 10 ? 'h-auto' : ''}`}
                                title={homologation.descripcion || homologation.nombre}
                            >
                                {homologation.nombre}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-500">Sin homologaciones</span>
                    )}
                </div>
            )
        },
        {
            key: 'binding',
            label: 'Descalificatório',
            render: (item) => (
                <span className={`text-md p-3 font-semibold mb-1 badge rounded-lg border ${
                    item.binding 
                        ? 'text-purple-800 border-purple-200 bg-purple-50' 
                        : 'text-gray-800 border-gray-200 bg-gray-50'
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
            key: 'requisito', 
            label: 'Requisito',
            render: (item) => item.requisito?.name || 'N/A'
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
                        onClick={() => handleViewQuestions(item)}
                        className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
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
        setLoading(true);
        try {
            const response = await axios.get('/api/indicators', {
                params: {
                    page,
                    per_page: perPage,
                    search
                }
            });
            
            setIndicators(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                perPage: response.data.per_page,
                total: response.data.total,
                lastPage: response.data.last_page
            });
            
            // Si hay un indicador seleccionado, actualizamos su información
            if (selectedIndicator) {
                const updatedIndicator = response.data.data.find(ind => ind.id === selectedIndicator.id);
                if (updatedIndicator) {
                    setSelectedIndicator(updatedIndicator);
                }
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar indicadores:', error);
            setLoading(false);
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
            // Verificar si es un evento personalizado
            if (formData.type) {
                // Manejar eventos personalizados
                if (formData.type === 'question_deleted') {
                    // Ya se ha eliminado la pregunta en el backend, solo necesitamos recargar los datos
                    await loadIndicators(pagination.currentPage, pagination.perPage, searchTerm);
                    showNotification('success', 'Pregunta eliminada exitosamente');
                    return;
                } else if (formData.type === 'indicator_updated' || formData.type === 'indicator_created') {
                    // Continuar con el flujo normal para guardar el indicador
                    formData = formData.data;
                }
            }

            // Verificar si hay preguntas vacías y filtrarlas
            if (formData.evaluation_questions && formData.evaluation_questions.length > 0) {
                const hasEmptyQuestions = formData.evaluation_questions.some(q => !q.trim());
                if (hasEmptyQuestions) {
                    console.log('Se han filtrado preguntas vacías');
                }
            }

            if (selectedIndicator) {
                await axios.put(`/api/indicators/${selectedIndicator.id}`, formData);
                showNotification('success', 'Indicador actualizado exitosamente');
            } else {
                await axios.post('/api/indicators', formData);
                showNotification('success', 'Indicador creado exitosamente');
            }
            
            // Recargar los indicadores para reflejar los cambios
            await loadIndicators(pagination.currentPage, pagination.perPage, searchTerm);
            setModalOpen(false);
        } catch (error) {
            console.error('Error al guardar indicador:', error);
            let errorMessage = 'Error al guardar el indicador';
            
            if (error.response) {
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data && error.response.data.errors) {
                    // Manejar errores de validación
                    const validationErrors = error.response.data.errors;
                    const firstError = Object.values(validationErrors)[0];
                    if (firstError && firstError.length > 0) {
                        errorMessage = firstError[0];
                    }
                }
            }
            
            showNotification('error', errorMessage);
        }
    };

    const handleViewQuestions = (indicator) => {
        setSelectedIndicatorForQuestions(indicator);
        setViewQuestionsModalOpen(true);
    };

    return (
        <SuperAdminLayout>
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
        </SuperAdminLayout>
    );
} 