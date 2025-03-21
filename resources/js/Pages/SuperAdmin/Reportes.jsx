import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import axios from 'axios';

export default function Reportes() {
    const [empresas, setEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingAuthorization, setLoadingAuthorization] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });
    const [isLoading, setIsLoading] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);

    const columns = [
        { 
            key: 'nombre', 
            label: 'Nombre',
            render: (item) => (
                <div className="font-medium text-gray-900">{item.nombre}</div>
            )
        },
        { 
            key: 'estado', 
            label: 'Estado',
            render: (item) => {
                let colorClass = '';
                
                switch (item.estado) {
                    case 'Auto-evaluación':
                        colorClass = 'text-yellow-800 border-yellow-200 bg-yellow-50';
                        break;
                    case 'Auto-evaluación Completada':
                        colorClass = 'text-blue-800 border-blue-200 bg-blue-50';
                        break;
                    case 'Evaluación Pendiente':
                        colorClass = 'text-orange-800 border-orange-200 bg-orange-50';
                        break;
                    case 'Evaluación':
                        colorClass = 'text-green-800 border-green-200 bg-green-50';
                        break;
                    case 'Evaluación Completada':
                        colorClass = 'text-indigo-800 border-indigo-200 bg-indigo-50';
                        break;
                    case 'Evaluación Calificada':
                        colorClass = 'text-amber-800 border-amber-200 bg-amber-50';
                        break;
                    case 'Evaluación Desaprobada':
                        colorClass = 'text-red-800 border-red-200 bg-red-50';
                        break;
                    case 'Evaluado':
                        colorClass = 'text-green-800 border-green-200 bg-green-50';
                        break;
                    default:
                        colorClass = 'text-gray-800 border-gray-200 bg-gray-50';
                }
                
                return (
                    <span className={`text-md p-3 font-semibold mb-1 badge rounded-lg border ${colorClass}`}>
                        {item.estado}
                    </span>
                );
            }
        },
        {
            key: 'es_exportador',
            label: 'Exportador',
            render: (item) => (
                <div className="text-md p-3 font-semibold mb-1 badge rounded-lg border flex items-center gap-2">
                    {item.es_exportador ? 'Si' : (
                        <div className="flex items-center gap-2">
                            {item.autorizado_por_super_admin ? (
                                <span className="text-red-600 font-semibold">Autorizado por Super Admin</span>
                            ) : (
                                <>
                                    <span>No</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAuthorizeExporter(item);
                                        }}
                                        disabled={loadingAuthorization === item.id}
                                        className={`${loadingAuthorization === item.id ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}
                                    >
                                        {loadingAuthorization === item.id ? (
                                            <>
                                                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Procesando...</span>
                                            </>
                                        ) : (
                                            'Autorizar'
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'actions',
            label: '',
            render: (item) => (
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
            )
        }
    ];

    useEffect(() => {
        fetchEmpresas();
    }, [pagination.currentPage, pagination.perPage, searchTerm]);

    const fetchEmpresas = async (page = pagination.currentPage, perPage = pagination.perPage, search = searchTerm) => {
        if (abortController) {
            abortController.abort();
        }

        const controller = new AbortController();
        setAbortController(controller);

        setIsLoading(true);
        try {
            const response = await axios.get('/api/empresas-reportes', {
                params: {
                    page,
                    per_page: perPage,
                    search
                },
                signal: controller.signal
            });
            setEmpresas(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error al cargar empresas:', error);
            }
        } finally {
            setIsLoading(false);
            setAbortController(null);
        }
    };

    const handleSearch = (term) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        setSearchTerm(term);
        
        const timeout = setTimeout(() => {
            setPagination(prev => ({ ...prev, currentPage: 1 }));
            fetchEmpresas(1, pagination.perPage, term);
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

    // Cleanup effect
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

    const handleReporteClick = (empresa) => {
        // Implementar la lógica para descargar o ver el reporte
        console.log('Descargar reporte de:', empresa.nombre);
    };

    const handleAuthorizeExporter = async (empresa) => {
        try {
            setLoadingAuthorization(empresa.id);
            await axios.patch(`/api/empresas-reportes/${empresa.id}/authorize-exporter`);
            // Actualizar la lista de empresas después de autorizar
            await fetchEmpresas();
        } catch (error) {
            console.error('Error al autorizar empresa como exportadora:', error);
        } finally {
            setLoadingAuthorization(null);
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="Reportes" />

            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona los reportes de las empresas
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <div className="mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Empresas</h2>
                </div>
                
                <TableList
                    columns={columns}
                    data={empresas}
                    onSearch={handleSearch}
                    onSort={() => {}}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    isLoading={isLoading}
                />
            </div>
        </SuperAdminLayout>
    );
}
