import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CompanyModal({ isOpen, onClose, onSubmit, company = null, provincias = [] }) {
    const initialFormData = {
        legal_id: '',
        name: '',
        website: '',
        sector: '',
        provincia: '',
        commercial_activity: '',
        phone: '',
        mobile: '',
        is_exporter: false
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredProvincias, setFilteredProvincias] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (company) {
                setFormData({
                    legal_id: company.legal_id,
                    name: company.name,
                    website: company.website || '',
                    sector: company.sector,
                    provincia: company.provincia || '',
                    commercial_activity: company.commercial_activity,
                    phone: company.phone || '',
                    mobile: company.mobile || '',
                    is_exporter: company.is_exporter
                });
                setSearchTerm(company.provincia || '');
            } else {
                setFormData(initialFormData);
                setSearchTerm('');
            }
            setErrors({});
        }
    }, [isOpen, company]);

    // Efecto para filtrar provincias basado en el término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            // Ordenar provincias alfabéticamente por nombre
            const provinciasOrdenadas = [...(provincias || [])].sort((a, b) => 
                a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
            );
            setFilteredProvincias(provinciasOrdenadas);
        } else {
            const filtered = (provincias || [])
                .filter(provincia => 
                    provincia.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
            setFilteredProvincias(filtered);
        }
    }, [searchTerm, provincias]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData(initialFormData);
        setErrors({});
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="absolute right-0 top-0 pr-4 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                                    {company ? 'Editar Empresa' : 'Nueva Empresa'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cedula <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.legal_id}
                                            onChange={(e) => setFormData({...formData, legal_id: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sitio Web
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sector <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.sector}
                                            onChange={(e) => setFormData({...formData, sector: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Escoger sector</option>
                                            <option value="agricola">Agricola</option>
                                            <option value="alimentos">Alimentos</option>
                                            <option value="industria-especializada">Industria especializada</option>
                                            <option value="servicios">Servicios</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Provincia <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    const cleanedValue = e.target.value.replace(/['"\\\/]/g, '');
                                                    setSearchTerm(cleanedValue);
                                                    setShowDropdown(true);
                                                }}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                placeholder="Buscar provincia"
                                                onFocus={() => setShowDropdown(true)}
                                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                                required
                                            />
                                            <input 
                                                type="hidden" 
                                                name="provincia" 
                                                value={formData.provincia} 
                                            />
                                            {showDropdown && (
                                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {filteredProvincias.length > 0 ? (
                                                        filteredProvincias.map(provincia => (
                                                            <div
                                                                key={provincia.id}
                                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                                onClick={() => {
                                                                    const cleanedValue = provincia.name.replace(/['"\\\/]/g, '');
                                                                    setFormData({...formData, provincia: cleanedValue});
                                                                    setSearchTerm(cleanedValue);
                                                                    setShowDropdown(false);
                                                                }}
                                                            >
                                                                {provincia.name}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-2 text-gray-500">
                                                            No se encontraron resultados
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Actividad Comercial <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.commercial_activity}
                                            onChange={(e) => setFormData({...formData, commercial_activity: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Móvil
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_exporter}
                                            onChange={(e) => setFormData({...formData, is_exporter: e.target.checked})}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900">
                                            Es exportador
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                >
                                    {company ? 'Actualizar' : 'Crear'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 