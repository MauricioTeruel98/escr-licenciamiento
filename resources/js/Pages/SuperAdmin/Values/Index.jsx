import { useState } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import TableList from '@/Components/TableList';
import { PlusCircle } from 'lucide-react';

export default function ValuesIndex() {
    const [values, setValues] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        perPage: 10
    });

    const columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'slug', label: 'Slug' },
        { 
            key: 'visibility', 
            label: 'Visibilidad',
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.visibility ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {item.visibility ? 'Visible' : 'Oculto'}
                </span>
            )
        },
        { 
            key: 'last_updated', 
            label: 'Última actualización',
            render: (item) => new Date(item.last_updated).toLocaleDateString()
        }
    ];

    const handleSearch = (term) => {
        // Implementar búsqueda
    };

    const handleSort = (key) => {
        // Implementar ordenamiento
    };

    const handlePageChange = (page) => {
        // Implementar cambio de página
    };

    const handlePerPageChange = (perPage) => {
        // Implementar cambio de items por página
    };

    return (
        <SuperAdminLayout>
            <Head title="Listado de Valores" />

            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Valores</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona los valores del sistema
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Nuevo Valor
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <TableList
                    columns={columns}
                    data={values}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </SuperAdminLayout>
    );
} 