import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import axios from 'axios';

export default function Progresos() {
    const [empresas, setEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });

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
                        colorClass = 'text-blue-800 border-blue-200 bg-blue-50';
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
            key: 'fecha_inicio',
            label: 'Fecha Inicio',
            render: (item) => (
                <div className="text-sm text-gray-700">
                    {item.fecha_inicio || '-'}
                </div>
            )
        },
        {
            key: 'fecha_fin',
            label: 'Fecha Finalización',
            render: (item) => (
                <div className="text-sm text-gray-700">
                    {item.fecha_fin || '-'}
                </div>
            )
        },
        {
            key: 'progreso',
            label: 'Progreso',
            render: (item) => (
                <div className="w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${item.progreso.toFixed(0)}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {item.progreso.toFixed(0)}%
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Acciones',
            render: (item) => {
                if ((item.estado === 'Auto-evaluación Completada' || item.estado === 'Evaluación') && !item.authorized && item.form_sended) {
                    return (
                        <button
                            onClick={() => handleAuthorize(item.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            {isProcessing ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </div>
                            ) : (
                                'Autorizar'
                            )}
                        </button>
                    );
                }
                return item.authorized ? (
                    <span className="text-green-600 font-medium">Autorizado</span>
                ) : null;
            }
        }
    ];

    useEffect(() => {
        loadEmpresas();
    }, []);

    const loadEmpresas = async (page = 1, perPage = 10, search = '') => {
        try {
            const response = await axios.get('/api/empresas-progresos', {
                params: {
                    page,
                    per_page: perPage,
                    search
                }
            });
            setEmpresas(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error al cargar empresas:', error);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        loadEmpresas(1, pagination.perPage, term);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        loadEmpresas(page, pagination.perPage, searchTerm);
    };

    const handlePerPageChange = (perPage) => {
        setPagination(prev => ({ ...prev, perPage, currentPage: 1 }));
        loadEmpresas(1, perPage, searchTerm);
    };

    const handleAuthorize = async (companyId) => {
        setIsProcessing(true);
        try {
            await axios.patch(`/api/companies/${companyId}/authorize`);
            loadEmpresas(pagination.currentPage, pagination.perPage, searchTerm);
        } catch (error) {
            console.error('Error al autorizar empresa:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="Progresos" />

            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Progresos</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Monitorea el progreso de las empresas en sus procesos
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <TableList
                    columns={columns}
                    data={empresas}
                    onSearch={handleSearch}
                    onSort={() => { }}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </SuperAdminLayout>
    );
}
