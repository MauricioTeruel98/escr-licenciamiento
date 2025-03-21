import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react';
import DeleteModal from '@/Components/Modals/DeleteModal';

export default function TableList({ 
    columns, 
    data, 
    onSort, 
    onSearch,
    pagination,
    onPageChange,
    onPerPageChange,
    onBulkDelete,
    isLoading
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pageInputValue, setPageInputValue] = useState(pagination.currentPage);

    useEffect(() => {
        setPageInputValue(pagination.currentPage);
    }, [pagination.currentPage]);

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
            } else {
                return [...prev, id];
            }
        });
    };

    const clearSelection = () => {
        setSelectedItems([]);
    };

    const handleBulkDelete = () => {
        onBulkDelete(selectedItems);
        clearSelection();
        setShowDeleteModal(false);
    };

    const handlePageInputChange = (e) => {
        const value = e.target.value;
        setPageInputValue(value);

        const pageNumber = parseInt(value);
        if (pageNumber >= 1 && pageNumber <= pagination.lastPage) {
            onPageChange(pageNumber);
        }
    };

    const handlePageInputBlur = () => {
        if (!pageInputValue || pageInputValue < 1 || pageInputValue > pagination.lastPage) {
            setPageInputValue(pagination.currentPage);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Barra de acciones masivas */}
            {selectedItems.length > 0 && (
                <div className="bg-gray-50/80 backdrop-blur-xl border-b border-gray-200 px-4 py-2 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-700">
                                {selectedItems.length} {selectedItems.length === 1 ? 'elemento seleccionado' : 'elementos seleccionados'}
                            </span>
                            <button 
                                onClick={clearSelection}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Deseleccionar
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar seleccionados
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Barra de búsqueda */}
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        onChange={(e) => onSearch(e.target.value)}
                        className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="Buscar..."
                    />
                </div>
            </div>

            {/* Tabla con loader */}
            <div className="relative overflow-x-auto">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                )}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    checked={selectedItems.length === data.length && data.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    onClick={() => onSort && onSort(column.key)}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap w-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)}
                                    />
                                </td>
                                {columns.map((column) => (
                                    <td key={`${item.id}-${column.key}`} className="px-6 py-4">
                                        <div className={`${column.key === 'company' ? 'max-h-24' : 'max-h-32'} overflow-y-auto scrollbar-custom pr-2`}>
                                            {column.render ? column.render(item) : item[column.key]}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación actualizada */}
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
                        {/* Botón Primera Página */}
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={pagination.currentPage === 1 || isLoading}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Primera página"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Botón Página Anterior */}
                        <button
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1 || isLoading}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Página anterior"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        {/* Input de Página */}
                        <div className="flex items-center space-x-1">
                            <input
                                type="number"
                                min="1"
                                max={pagination.lastPage}
                                value={pageInputValue}
                                onChange={handlePageInputChange}
                                onBlur={handlePageInputBlur}
                                className="w-16 border-gray-300 rounded-md text-sm text-center"
                            />
                            <span className="text-sm text-gray-700">
                                de {pagination.lastPage}
                            </span>
                        </div>

                        {/* Botón Página Siguiente */}
                        <button
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.lastPage || isLoading}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Página siguiente"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Botón Última Página */}
                        <button
                            onClick={() => onPageChange(pagination.lastPage)}
                            disabled={pagination.currentPage === pagination.lastPage || isLoading}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Última página"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación masiva */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleBulkDelete}
                title="¿Eliminar elementos seleccionados?"
                description={`¿Está seguro de que desea eliminar ${selectedItems.length} ${
                    selectedItems.length === 1 ? 'elemento' : 'elementos'
                }? Esta acción no se puede deshacer.`}
            />
        </div>
    );
} 