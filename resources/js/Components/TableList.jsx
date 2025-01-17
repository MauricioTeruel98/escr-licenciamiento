import { useState } from 'react';
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
    onBulkDelete 
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

            {/* Tabla */}
            <div className="overflow-x-auto">
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
                                    <td key={`${item.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
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
                            Página {pagination.currentPage} de {pagination.lastPage}
                        </span>
                        <button
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.lastPage}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronRight className="h-5 w-5" />
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