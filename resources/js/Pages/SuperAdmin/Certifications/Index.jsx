import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import CertificationModal from '@/Components/Modals/CertificationModal';
import DeleteModal from '@/Components/Modals/DeleteModal';
import Toast from '@/Components/Toast';
import axios from 'axios';
import EditIcon from '@/Components/Icons/EditIcon';
import TrashIcon from '@/Components/Icons/TrashIcon';

export default function CertificationsIndex() {
    const [certifications, setCertifications] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCertification, setSelectedCertification] = useState(null);
    const [certificationToDelete, setCertificationToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });

    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { 
            key: 'company', 
            label: 'Empresa',
            render: (item) => item.company?.name || '-'
        },
        { 
            key: 'fecha_obtencion', 
            label: 'Fecha de Obtención',
            render: (item) => new Date(item.fecha_obtencion).toLocaleDateString()
        },
        { 
            key: 'fecha_expiracion', 
            label: 'Fecha de Expiración',
            render: (item) => new Date(item.fecha_expiracion).toLocaleDateString()
        },
        { 
            key: 'indicadores', 
            label: 'Indicadores',
            render: (item) => item.indicadores || 0
        },
        {
            key: 'actions',
            label: 'Acciones',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-green-700 hover:text-green-800 flex items-center gap-1"
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
        fetchCertifications();
    }, [pagination.currentPage, pagination.perPage]);

    const fetchCertifications = async () => {
        try {
            const response = await axios.get('/api/certifications', {
                params: {
                    page: pagination.currentPage,
                    per_page: pagination.perPage
                }
            });
            setCertifications(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error al cargar certificaciones:', error);
            setNotification({
                type: 'error',
                message: 'Error al cargar las certificaciones'
            });
        }
    };

    const handleCreate = () => {
        setSelectedCertification(null);
        setModalOpen(true);
    };

    const handleEdit = (certification) => {
        setSelectedCertification(certification);
        setModalOpen(true);
    };

    const handleDelete = (certification) => {
        setCertificationToDelete(certification);
        setDeleteModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedCertification) {
                await axios.put(`/api/certifications/${selectedCertification.id}`, formData);
                setNotification({
                    type: 'success',
                    message: 'Certificación actualizada exitosamente'
                });
            } else {
                await axios.post('/api/certifications', formData);
                setNotification({
                    type: 'success',
                    message: 'Certificación creada exitosamente'
                });
            }
            setModalOpen(false);
            fetchCertifications();
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
            await axios.delete(`/api/certifications/${certificationToDelete.id}`);
            setNotification({
                type: 'success',
                message: 'Certificación eliminada exitosamente'
            });
            setDeleteModalOpen(false);
            fetchCertifications();
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al eliminar la certificación'
            });
        }
    };

    const handleBulkDelete = async (ids) => {
        try {
            await axios.post('/api/certifications/bulk-delete', { ids });
            setNotification({
                type: 'success',
                message: 'Certificaciones eliminadas exitosamente'
            });
            fetchCertifications();
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al eliminar las certificaciones'
            });
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="Gestión de Certificaciones" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Gestión de Certificaciones
                    </h1>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Nueva Certificación
                    </button>
                </div>

                <div className="mt-8">
                    <TableList
                        columns={columns}
                        data={certifications}
                        pagination={pagination}
                        onPageChange={(page) => setPagination({...pagination, currentPage: page})}
                        onPerPageChange={(perPage) => setPagination({...pagination, perPage, currentPage: 1})}
                        onBulkDelete={handleBulkDelete}
                    />
                </div>

                <CertificationModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSubmit}
                    certification={selectedCertification}
                />

                <DeleteModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setCertificationToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                    title={`¿Eliminar certificación "${certificationToDelete?.nombre}"?`}
                    description="¿Está seguro de que desea eliminar esta certificación? Esta acción no se puede deshacer."
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