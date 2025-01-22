import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

export default function UserModal({ isOpen, onClose, onSubmit, user = null }) {
    const initialFormData = {
        name: '',
        lastname: '',
        email: '',
        role: 'user',
        company_id: '',
        status: 'pending',
        password: '',
        password_confirmation: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [companies, setCompanies] = useState([]);
    const [errors, setErrors] = useState({});
    const [assignedCompanies, setAssignedCompanies] = useState([]);

    const roles = [
        { id: 'user', name: 'Usuario' },
        { id: 'admin', name: 'Administrador' },
        { id: 'evaluador', name: 'Evaluador' }
    ];

    useEffect(() => {
        if (isOpen) {
            if (user) {
                const assignedCompanyIds = user.evaluated_companies 
                    ? user.evaluated_companies.map(company => company.id.toString())
                    : [];

                setFormData({
                    name: user.name,
                    lastname: user.lastname || '',
                    email: user.email,
                    role: user.role,
                    company_id: user.company_id || '',
                    status: user.status,
                    password: '',
                    password_confirmation: ''
                });
                setAssignedCompanies(assignedCompanyIds);
            } else {
                setFormData(initialFormData);
                setAssignedCompanies([]);
            }
            fetchCompanies();
        }
    }, [isOpen, user]);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/companies/active');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error al cargar compañías:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Validaciones básicas
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.lastname.trim()) newErrors.lastname = 'El apellido es requerido';
        if (!formData.email.trim()) newErrors.email = 'El email es requerido';
        if (!formData.company_id) newErrors.company_id = 'La empresa es requerida';
        
        // Validar contraseña solo en creación o si se está intentando cambiar
        if (!user || formData.password) {
            if (formData.password.length < 8) {
                newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            }
            if (formData.password !== formData.password_confirmation) {
                newErrors.password_confirmation = 'Las contraseñas no coinciden';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const submitData = {
            ...formData,
            assigned_companies: formData.role === 'evaluador' ? assignedCompanies : []
        };
        onSubmit(submitData);
    };

    const handleClose = () => {
        setFormData(initialFormData);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {user ? 'Editar usuario' : 'Crear nuevo usuario'}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="bg-white px-6 py-4 space-y-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                                            errors.name ? 'border-red-300' : ''
                                        }`}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Apellido */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                                            errors.lastname ? 'border-red-300' : ''
                                        }`}
                                        required
                                    />
                                    {errors.lastname && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                                            errors.email ? 'border-red-300' : ''
                                        }`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Rol */}
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Rol
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Seleccionar rol</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Empresa */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Empresa
                                    </label>
                                    <select
                                        value={formData.company_id}
                                        onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                                            errors.company_id ? 'border-red-300' : ''
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccione una empresa</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.company_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.company_id}</p>
                                    )}
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                    >
                                        <option value="pending">Pendiente</option>
                                        <option value="approved">Aprobado</option>
                                        <option value="rejected">Rechazado</option>
                                    </select>
                                </div>

                                {/* Contraseña */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña {user && '(dejar en blanco para mantener la actual)'}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                                            errors.password ? 'border-red-300' : ''
                                        }`}
                                        {...(!user && { required: true })}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirmar Contraseña */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                                            errors.password_confirmation ? 'border-red-300' : ''
                                        }`}
                                        {...(!user && { required: true })}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Empresas asignadas */}
                                {formData.role === 'evaluador' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Empresas asignadas para evaluar
                                        </label>
                                        <div className="mt-2 space-y-2">
                                            {companies.map((company) => (
                                                <div key={company.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`company-${company.id}`}
                                                        value={company.id}
                                                        checked={assignedCompanies.includes(company.id.toString())}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setAssignedCompanies(prev =>
                                                                e.target.checked
                                                                    ? [...prev, value]
                                                                    : prev.filter(id => id !== value)
                                                            );
                                                        }}
                                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                    />
                                                    <label
                                                        htmlFor={`company-${company.id}`}
                                                        className="ml-2 block text-sm text-gray-900"
                                                    >
                                                        {company.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {assignedCompanies.length === 0 && (
                                            <p className="mt-1 text-sm text-red-600">
                                                Debe seleccionar al menos una empresa para evaluar
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    {user ? 'Guardar cambios' : 'Crear usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 