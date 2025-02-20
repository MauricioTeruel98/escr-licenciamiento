import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function CompanyInfoModal({ isOpen, onClose, company }) {
    const [infoAdicional, setInfoAdicional] = useState(null);

    useEffect(() => {
        if (company) {
            // Simular la carga de información adicional
            setInfoAdicional(company.info_adicional || {});
        }
    }, [company]);

    if (!isOpen || !company) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                                Información de la Empresa
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <strong>Cédula:</strong> {company.legal_id}
                                </div>
                                <div>
                                    <strong>Nombre:</strong> {company.name}
                                </div>
                                <div>
                                    <strong>Sitio Web:</strong> {company.website}
                                </div>
                                <div>
                                    <strong>Sector:</strong> {company.sector}
                                </div>
                                <div>
                                    <strong>Ciudad:</strong> {company.city}
                                </div>
                                <div>
                                    <strong>Actividad Comercial:</strong> {company.commercial_activity}
                                </div>
                                <div>
                                    <strong>Teléfono:</strong> {company.phone}
                                </div>
                                <div>
                                    <strong>Móvil:</strong> {company.mobile}
                                </div>
                                <div>
                                    <strong>Es Exportador:</strong> {company.is_exporter ? 'Sí' : 'No'}
                                </div>
                                {infoAdicional && (
                                    <div>
                                        <strong>Información Adicional:</strong> {JSON.stringify(infoAdicional)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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