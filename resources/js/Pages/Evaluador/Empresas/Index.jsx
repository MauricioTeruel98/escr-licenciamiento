import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router, usePage } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import { PlusCircle, Pencil, Trash2, Eye } from 'lucide-react';
import CompanyModal from '@/Components/Modals/CompanyModal';
import DeleteModal from '@/Components/Modals/DeleteModal';
import Toast from '@/Components/Toast';
import axios from 'axios';
import EditIcon from '@/Components/Icons/EditIcon';
import TrashIcon from '@/Components/Icons/TrashIcon';
import CompanyInfoModal from '@/Components/Modals/CompanyInfoModal';
import EvaluadorLayout from '@/Layouts/EvaluadorLayout';

export default function EmpresasEvaluadorIndex() {
    const [companies, setCompanies] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });
    const [error, setError] = useState(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);

    const columns = [
        {
            key: 'name',
            label: 'Nombre',
            render: (item) => (
                <div className="font-medium text-gray-900">{item.name}{console.log(item)}</div>
            )
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (item) => {
                let colorClass = '';
                let textItem = '';
                switch (item.estado_eval) {
                    case 'auto-evaluacion':
                        colorClass = 'text-yellow-800 border-yellow-200 bg-yellow-50';
                        textItem = 'Auto-evaluación';
                        break;
                    case 'auto-evaluacion-completada':
                        colorClass = 'text-blue-800 border-blue-200 bg-blue-50';
                        textItem = 'Auto-evaluación Completada';
                        break;
                    case 'evaluacion-pendiente':
                        colorClass = 'text-orange-800 border-orange-200 bg-orange-50';
                        textItem = 'Evaluación Pendiente';
                        break;
                    case 'evaluacion':
                        colorClass = 'text-green-800 border-green-200 bg-green-50';
                        textItem = 'Evaluación';
                        break;
                    case 'evaluacion-completada':
                        colorClass = 'text-indigo-800 border-indigo-200 bg-indigo-50';
                        textItem = 'Evaluación Completada';
                        break;
                    default:
                        colorClass = 'text-gray-800 border-gray-200 bg-gray-50';
                }

                return (
                    <span className={`text-md p-3 font-semibold mb-1 badge rounded-lg border ${colorClass}`}>
                        {textItem}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: '',
            render: (item) => (
                <div className="flex items-center justify-end gap-5">
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => handleViewQuestions(item)}
                            className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                            title="Ver preguntas"
                        >
                            <Eye className="h-5 w-5" />
                            Evaluar
                        </button>
                    </div>
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => handleReporteClick(item)}
                            className="text-green-700 hover:text-green-800 flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Reporte
                        </button>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get('/api/evaluador/companies');
                setCompanies(response.data);
            } catch (error) {
                console.error('Error al cargar empresas:', error);
                setError('Error al cargar las empresas');
            }
        };

        fetchCompanies();
    }, []);

    const handleCreate = () => {
        setSelectedCompany(null);
        setModalOpen(true);
    };

    const handleEdit = (company) => {
        setSelectedCompany(company);
        setModalOpen(true);
    };

    const handleDelete = (company) => {
        setCompanyToDelete(company);
        setDeleteModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedCompany) {
                await axios.put(`/api/companies/${selectedCompany.id}`, formData);
                setNotification({
                    type: 'success',
                    message: 'Empresa actualizada exitosamente'
                });
            } else {
                await axios.post('/api/companies', formData);
                setNotification({
                    type: 'success',
                    message: 'Empresa creada exitosamente'
                });
            }
            setModalOpen(false);
            fetchCompanies();
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al procesar la solicitud'
            });
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/companies/${companyToDelete.id}`);
            setNotification({
                type: 'success',
                message: 'Empresa eliminada exitosamente'
            });
            setDeleteModalOpen(false);
            fetchCompanies();
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al eliminar la empresa'
            });
        }
    };

    const handleBulkDelete = async (ids) => {
        try {
            await axios.post('/api/companies/bulk-delete', { ids });
            setNotification({
                type: 'success',
                message: 'Empresas eliminadas exitosamente'
            });
            fetchCompanies();
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al eliminar las empresas'
            });
        }
    };

    const handleViewInfo = (company) => {
        setSelectedCompany(company);
        setInfoModalOpen(true);
    };

    const handleViewQuestions = async (company) => {
        try {
            setNotification({
                type: 'info',
                message: 'Cambiando a la empresa seleccionada...'
            });

            // Cambiar a la empresa seleccionada
            await axios.post('/api/evaluador/switch-company', {
                company_id: company.id
            });

            // Redirigir al dashboard del evaluador usando router.visit
            router.visit(route('evaluador.dashboard'));
        } catch (error) {
            console.error('Error al cambiar de empresa:', error);
            setNotification({
                type: 'error',
                message: 'Error al cambiar de empresa: ' + (error.response?.data?.message || 'Error desconocido')
            });
        }
    };

    const handleReporteClick = (company) => {
        // Redirigir a la página de reportes con el ID de la empresa usando router.visit
        router.visit(`/evaluador/reportes?company_id=${company.id}`);
    };

    return (
        <EvaluadorLayout>
            <Head title="Gestión de Empresas" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Empresas
                    </h1>
                </div>

                <div className="mt-8">
                    {error && <div className="error">{error}</div>}
                    <TableList
                        columns={columns}
                        data={companies}
                        pagination={pagination}
                        onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
                        onPerPageChange={(perPage) => setPagination({ ...pagination, perPage, currentPage: 1 })}
                        onBulkDelete={handleBulkDelete}
                    />
                </div>

                <CompanyModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSubmit}
                    company={selectedCompany}
                />

                <DeleteModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setCompanyToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                    title={`¿Eliminar empresa "${companyToDelete?.name}"?`}
                    description="¿Está seguro de que desea eliminar esta empresa? Esta acción no se puede deshacer y eliminará todos los datos asociados."
                />

                {notification && (
                    <Toast
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                <CompanyInfoModal
                    isOpen={infoModalOpen}
                    onClose={() => setInfoModalOpen(false)}
                    company={selectedCompany}
                />
            </div>
        </EvaluadorLayout>
    );
} 