import { Head } from '@inertiajs/react';

export default function InstructionsLayout({ children, title }) {
    return (
        <div className="min-h-screen grid md:grid-cols-2">
            {/* Left side - Form */}
            <div className="p-8 flex flex-col items-center justify-center">
                <Head title={title} />

                <div className="mb-12">
                    <img
                        src="/assets/img/logo_esc.png"
                        alt="Costa Rica Logo"
                        className="h-10"
                    />
                </div>

                {children}
            </div>

            {/* Right side - Instructions */}
            <div className="bg-green-700 text-white p-8 flex items-center">
                <div className="max-w-md space-y-8">
                    <p className="text-lg">
                        Le invitamos a realizar una auto-evaluación para que conozca en cuál etapa del proceso de licenciamiento de uso corporativo estará su empresa.
                    </p>

                    <p>Estos son los pasos a seguir:</p>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0">
                                01
                            </div>
                            <p>Crear su cuenta.</p>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0">
                                02
                            </div>
                            <p>Una vez complete el registro le llegará al correo electrónico registrado, la activación de la cuenta.</p>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0">
                                03
                            </div>
                            <p>Una vez que tenga la cuenta activada, podrá iniciar el proceso de auto-evaluación.</p>
                        </div>
                    </div>

                    <p className="text-sm">
                        Para dudas o consultas nos pueden contactar al siguiente correo:{" "}
                        <a href="mailto:licenciasmarcapais@procomer.com" className="underline">
                            licenciasmarcapais@procomer.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
} 