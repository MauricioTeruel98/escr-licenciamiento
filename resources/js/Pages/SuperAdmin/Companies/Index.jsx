import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import CompanyModal from '@/Components/Modals/CompanyModal';
import DeleteModal from '@/Components/Modals/DeleteModal';
import Toast from '@/Components/Toast';
import axios from 'axios';

export default function CompaniesIndex() {
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

    const columns = [
        { key: 'legal_id', label: 'ID Legal' },
        { key: 'name', label: 'Nombre' },
        { key: 'sector', label: 'Sector' },
        { key: 'city', label: 'Ciudad' },
        { 
            key: 'is_exporter', 
            label: 'Exportador',
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.is_exporter ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {item.is_exporter ? 'Sí' : 'No'}
                </span>
            )
        },
        {
            key: 'users_count',
            label: 'Usuarios',
            render: (item) => item.users_count || 0
        },
        {
            key: 'actions',
            label: 'Acciones',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        className="p-1 text-red-600 hover:text-red-900"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    useEffect(() => {
        fetchCompanies();
    }, [pagination.currentPage, pagination.perPage]);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/companies', {
                params: {
                    page: pagination.currentPage,
                    per_page: pagination.perPage
                }
            });
            setCompanies(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error al cargar empresas:', error);
            setNotification({
                type: 'error',
                message: 'Error al cargar las empresas'
            });
        }
    };

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

    return (
        <SuperAdminLayout>
            <Head title="Gestión de Empresas" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Gestión de Empresas
                    </h1>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Nueva Empresa
                    </button>
                </div>

                <div className="mt-8">
                    <TableList
                        columns={columns}
                        data={companies}
                        pagination={pagination}
                        onPageChange={(page) => setPagination({...pagination, currentPage: page})}
                        onPerPageChange={(perPage) => setPagination({...pagination, perPage, currentPage: 1})}
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
            </div>
        </SuperAdminLayout>
    );
} 