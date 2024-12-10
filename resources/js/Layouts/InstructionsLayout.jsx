import { Head, usePage } from '@inertiajs/react';

export default function InstructionsLayout({ children, title }) {
    const { url } = usePage();
    const isLoginPage = url === '/login';

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen flex">
                {/* Logo - static in mobile, absolute in desktop */}
                <div className="mb-8 md:mb-0 md:absolute md:top-8 md:left-8">
                        <img
                            src="/assets/img/logo_esc.png"
                            alt="Costa Rica Logo"
                            className="h-10"
                        />
                    </div>
                <div className="w-full md:w-2/3 flex items-center justify-center p-8">
                    {children}
                </div>

                <div className="hidden md:flex md:w-1/3 bg-green-700 items-center justify-center p-12">
                    <div className="max-w-lg">
                        {isLoginPage ? (
                            <>
                                <h2 className="text-2xl font-semibold text-white mb-6">
                                    Auto-evaluación
                                </h2>
                                <p className="text-white mb-6">
                                    Le invitamos a completar el proceso de auto-evaluación en el cual podrá conocer la etapa en la que se encuentra su empresa para iniciar el proceso de licenciamiento de uso corporativo de esencial COSTA RICA
                                </p>
                                <p className="text-white mb-6">
                                    Le recordamos que toda compañía que desee optar por el licenciamiento de la Marca País debe exportar sus productos y servicios
                                </p>
                                <p className="text-white mb-6">
                                    En caso de no contar con una cuenta, por favor proceda a crear una.
                                </p>
                                <p className="text-white">
                                    Para dudas o consultas enviar un correo electrónico a:{' '}
                                    <a
                                        href="mailto:licenciasmarcapais@procomer.com"
                                        className="underline hover:text-green-100"
                                    >
                                        licenciasmarcapais@procomer.com
                                    </a>
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-semibold text-white mb-6">
                                    Instrucciones:
                                </h2>
                                <p className="text-white mb-6">
                                    Para crear un usuario en la plataforma de auto-evaluación siga los siguientes pasos:
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center flex-shrink-0 text-white">
                                            01
                                        </div>
                                        <p className="text-white">Complete la información solicitada.</p>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center flex-shrink-0 text-white">
                                            02
                                        </div>
                                        <p className="text-white">Seleccione el botón crear usuario.</p>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center flex-shrink-0 text-white">
                                            03
                                        </div>
                                        <p className="text-white">Revise su correo electrónico y confirme la creación del usuario.</p>
                                    </div>
                                </div>
                                <p className="text-white mt-6">
                                    Para dudas o consultas enviar un correo electrónico a:{' '}
                                    <a
                                        href="mailto:licenciasmarcapais@procomer.com"
                                        className="underline hover:text-green-100"
                                    >
                                        licenciasmarcapais@procomer.com
                                    </a>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 
