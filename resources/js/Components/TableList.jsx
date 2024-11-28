import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function TableList({ 
    columns, 
    data, 
    onSort, 
    onSearch,
    pagination,
    onPageChange,
    onPerPageChange 
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(data.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            return [...prev, id];
        });
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header con búsqueda */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="w-12 px-4 py-3">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedItems.length === data.length}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                            </th>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => onSort(column.key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        <div className="flex flex-col">
                                            <ChevronUp className="h-3 w-3" />
                                            <ChevronDown className="h-3 w-3 -mt-1" />
                                        </div>
                                    </div>
                                </th>
                            ))}
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                </td>
                                {columns.map((column) => (
                                    <td key={column.key} className="px-4 py-3">
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
                                <td className="px-4 py-3">
                                    <div className="flex justify-end space-x-2">
                                        <button className="text-green-600 hover:text-green-700">
                                            Editar
                                        </button>
                                        <button className="text-red-600 hover:text-red-700">
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Mostrar</span>
                        <select
                            value={pagination.perPage}
                            onChange={(e) => onPerPageChange(Number(e.target.value))}
                            className="border border-gray-300 rounded-md text-sm"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span className="text-sm text-gray-700">por página</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm text-gray-700">
                            Página {pagination.currentPage} de {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 