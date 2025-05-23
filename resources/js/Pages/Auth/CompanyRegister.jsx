import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import ImageLayout from '@/Layouts/ImageLayout';

export default function CompanyRegister({ legalId, provincias, hasCompany }) {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        website: '',
        sector: '',
        provincia: '',
        legal_id: legalId || '',
        commercial_activity: '',
        phone: '',
        mobile: '',
        is_exporter: false,
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredProvincias, setFilteredProvincias] = useState([]);

    // Efecto para filtrar provincias basado en el término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            // Ordenar provincias alfabéticamente por nombre
            const provinciaOrdenadas = [...(provincias || [])].sort((a, b) =>
                a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
            );
            setFilteredProvincias(provinciaOrdenadas);
        } else {
            const filtered = (provincias || [])
                .filter(provincia =>
                    provincia.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
            setFilteredProvincias(filtered);
        }
    }, [searchTerm, provincias]);

    // Agregar useEffect para redirigir si ya tiene empresa
    useEffect(() => {
        if (hasCompany) {
            router.visit(route('dashboard'), {
                preserveScroll: true,
                onSuccess: () => {
                    // Mostrar mensaje de error
                    if (document.referrer !== '') {
                        window.history.pushState(null, '', route('dashboard'));
                    }
                }
            });
        }
    }, [hasCompany]);

    // Validación para cédula jurídica
    const validateLegalId = (legalId) => {
        const legalIdRegex = /^[a-zA-Z0-9]+$/;
        return legalIdRegex.test(legalId);
    };

    // Validación para teléfonos (solo números, guiones y paréntesis)
    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9\-\(\)]+$/;
        return phoneRegex.test(phone);
    };

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

    const handleLegalIdChange = (e) => {
        // Filtrar espacios y caracteres especiales
        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');

        setData('legal_id', value);

        if (value && !validateLegalId(value)) {
            setValidationErrors({
                ...validationErrors,
                legal_id: 'La cédula jurídica solo puede contener letras y números, sin espacios ni caracteres especiales.'
            });
        } else {
            const newErrors = { ...validationErrors };
            delete newErrors.legal_id;
            setValidationErrors(newErrors);
        }
    };

    const handlePhoneChange = (e, field) => {
        // Filtrar caracteres no permitidos en teléfonos y comillas
        const value = e.target.value.replace(/[^0-9\-\(\)]/g, '');

        // Eliminar comillas si por alguna razón quedaron
        const cleanedValue = cleanInputValue(value);

        setData(field, cleanedValue);

        if (cleanedValue && !validatePhone(cleanedValue)) {
            setValidationErrors({
                ...validationErrors,
                [field]: 'El teléfono solo puede contener números, guiones y paréntesis.'
            });
        } else {
            const newErrors = { ...validationErrors };
            delete newErrors[field];
            setValidationErrors(newErrors);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (hasCompany) {
            // Redirigir al dashboard con mensaje de error
            router.visit(route('dashboard'), {
                preserveScroll: true,
                onFinish: () => {
                    // Mostrar mensaje flash
                    router.reload({ only: ['flash'] });
                }
            });
            return;
        }

        // Validar antes de enviar
        if (data.legal_id && !validateLegalId(data.legal_id)) {
            return;
        }

        if (data.phone && !validatePhone(data.phone)) {
            return;
        }

        if (data.mobile && !validatePhone(data.mobile)) {
            return;
        }

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

        post(route('company.store'));
    };

    // Si ya tiene empresa, mostrar mensaje y no renderizar el formulario
    if (hasCompany) {
        return (
            <ImageLayout title="Registro de Empresa">
                <div className="max-w-2xl w-full mx-auto p-6 mt-10">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Ya tiene una empresa registrada. No puede crear otra empresa.
                                </p>
                                <div className="mt-4">
                                    <div className="flex">
                                        <a
                                            href={route('dashboard')}
                                            className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                                        >
                                            Volver al panel principal
                                            <span aria-hidden="true"> &rarr;</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ImageLayout>
        );
    }

    return (
        <ImageLayout title="Registro de Empresa">
            <div className="max-w-2xl w-full mx-auto p-6 mt-10">
                <h2 className="text-2xl font-semibold mb-4">Complete el registro de su empresa.</h2>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Nombre de la empresa */}
                        <div className="space-y-1">
                            <label htmlFor="name" className="block text-sm">
                                Nombre de la empresa<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={e => handleInputChange(e, 'name')}
                                className="w-full rounded-md border border-gray-300 p-2"
                                placeholder="Nombre de la empresa"
                                maxLength={100}
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Sitio web */}
                        <div className="space-y-1">
                            <label htmlFor="website" className="block text-sm">
                                Sitio web<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="website"
                                type="url"
                                value={data.website}
                                onChange={e => handleInputChange(e, 'website')}
                                className="w-full rounded-md border border-gray-300 p-2"
                                placeholder="https://www.ejemplo.com"
                                maxLength={100}
                            />
                            {/* <p className="text-xs text-gray-500 mt-1">
                                Debe incluir "https://" o "http://" al inicio de la dirección (ejemplo: https://www.miempresa.com)
                            </p> */}
                            <InputError message={errors.website} />
                        </div>

                        {/* Sector */}
                        <div className="space-y-1">
                            <label htmlFor="sector" className="block text-sm">
                                Sector<span className="text-red-500">*</span>
                            </label>
                            <select
                                id="sector"
                                value={data.sector}
                                onChange={e => setData('sector', e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2"
                            >
                                <option value="">Escoger sector</option>
                                <option value="agricola">Agrícola</option>
                                <option value="alimentos">Alimentos</option>
                                <option value="especializada">Industria Especializada</option>
                                <option value="servicios">Servicios</option>
                            </select>
                            <InputError message={errors.sector} />
                        </div>

                        {/* Provincia */}
                        <div className="space-y-1 relative">
                            <label htmlFor="provincia" className="block text-sm">
                                Provincia<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="provincia-search"
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => {
                                        // Limpiar el valor de entrada eliminando comillas, barras y barras invertidas
                                        const cleanedValue = e.target.value.replace(/['"\\\/]/g, '');
                                        setSearchTerm(cleanedValue);
                                        setShowDropdown(true);
                                    }}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    placeholder="Buscar provincia"
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    maxLength={100}
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
                            <InputError message={errors.provincia} />
                        </div>

                        {/* Cédula jurídica */}
                        <div className="space-y-1">
                            <label htmlFor="legal_id" className="block text-sm">
                                Cédula jurídica<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="legal_id"
                                type="text"
                                value={data.legal_id}
                                onChange={handleLegalIdChange}
                                className={`w-full rounded-md border border-gray-300 p-2 ${legalId ? 'bg-gray-100' : ''}`}
                                placeholder="#-###-######"
                                readOnly={!!legalId}
                                maxLength={100}
                            />
                            {legalId && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Cédula jurídica ingresada previamente.
                                </p>
                            )}
                            <InputError message={errors.legal_id || validationErrors.legal_id} />
                        </div>

                        {/* Actividad comercial */}
                        <div className="space-y-1">
                            <label htmlFor="commercial_activity" className="block text-sm">
                                Debe incluir la actividad principal de su negocio<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="commercial_activity"
                                value={data.commercial_activity}
                                onChange={e => handleInputChange(e, 'commercial_activity')}
                                className="w-full rounded-md border border-gray-300 p-2 resize-none"
                                placeholder="Actividad comercial"
                                maxLength={100}
                                rows={2}
                                style={{ resize: 'none' }}
                            />
                            <InputError message={errors.commercial_activity} />
                        </div>

                        {/* Teléfono fijo */}
                        <div className="space-y-1">
                            <label htmlFor="phone" className="block text-sm">
                                Teléfono fijo<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={e => handlePhoneChange(e, 'phone')}
                                className="w-full rounded-md border border-gray-300 p-2"
                                placeholder="2222-2222"
                                maxLength={100}
                            />
                            <InputError message={errors.phone || validationErrors.phone} />
                        </div>

                        {/* Teléfono celular */}
                        <div className="space-y-1">
                            <label htmlFor="mobile" className="block text-sm">
                                Teléfono celular<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="mobile"
                                type="tel"
                                value={data.mobile}
                                onChange={e => handlePhoneChange(e, 'mobile')}
                                className="w-full rounded-md border border-gray-300 p-2"
                                placeholder="2222-2222"
                                maxLength={100}
                            />
                            <InputError message={errors.mobile || validationErrors.mobile} />
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
                                    Para consultas <a
                                        href="mailto:licenciasmarcapais@procomer.com"
                                        className="text-green-600 hover:underline"
                                    >
                                        licenciasmarcapais@procomer.com
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !data.is_exporter}
                        className={`w-full py-2 px-4 rounded-md transition-colors ${!data.is_exporter
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-700 hover:bg-green-800 text-white'
                            }`}
                    >
                        Registrar Empresa
                    </button>

                    {/* <div className="text-sm text-center">
                        ¿Su empresa ya fue registrada?{" "}
                        <a href="" className="text-green-700 hover:underline">
                            Solicitar acceso
                        </a>
                    </div> */}
                </form>
            </div>
        </ImageLayout>
    );
}