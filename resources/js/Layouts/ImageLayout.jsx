import { Head } from '@inertiajs/react';

export default function ImageLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen flex flex-col md:flex-row">
                {/* Left side - Form */}
                <div className="w-full md:w-7/12 p-4 md:p-8 flex flex-col md:relative">
                    <Head title={title} />

                    {/* Logo - static in mobile, absolute in desktop */}
                    <div className="mb-6 md:mb-0 md:absolute md:top-8 md:left-8">
                        <img
                            src="/assets/img/logo_esc.png"
                            alt="Costa Rica Logo"
                            className="h-8 md:h-10"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex items-center justify-center">
                        {children}
                    </div>

                    {/* Términos y condiciones link */}
                    <div className="text-center mt-4">
                        <a
                            href="/assets/pdfs/Consentimiento informado.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:text-green-800 underline text-sm"
                        >
                            Ver términos y condiciones
                        </a>
                    </div>
                </div>

                {/* Mobile image */}
                <div className="md:hidden w-full h-48 relative">
                    <img
                        src="/assets/img/cafe.png"
                        alt="Costa Rica Landscape"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Green bar - visible in both mobile and desktop */}
                <div className="w-full h-2 md:h-auto md:w-1/12 bg-green-700">
                </div>

                {/* Right side - Image (desktop only) */}
                <div className="hidden md:flex md:w-4/12 items-center justify-center">
                    <img
                        src="/assets/img/cafe.png"
                        alt="Costa Rica Landscape"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
            </div>
        </>
    );
} 