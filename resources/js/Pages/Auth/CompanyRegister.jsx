import { useState } from "react"
import { ChevronDown } from "lucide-react"
import ImageLayout from '@/Layouts/ImageLayout';

export default function CompanyRegister() {
    const [isExporter, setIsExporter] = useState(null)

    return (
        <ImageLayout title="Registro de Empresa">
            <div className="max-w-2xl w-full">
                <h2 className="text-gray-600 mb-8">Complete el registro de su empresa.</h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="company-name" className="block text-sm">
                            Nombre de la empresa
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="company-name"
                            type="text"
                            required
                            className="w-full p-2 border rounded-md"
                            placeholder="Nombre de la empresa"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="website" className="block text-sm">
                            Sitio web
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="website"
                            type="url"
                            required
                            className="w-full p-2 border rounded-md"
                            placeholder="www.ejemplo.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="sector" className="block text-sm">
                            Sector
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="sector"
                                required
                                className="w-full p-2 border rounded-md appearance-none pr-10"
                                defaultValue=""
                            >
                                <option value="" disabled>Escoger sector</option>
                                <option value="tecnologia">Tecnología</option>
                                <option value="agricultura">Agricultura</option>
                                <option value="turismo">Turismo</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="city" className="block text-sm">
                            Ciudad
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="city"
                                required
                                className="w-full p-2 border rounded-md appearance-none pr-10"
                                defaultValue=""
                            >
                                <option value="" disabled>Escoger ciudad</option>
                                <option value="san-jose">San José</option>
                                <option value="alajuela">Alajuela</option>
                                <option value="cartago">Cartago</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="legal-id" className="block text-sm">
                            Cédula jurídica
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="legal-id"
                            type="text"
                            required
                            className="w-full p-2 border rounded-md"
                            placeholder="#-###-######"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="commercial-activity" className="block text-sm">
                            Actividad comercial
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="commercial-activity"
                            type="text"
                            required
                            className="w-full p-2 border rounded-md"
                            placeholder="Actividad comercial"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm">
                            Teléfono fijo
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            required
                            className="w-full p-2 border rounded-md"
                            placeholder="2222-2222"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="mobile" className="block text-sm">
                            Teléfono célular
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="mobile"
                            type="tel"
                            required
                            className="w-full p-2 border rounded-md"
                            placeholder="2222-2222"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm">
                            ¿Es una empresa exportadora?
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="exporter"
                                    value="yes"
                                    onChange={() => setIsExporter(true)}
                                    className="w-4 h-4 text-green-700"
                                />
                                Sí
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="exporter"
                                    value="no"
                                    onChange={() => setIsExporter(false)}
                                    className="w-4 h-4 text-green-700"
                                />
                                No
                            </label>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <button
                            type="submit"
                            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors"
                        >
                            Registrar Empresa
                        </button>

                        <p className="text-sm text-center">
                            ¿Su empresa ya fue registrada?{" "}
                            <a href="#" className="text-green-700 hover:underline">
                                Solicitar acceso
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </ImageLayout>
    )
}