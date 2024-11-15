import DashboardLayout from "@/Layouts/DashboardLayout";
import { useState, useRef, useEffect } from "react";

export default function Certifications({ userName }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState("");
    const dropdownRef = useRef(null);

    const certificaciones = [
        "INTE B5:2020",
        "INTE G12:2019",
        "INTE G8:2013",
        "INTE G38:2015",
        "INTE G8:2013"
    ];

    const filteredCerts = certificaciones.filter(cert =>
        cert.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };

    const handleSelectCert = (cert) => {
        setSelectedCert(cert);
        setSearchTerm(cert);
        setIsDropdownOpen(false);
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedCert("");
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <DashboardLayout userName={userName} title="Certificaciones">
            <div className="space-y-8">
                <h1 className="text-2xl font-bold">
                    Certificaciones
                </h1>
                <p className="text-gray-600">
                    Si su empresa cuenta con certificaciones previas, puede optar por homologarlas.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Add Certificate Form */}
                    <div className="cardcol-span-1">
                        <div className="card-body">
                            <h2 className="card-title">Agregar certificado</h2>
                            <div className="space-y-4">
                                <div className="relative" ref={dropdownRef}>
                                    <div className="flex items-center border rounded-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            onFocus={() => setIsDropdownOpen(true)}
                                            className="pl-10 pr-8 py-2 w-full border-none rounded-md shadow-sm border-gray-300 focus:border-green-500 focus:ring-green-500"
                                        />
                                        {searchTerm && (
                                            <button 
                                                onClick={handleClear}
                                                className="absolute right-2 p-1"
                                            >
                                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    {isDropdownOpen && filteredCerts.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                                            {filteredCerts.map((cert, index) => (
                                                <div
                                                    key={index}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSelectCert(cert)}
                                                >
                                                    {cert}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-sm font-medium">Fecha de obtención<span className="text-red-500">*</span></span>
                                    </label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-sm font-medium">Fecha de expiración<span className="text-red-500">*</span></span>
                                    </label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>

                                <button className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50">
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Added Certifications */}
                    <div className="col-span-2">
                        <h2 className="text-2xl font-bold">Certificaciones agregadas</h2>
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold mb-2">
                                    Agregue sus certificaciones previas.
                                </h2>
                                <p className="text-gray-600">
                                    Si su empresa cuenta con certificaciones previas, puede optar por homologarlas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}