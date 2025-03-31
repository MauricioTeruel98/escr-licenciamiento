import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ subcategory }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: subcategory.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between cursor-move"
            {...attributes}
            {...listeners}
        >
            <div className="flex-1">
                <div className="flex items-center">
                    <span className="font-medium">{subcategory.name}</span>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        Orden: {subcategory.order}
                    </span>
                </div>
                {subcategory.description && (
                    <p className="text-sm text-gray-500 mt-1">{subcategory.description}</p>
                )}
            </div>
            <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>
        </li>
    );
}

export default function SubcategoryOrderModal({ isOpen, onClose, valueId, valueName }) {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (isOpen && valueId) {
            loadSubcategories();
        }
    }, [isOpen, valueId]);

    const loadSubcategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/values/${valueId}/subcategories`);
            
            // Ordenar las subcategorías por el campo order de forma descendente
            const sortedSubcategories = [...response.data].sort((a, b) => b.order - a.order);
            
            setSubcategories(sortedSubcategories);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar subcategorías:', error);
            setLoading(false);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSubcategories((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Actualizar el orden de forma descendente (valores más altos = mayor prioridad)
                const totalItems = newItems.length;
                return newItems.map((item, index) => ({
                    ...item,
                    order: totalItems - index
                }));
            });
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const totalItems = subcategories.length;
            await axios.post('/api/subcategories/update-order', {
                subcategories: subcategories.map((item, index) => ({
                    id: item.id,
                    order: totalItems - index
                }))
            });
            setSaving(false);
            onClose();
        } catch (error) {
            console.error('Error al guardar el orden:', error);
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            {/* Modal */}
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Ordenar subcategorías de {valueName}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="px-6 py-4">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                                </div>
                            ) : subcategories.length === 0 ? (
                                <p className="text-center py-4 text-gray-500">
                                    No hay subcategorías para ordenar
                                </p>
                            ) : (
                                <div className="py-2">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Arrastra y suelta las subcategorías para cambiar su orden. Las subcategorías en la parte superior tendrán mayor prioridad.
                                    </p>
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={subcategories.map(item => item.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <ul className="space-y-2">
                                                {subcategories.map((subcategory) => (
                                                    <SortableItem
                                                        key={subcategory.id}
                                                        subcategory={subcategory}
                                                    />
                                                ))}
                                            </ul>
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || subcategories.length === 0}
                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white ${
                                    saving || subcategories.length === 0
                                        ? 'bg-green-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                }`}
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar orden'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 