import { Head } from '@inertiajs/react';

export default function ImageLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen grid md:grid-cols-3">
                {/* Left side - Form */}
                <div className="p-8 flex flex-col md:relative md:col-span-2">
                    <Head title={title} />

                    {/* Logo - static in mobile, absolute in desktop */}
                    <div className="mb-8 md:mb-0 md:absolute md:top-8 md:left-8">
                        <img
                            src="/assets/img/logo_esc.png"
                            alt="Costa Rica Logo"
                            className="h-10"
                        />
                    </div>

                    {/* Content */}
                    <div className="md:flex-1 md:flex md:items-center md:justify-center">
                        {children}
                    </div>
                </div>

                {/* Right side - Image */}
                <div className="hidden md:block md:col-span-1">
                    <img
                        src="/assets/img/bg_register.png"
                        alt="Costa Rica Landscape"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </>
    );
} 