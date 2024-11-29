import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

export default function CertificationModal({ isOpen, onClose, onSubmit, certification = null }) {
    const initialFormData = {
        nombre: '',
        fecha_obtencion: null,
        fecha_expiracion: null,
        indicadores: 0,
        company_id: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [companies, setCompanies] = useState([]);
    const [errors, setErrors] = useState({});
    const [fechaError, setFechaError] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchCompanies();
            if (certification) {
                setFormData({
                    nombre: certification.nombre,
                    fecha_obtencion: new Date(certification.fecha_obtencion),
                    fecha_expiracion: new Date(certification.fecha_expiracion),
                    indicadores: certification.indicadores,
                    company_id: certification.company_id
                });
            } else {
                setFormData(initialFormData);
            }
            setErrors({});
            setFechaError("");
        }
    }, [isOpen, certification]);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/companies/active');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error al cargar empresas:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const validarFechaExpiracion = (fecha) => {
        if (formData.fecha_obtencion && fecha) {
            if (fecha <= formData.fecha_obtencion) {
                setFechaError("La fecha de expiración debe ser posterior a la fecha de obtención");
                return false;
            }
        }
        setFechaError("");
        return true;
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="absolute right-0 top-0 pr-4 pt-4">
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    {certification ? 'Editar Certificación' : 'Nueva Certificación'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de Obtención <span className="text-red-500">*</span>
                                        </label>
                                        <DatePicker
                                            selected={formData.fecha_obtencion}
                                            onChange={(date) => setFormData({...formData, fecha_obtencion: date})}
                                            locale={es}
                                            dateFormat="dd/MM/yyyy"
                                            className="w-full px-3 py-2 border rounded-md border-gray-300"
                                            required
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            yearDropdownItemNumber={10}
                                            scrollableYearDropdown
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-1 ${fechaError ? 'text-red-600' : ''}`}>
                                            Fecha de Expiración <span className="text-red-500">*</span>
                                        </label>
                                        <DatePicker
                                            selected={formData.fecha_expiracion}
                                            onChange={(date) => {
                                                setFormData({...formData, fecha_expiracion: date});
                                                validarFechaExpiracion(date);
                                            }}
                                            locale={es}
                                            dateFormat="dd/MM/yyyy"
                                            className={`w-full px-3 py-2 border rounded-md ${
                                                fechaError 
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                            }`}
                                            required
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            yearDropdownItemNumber={10}
                                            scrollableYearDropdown
                                        />
                                        {fechaError && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {fechaError}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Indicadores <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.indicadores}
                                            onChange={(e) => setFormData({...formData, indicadores: parseInt(e.target.value)})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Empresa <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.company_id}
                                            onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Seleccione una empresa</option>
                                            {companies.map((company) => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                >
                                    {certification ? 'Actualizar' : 'Crear'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
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