import DashboardLayout from "@/Layouts/DashboardLayout";

export default function Certifications({ userName }) {
    return (
        <DashboardLayout userName={userName}>
            <div className="space-y-8">
                <h1 className="text-2xl font-bold">
                    Certificaciones
                </h1>
                <p className="text-gray-600">
                    Si su empresa cuenta con certificaciones previas, puede optar por homologarlas.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Add Certificate Form */}
                    <div className="card bg-white shadow col-span-1">
                        <div className="card-body">
                            <h2 className="card-title">Agregar certificado</h2>
                            <div className="space-y-4">
                                <div className="form-control">
                                    <input 
                                        type="text" 
                                        placeholder="Buscar" 
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Fecha de obtención<span className="text-red-500">*</span></span>
                                    </label>
                                    <input 
                                        type="date" 
                                        className="input input-bordered w-full" 
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Fecha de expiración<span className="text-red-500">*</span></span>
                                    </label>
                                    <input 
                                        type="date" 
                                        className="input input-bordered w-full" 
                                    />
                                </div>

                                <button className="btn btn-success bg-green-700 text-white w-full">
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Added Certifications */}
                    <div className="card bg-white shadow col-span-2">
                        <div className="card-body">
                            <h2 className="card-title">Certificaciones agregadas</h2>
                            
                            <div className="flex items-center justify-center min-h-[200px]">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Agregue sus certificaciones previas</h3>
                                        <p className="text-sm text-gray-600">
                                            Si su empresa cuenta con certificaciones previas, puede optar por homologarlas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}