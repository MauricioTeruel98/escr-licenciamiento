import { useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import InputError from '@/Components/InputError';
import Toast from '@/Components/Toast';
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function CompanyEdit({ company, sectors, provincias, userName }) {
    const { flash } = usePage().props;

    const { data, setData, patch, errors, processing } = useForm({
        name: company.name || '',
        website: company.website || '',
        sector: company.sector || '',
        provincia: company.provincia || '',
        legal_id: company.legal_id || '',
        commercial_activity: company.commercial_activity || '',
        phone: company.phone || '',
        mobile: company.mobile || '',
        is_exporter: company.is_exporter || false,
    });

    const [searchTerm, setSearchTerm] = useState(company.provincia || '');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredProvincias, setFilteredProvincias] = useState([]);

    // Función para limpiar valores de entrada
    const cleanInputValue = (value) => {
        if (typeof value !== 'string') return value;
        // Eliminar espacios en blanco al inicio, comillas simples/dobles, barras y barras invertidas
        return value.replace(/^[\s]+|['"\\\/]/g, '');
    };

    const handleInputChange = (e, field) => {
        if (field === 'website') {
            // Para URLs permitimos barras y barras invertidas, solo eliminamos espacios al inicio y comillas
            let cleanedValue = e.target.value.replace(/^[\s]+|['\"]/g, '');
            
            // Verificar si la URL tiene el protocolo, si no, agregar https://
            if (cleanedValue && !cleanedValue.match(/^https?:\/\//i)) {
                // Solo agregar el protocolo si el usuario ha escrito algo más que solo www.
                if (cleanedValue.length > 4) {
                    cleanedValue = 'https://' + cleanedValue;
                }
            }
            
            setData(field, cleanedValue);
        } else {
            // Para otros campos eliminamos espacios al inicio, comillas, barras y barras invertidas
            const cleanedValue = cleanInputValue(e.target.value);
            setData(field, cleanedValue);
        }
    };

    // Efecto para filtrar provincias basado en el término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProvincias(provincias || []);
        } else {
            const filtered = (provincias || []).filter(provincia => 
                provincia.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProvincias(filtered);
        }
    }, [searchTerm, provincias]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Limpiar todos los campos de texto antes de enviar
        const cleanedData = {};
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string') {
                if (key === 'website') {
                    // Para URLs solo eliminamos espacios al inicio y comillas
                    let cleanedValue = data[key].replace(/^[\s]+|['\"]/g, '');
                    
                    // Asegurar que la URL tenga el protocolo
                    if (cleanedValue && !cleanedValue.match(/^https?:\/\//i)) {
                        cleanedValue = 'https://' + cleanedValue;
                    }
                    
                    cleanedData[key] = cleanedValue;
                } else {
                    // Para otros campos eliminamos espacios al inicio, comillas, barras y barras invertidas
                    cleanedData[key] = cleanInputValue(data[key]);
                }
            } else {
                cleanedData[key] = data[key];
            }
        });
        
        // Actualizar los datos con los valores limpios
        Object.keys(cleanedData).forEach(key => {
            setData(key, cleanedData[key]);
        });
        
        patch(route('company.update'));
    };

    return (
        <DashboardLayout title="Perfil de Empresa" userName={userName}>
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold mb-6">Perfil de Empresa</h1>
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                    {flash.success && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">
                                        {flash.success}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre de la empresa */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre de la empresa<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => handleInputChange(e, 'name')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="Nombre de la empresa"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Sitio web */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Sitio web<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.website}
                                    onChange={e => handleInputChange(e, 'website')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="https://www.ejemplo.com"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Debe incluir "https://" o "http://" al inicio de la dirección (ejemplo: https://www.miempresa.com)
                                </p>
                                <InputError message={errors.website} className="mt-2" />
                            </div>

                            {/* Sector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Sector<span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.sector}
                                    onChange={e => handleInputChange(e, 'sector')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="">Escoger sector</option>
                                    {sectors.map(sector => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </select>
                                <InputError message={errors.sector} className="mt-2" />
                            </div>

                            {/* Provincia */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Provincia<span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm || data.provincia}
                                        onChange={e => {
                                            // Limpiar el valor de entrada eliminando comillas, barras y barras invertidas
                                            const cleanedValue = e.target.value.replace(/['"\\\/]/g, '');
                                            setSearchTerm(cleanedValue);
                                            setShowDropdown(true);
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        placeholder="Buscar provincia"
                                        onFocus={() => setShowDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    />
                                    <input 
                                        type="hidden" 
                                        name="provincia" 
                                        value={data.provincia} 
                                    />
                                    {showDropdown && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            {filteredProvincias.length > 0 ? (
                                                filteredProvincias.map(provincia => (
                                                    <div
                                                        key={provincia.id}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => {
                                                            // Asegurar que el nombre de provincia no tenga caracteres especiales
                                                            const cleanedValue = provincia.name.replace(/['"\\\/]/g, '');
                                                            setData('provincia', cleanedValue);
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
                                <InputError message={errors.provincia} className="mt-2" />
                            </div>

                            {/* Cédula jurídica */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Cédula jurídica
                                </label>
                                <input
                                    type="text"
                                    value={data.legal_id}
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                                    placeholder="#########"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Para cambiar la cédula jurídica, favor comunicarse con{' '}
                                    <a href="#" className="text-green-600 hover:underline">
                                        soporte técnico
                                    </a>
                                    .
                                </p>
                            </div>

                            {/* Actividad comercial */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Actividad comercial<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.commercial_activity}
                                    onChange={e => handleInputChange(e, 'commercial_activity')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="Actividad comercial"
                                />
                                <InputError message={errors.commercial_activity} className="mt-2" />
                            </div>

                            {/* Teléfono fijo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Teléfono fijo<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => handleInputChange(e, 'phone')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="2222-2222"
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            {/* Teléfono célular */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Teléfono célular<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.mobile}
                                    onChange={e => handleInputChange(e, 'mobile')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="2222-2222"
                                />
                                <InputError message={errors.mobile} className="mt-2" />
                            </div>
                        </div>

                        {/* ¿Es una empresa exportadora? */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                ¿Es una empresa exportadora?<span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="is_exporter"
                                        checked={data.is_exporter}
                                        onChange={() => setData('is_exporter', true)}
                                        className="form-radio text-green-600"
                                    />
                                    <span className="ml-2">Sí</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="is_exporter"
                                        checked={!data.is_exporter}
                                        onChange={() => setData('is_exporter', false)}
                                        className="form-radio text-green-600"
                                    />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {!data.is_exporter && (
                                <div>
                                    <p className="text-red-500 text-sm">
                                        Ser empresa exportadora es un requisito obligatorio.
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Para excepciones{' '}
                                        <a
                                            href="mailto:licenciasmarcapais@procomer.com"
                                            className="text-green-600 hover:underline"
                                        >
                                            licenciasmarcapais@procomer.com
                                        </a>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
} 