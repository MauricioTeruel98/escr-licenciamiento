import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

export default function CompanyInfoModal({ isOpen, onClose, companyId }) {
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [infoAdicional, setInfoAdicional] = useState(null);

    useEffect(() => {
        if (isOpen && companyId) {
            fetchCompanyDetails();
        }
    }, [isOpen, companyId]);

    const fetchCompanyDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/companies/${companyId}/detail`);
            setCompany(response.data.company);
            setInfoAdicional(response.data.info_adicional);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar los detalles de la empresa:', error);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl">
                        <div className="absolute right-0 top-0 pr-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                                Información de la Empresa
                            </h3>
                            
                            {loading ? (
                                <div className="flex justify-center items-center py-10">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
                                </div>
                            ) : company ? (
                                <div className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
                                    {/* Información básica */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium text-gray-900 mb-3">Datos Básicos</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Cédula Jurídica</p>
                                                <p className="mt-1">{company.legal_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Nombre Comercial</p>
                                                <p className="mt-1">{company.name}</p>
                                            </div>
                                            {infoAdicional?.nombre_legal && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Razón Social</p>
                                                    <p className="mt-1">{infoAdicional.nombre_legal}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Sitio Web</p>
                                                <p className="mt-1">
                                                    {company.website ? (
                                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                                            {company.website}
                                                        </a>
                                                    ) : 'No especificado'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Sector</p>
                                                <p className="mt-1 capitalize">{company.sector}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Actividad Comercial</p>
                                                <p className="mt-1">{company.commercial_activity}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Exportador</p>
                                                <p className="mt-1">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        company.is_exporter 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {company.is_exporter ? 'Sí' : 'No'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información de contacto */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium text-gray-900 mb-3">Contacto Principal</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Teléfono Principal</p>
                                                <p className="mt-1">{company.phone || infoAdicional?.telefono_1 || 'No especificado'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Teléfono Secundario</p>
                                                <p className="mt-1">{company.mobile || infoAdicional?.telefono_2 || 'No especificado'}</p>
                                            </div>
                                            
                                            {/* Ubicación */}
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Provincia</p>
                                                <p className="mt-1">{company.provincia || 'No especificada'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Cantón</p>
                                                <p className="mt-1">{company.canton || 'No especificado'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Distrito</p>
                                                <p className="mt-1">{company.distrito || 'No especificado'}</p>
                                            </div>
                                            {infoAdicional?.direccion_empresa && (
                                                <div className="md:col-span-2">
                                                    <p className="text-sm font-medium text-gray-500">Dirección Completa</p>
                                                    <p className="mt-1">{infoAdicional.direccion_empresa}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Información de contactos específicos */}
                                    {infoAdicional && (
                                        <>
                                            {/* Representante Legal */}
                                            {(infoAdicional.representante_nombre || infoAdicional.representante_email || 
                                             infoAdicional.representante_puesto || infoAdicional.representante_telefono || 
                                             infoAdicional.representante_celular || infoAdicional.representante_cedula) && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-lg font-medium text-gray-900 mb-3">Representante Legal</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {infoAdicional.representante_nombre && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Nombre</p>
                                                                <p className="mt-1">{infoAdicional.representante_nombre}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.representante_puesto && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Puesto</p>
                                                                <p className="mt-1">{infoAdicional.representante_puesto}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.representante_cedula && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Cédula</p>
                                                                <p className="mt-1">{infoAdicional.representante_cedula}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.representante_email && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                                <p className="mt-1">
                                                                    <a href={`mailto:${infoAdicional.representante_email}`} className="text-green-600 hover:underline">
                                                                        {infoAdicional.representante_email}
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.representante_telefono && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                                                                <p className="mt-1">{infoAdicional.representante_telefono}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.representante_celular && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Celular</p>
                                                                <p className="mt-1">{infoAdicional.representante_celular}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Contacto de Notificación */}
                                            {(infoAdicional.contacto_notificacion_nombre || infoAdicional.contacto_notificacion_email || 
                                             infoAdicional.contacto_notificacion_puesto || infoAdicional.contacto_notificacion_telefono || 
                                             infoAdicional.contacto_notificacion_celular) && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-lg font-medium text-gray-900 mb-3">Contacto para Notificaciones</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {infoAdicional.contacto_notificacion_nombre && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Nombre</p>
                                                                <p className="mt-1">{infoAdicional.contacto_notificacion_nombre}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.contacto_notificacion_puesto && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Puesto</p>
                                                                <p className="mt-1">{infoAdicional.contacto_notificacion_puesto}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.contacto_notificacion_email && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                                <p className="mt-1">
                                                                    <a href={`mailto:${infoAdicional.contacto_notificacion_email}`} className="text-green-600 hover:underline">
                                                                        {infoAdicional.contacto_notificacion_email}
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.contacto_notificacion_telefono && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                                                                <p className="mt-1">{infoAdicional.contacto_notificacion_telefono}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.contacto_notificacion_celular && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Celular</p>
                                                                <p className="mt-1">{infoAdicional.contacto_notificacion_celular}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Contacto de Proceso */}
                                            {(infoAdicional.asignado_proceso_nombre || infoAdicional.asignado_proceso_email || 
                                             infoAdicional.asignado_proceso_puesto || infoAdicional.asignado_proceso_telefono || 
                                             infoAdicional.asignado_proceso_celular) && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-lg font-medium text-gray-900 mb-3">Contacto para Proceso</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {infoAdicional.asignado_proceso_nombre && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Nombre</p>
                                                                <p className="mt-1">{infoAdicional.asignado_proceso_nombre}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.asignado_proceso_puesto && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Puesto</p>
                                                                <p className="mt-1">{infoAdicional.asignado_proceso_puesto}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.asignado_proceso_email && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                                <p className="mt-1">
                                                                    <a href={`mailto:${infoAdicional.asignado_proceso_email}`} className="text-green-600 hover:underline">
                                                                        {infoAdicional.asignado_proceso_email}
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.asignado_proceso_telefono && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                                                                <p className="mt-1">{infoAdicional.asignado_proceso_telefono}</p>
                                                            </div>
                                                        )}
                                                        {infoAdicional.asignado_proceso_celular && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Celular</p>
                                                                <p className="mt-1">{infoAdicional.asignado_proceso_celular}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Datos de Exportación */}
                                            {(company.is_exporter || infoAdicional.rango_exportaciones || 
                                             infoAdicional.paises_exportacion || infoAdicional.planes_expansion) && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-lg font-medium text-gray-900 mb-3">Información de Exportación</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Empresa Exportadora</p>
                                                            <p className="mt-1">
                                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                    company.is_exporter 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {company.is_exporter ? 'Sí' : 'No'}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        
                                                        {infoAdicional.rango_exportaciones && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Rango de Exportaciones</p>
                                                                <p className="mt-1">{infoAdicional.rango_exportaciones}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {infoAdicional.paises_exportacion && (
                                                            <div className="md:col-span-2">
                                                                <p className="text-sm font-medium text-gray-500">Países de Exportación</p>
                                                                <p className="mt-1">{infoAdicional.paises_exportacion}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {infoAdicional.planes_expansion && (
                                                            <div className="md:col-span-2">
                                                                <p className="text-sm font-medium text-gray-500">Planes de Expansión</p>
                                                                <p className="mt-1 whitespace-pre-line">{infoAdicional.planes_expansion}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Información detallada */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="text-lg font-medium text-gray-900 mb-3">Información Detallada</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Año de Fundación</p>
                                                        <p className="mt-1">{infoAdicional.anio_fundacion || 'No especificado'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Tamaño de Empresa</p>
                                                        <p className="mt-1">{infoAdicional.tamano_empresa || 'No especificado'}</p>
                                                    </div>
                                                    
                                                    {/* Estadísticas de empleados */}
                                                    <div className="col-span-2">
                                                        <p className="text-sm font-medium text-gray-500">Cantidad de Empleados</p>
                                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                                            <div className="bg-white rounded p-2 text-center shadow-sm">
                                                                <p className="text-sm text-gray-500">Hombres</p>
                                                                <p className="font-medium">{infoAdicional.cantidad_hombres || '0'}</p>
                                                            </div>
                                                            <div className="bg-white rounded p-2 text-center shadow-sm">
                                                                <p className="text-sm text-gray-500">Mujeres</p>
                                                                <p className="font-medium">{infoAdicional.cantidad_mujeres || '0'}</p>
                                                            </div>
                                                            <div className="bg-white rounded p-2 text-center shadow-sm">
                                                                <p className="text-sm text-gray-500">Otros</p>
                                                                <p className="font-medium">{infoAdicional.cantidad_otros || '0'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Descripción */}
                                                    <div className="col-span-2">
                                                        <p className="text-sm font-medium text-gray-500">Descripción (Español)</p>
                                                        <p className="mt-1 whitespace-pre-line">{infoAdicional.descripcion_es || 'No especificada'}</p>
                                                    </div>
                                                    
                                                    <div className="col-span-2">
                                                        <p className="text-sm font-medium text-gray-500">Descripción (Inglés)</p>
                                                        <p className="mt-1 whitespace-pre-line">{infoAdicional.descripcion_en || 'No especificada'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Redes sociales */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="text-lg font-medium text-gray-900 mb-3">Redes Sociales</h4>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {infoAdicional.facebook && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Facebook</p>
                                                            <a href={infoAdicional.facebook} target="_blank" rel="noopener noreferrer" className="mt-1 text-green-600 hover:underline block truncate">
                                                                {infoAdicional.facebook}
                                                            </a>
                                                        </div>
                                                    )}
                                                    
                                                    {infoAdicional.linkedin && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                                                            <a href={infoAdicional.linkedin} target="_blank" rel="noopener noreferrer" className="mt-1 text-green-600 hover:underline block truncate">
                                                                {infoAdicional.linkedin}
                                                            </a>
                                                        </div>
                                                    )}
                                                    
                                                    {infoAdicional.instagram && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Instagram</p>
                                                            <a href={infoAdicional.instagram} target="_blank" rel="noopener noreferrer" className="mt-1 text-green-600 hover:underline block truncate">
                                                                {infoAdicional.instagram}
                                                            </a>
                                                        </div>
                                                    )}
                                                    
                                                    {infoAdicional.otra_red_social && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Otra Red Social</p>
                                                            <a href={infoAdicional.otra_red_social} target="_blank" rel="noopener noreferrer" className="mt-1 text-green-600 hover:underline block truncate">
                                                                {infoAdicional.otra_red_social}
                                                            </a>
                                                        </div>
                                                    )}
                                                    
                                                    {!infoAdicional.facebook && !infoAdicional.linkedin && !infoAdicional.instagram && !infoAdicional.otra_red_social && (
                                                        <p className="text-gray-500 italic">No hay redes sociales especificadas</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Datos de licenciamiento */}
                                            {(infoAdicional.razon_licenciamiento_es || infoAdicional.razon_licenciamiento_en || 
                                              infoAdicional.proceso_licenciamiento || infoAdicional.recomienda_marca_pais) && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-lg font-medium text-gray-900 mb-3">Licenciamiento</h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {infoAdicional.razon_licenciamiento_es && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Razón de Licenciamiento (Español)</p>
                                                                <p className="mt-1 whitespace-pre-line">{infoAdicional.razon_licenciamiento_es}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {infoAdicional.razon_licenciamiento_en && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Razón de Licenciamiento (Inglés)</p>
                                                                <p className="mt-1 whitespace-pre-line">{infoAdicional.razon_licenciamiento_en}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {infoAdicional.proceso_licenciamiento && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Proceso de Licenciamiento</p>
                                                                <p className="mt-1 whitespace-pre-line">{infoAdicional.proceso_licenciamiento}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {infoAdicional.recomienda_marca_pais !== undefined && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Recomienda Marca País</p>
                                                                <p className="mt-1">
                                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                        infoAdicional.recomienda_marca_pais 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {infoAdicional.recomienda_marca_pais ? 'Sí' : 'No'}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="py-10 text-center text-gray-500">
                                    No se encontró información para esta empresa
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 