import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import ImageLayout from '@/Layouts/ImageLayout';

export default function CompanyRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        website: '',
        sector: '',
        city: '',
        legal_id: '',
        commercial_activity: '',
        phone: '',
        mobile: '',
        is_exporter: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('company.store'), {
            onError: (errors) => {
                console.error('Errores:', errors);
            },
            onSuccess: () => {
                console.log('Empresa registrada exitosamente');
            },
        });
    };

    return (
        <ImageLayout>
            <div className="w-full mx-auto p-6">
                <h2 className="text-xl mb-6">Complete el registro de su empresa.</h2>

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
                                onChange={e => setData('name', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Nombre de la empresa"
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
                                onChange={e => setData('website', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="www.ejemplo.com"
                            />
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
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Escoger sector</option>
                                <option value="tecnologia">Tecnología</option>
                                <option value="agricultura">Agricultura</option>
                                <option value="turismo">Turismo</option>
                            </select>
                            <InputError message={errors.sector} />
                        </div>

                        {/* Ciudad */}
                        <div className="space-y-1">
                            <label htmlFor="city" className="block text-sm">
                                Ciudad<span className="text-red-500">*</span>
                            </label>
                            <select
                                id="city"
                                value={data.city}
                                onChange={e => setData('city', e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Escoger ciudad</option>
                                <option value="san-jose">San José</option>
                                <option value="alajuela">Alajuela</option>
                                <option value="cartago">Cartago</option>
                            </select>
                            <InputError message={errors.city} />
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
                                onChange={e => setData('legal_id', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="#-###-######"
                            />
                            <InputError message={errors.legal_id} />
                        </div>

                        {/* Actividad comercial */}
                        <div className="space-y-1">
                            <label htmlFor="commercial_activity" className="block text-sm">
                                Actividad comercial<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="commercial_activity"
                                type="text"
                                value={data.commercial_activity}
                                onChange={e => setData('commercial_activity', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Actividad comercial"
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
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="2222-2222"
                            />
                            <InputError message={errors.phone} />
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
                                onChange={e => setData('mobile', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="2222-2222"
                            />
                            <InputError message={errors.mobile} />
                        </div>
                    </div>

                    {/* ¿Es una empresa exportadora? */}
                    <div className="mt-4">
                        <p className="text-sm mb-2">¿Es una empresa exportadora?<span className="text-red-500">*</span></p>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="is_exporter"
                                    checked={data.is_exporter === true}
                                    onChange={() => setData('is_exporter', true)}
                                    className="mr-2"
                                />
                                <span className="text-sm">Sí</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="is_exporter"
                                    checked={data.is_exporter === false}
                                    onChange={() => setData('is_exporter', false)}
                                    className="mr-2"
                                />
                                <span className="text-sm">No</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors"
                    >
                        Registrar Empresa
                    </button>

                    <div className="text-sm text-center">
                        ¿Su empresa ya fue registrada?{" "}
                        <a href="" className="text-green-700 hover:underline">
                            Solicitar acceso
                        </a>
                    </div>
                </form>
            </div>
        </ImageLayout>
    );
}