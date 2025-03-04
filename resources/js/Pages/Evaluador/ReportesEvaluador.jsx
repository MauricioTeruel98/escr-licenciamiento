import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import axios from 'axios';
import EvaluadorLayout from '@/Layouts/EvaluadorLayout';

export default function Reportes() {
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
                    item.estado === 'Auto-evaluación' 
                        ? 'text-yellow-800 border-yellow-200 bg-yellow-50' 
                        : 'text-green-800 border-green-200 bg-green-50'
                }`}>
                    {item.estado}
                </span>
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
        loadEmpresas();
    }, []);

    const loadEmpresas = async (page = 1, perPage = 10, search = '') => {
        try {
            const response = await axios.get('/api/empresas-reportes-evaluador', {
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

    const handleReporteClick = (empresa) => {
        // Implementar la lógica para descargar o ver el reporte
        
    };

    return (
        <EvaluadorLayout>
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
                />
            </div>
        </EvaluadorLayout>
    );
}
