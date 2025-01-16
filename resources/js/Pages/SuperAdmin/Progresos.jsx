import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import axios from 'axios';

export default function Progresos() {
    const [empresas, setEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
            render: (item) => (
                <span className={`text-md p-3 font-semibold mb-1 badge rounded-lg border ${
                    item.estado === 'No aplica' 
                        ? 'text-gray-800 border-gray-200 bg-gray-50'
                        : item.estado === 'Auto-evaluación'
                            ? 'text-yellow-800 border-yellow-200 bg-yellow-50'
                            : 'text-green-800 border-green-200 bg-green-50'
                }`}>
                    {item.estado}
                </span>
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
                                style={{ width: `${item.progreso}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {item.progreso}%
                        </span>
                    </div>
                </div>
            )
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
                    onSort={() => {}}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </SuperAdminLayout>
    );
}
