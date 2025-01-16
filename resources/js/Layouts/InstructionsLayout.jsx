import { Head, usePage } from '@inertiajs/react';

export default function InstructionsLayout({ children, title }) {
    const { url } = usePage();
    const isLoginPage = url === '/login';

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen flex flex-col md:flex-row">
                {/* Logo */}
                <div className="p-4 md:p-0 md:absolute md:top-8 md:left-8">
                    <img
                        src="/assets/img/logo_esc.png"
                        alt="Costa Rica Logo"
                        className="h-8 md:h-10"
                    />
                </div>

                {/* Main content */}
                <div className="w-full md:w-7/12 flex items-center justify-center p-4 md:p-8">
                    {children}
                </div>

                {/* Mobile background image */}
                <div className="h-48 md:hidden">
                    <img 
                        src="/assets/img/bg_register.png" 
                        alt="Costa Rica Landscape" 
                        className="w-full h-full object-cover" 
                    />
                </div>

                {/* Desktop-only elements */}
                <div className='hidden md:flex md:w-1/12 items-center justify-center'>
                    <img src="/assets/img/bg_register.png" alt="Costa Rica Landscape" className="w-full h-full object-cover" />
                </div>

                <div className="bg-green-700 p-6 md:hidden">
                    <div className="max-w-lg mx-auto">
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

                <div className="hidden md:flex md:w-4/12 bg-green-700 items-center justify-center p-12">
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
