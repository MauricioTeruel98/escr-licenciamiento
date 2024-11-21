import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { ChevronUp } from 'lucide-react';
import StepIndicator from '@/Components/StepIndicator';
import IndicatorIndex from '@/Components/IndicatorIndex';

export default function Indicadores({ userName }) {
    const [openSections, setOpenSections] = useState({
        planificacion: true,
        derechos: false,
        modelo: false
    });

    const steps = [
        {
            title: "Estrategia",
            subtitle: "Empresarial"
        },
        {
            title: "Cultura",
            subtitle: "organizacional"
        },
        {
            title: "Experiencia del",
            subtitle: "cliente y calidad"
        },
        {
            title: "Proceso y cadena",
            subtitle: "de suministro"
        }
    ];

    return (
        <DashboardLayout userName={userName} title="Indicadores">
            <div className="space-y-8">
                <div className="lg:flex justify-between items-center gap-8">
                    <div className="lg:w-1/2">
                        <div className="flex items-center mt-5">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-blue-600/20 flex items-center gap-2">
                                9 Indicadores homologados.
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold mt-3">Excelencia</h1>
                        <p className="text-gray-500 mt-2">
                            Para todos los valores, debe responder cada una de las preguntas de los indicadores.
                        </p>
                    </div>
                    <div className="lg:w-1/2 mt-5 lg:mt-0">
                        <div>
                            <div className="flex">
                                <div className="w-1/2 rounded-l-xl bg-yellow-100/50 px-6 p-4">
                                    <h2 className="text-lg text-yellow-700 font-semibold mb-2">Nota</h2>
                                    <p className="text-2xl text-yellow-500 font-bold">0/100</p>
                                </div>
                                <div className="w-1/2 rounded-e-xl bg-green-800 px-6 p-4">
                                    <h2 className="text-lg text-green-200 font-semibold mb-2">Nota minima</h2>
                                    <p className="text-2xl text-green-200 font-bold">85</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mt-5">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check text-green-700"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                    </div>
                                    <span className='text-green-700'>4 indicadores contestados</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bg-white shadow rounded-xl p-8'>
                    <div>
                        <StepIndicator steps={steps} />
                    </div>
                    <div className='mt-16'>
                        <h2 className='text-gray-500 font-semibold'>Planificación Estrategica</h2>
                        
                        <div className="mt-10">
                            <IndicatorIndex
                                code="E1"
                                question="¿Cuenta la organización con propósito, misión, visión y valores establecidos, se han documentado, se realizan revisiones periódicas y se han comunicado y compartido con toda la organización?"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}