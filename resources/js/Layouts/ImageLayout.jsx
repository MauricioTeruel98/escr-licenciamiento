import { Head } from '@inertiajs/react';

export default function ImageLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen grid md:grid-cols-3">
                {/* Left side - Form */}
            <div className="p-8 flex flex-col items-center justify-center md:col-span-2">
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