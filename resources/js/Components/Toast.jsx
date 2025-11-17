import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000, highlightPassword = false }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    // Función para resaltar la contraseña si corresponde
    const renderMessage = () => {
        if (highlightPassword && message.includes('Contraseña generada:')) {
            const [before, after] = message.split('Contraseña generada:');
            return (
                <>
                    {before}
                    Contraseña generada:
                    <strong className="font-bold"> {after.trim()}</strong>
                </>
            );
        }
        return message;
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-24 right-4 z-50 animate-slide-up shadow-md">
            <div className={`flex items-center gap-6 rounded-lg py-4 px-6 shadow-lg bg-white border-l-4 min-w-[400px] ${
                type === 'success' ? 'border-green-500' : 'border-red-500'
            }`}>
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-lg text-gray-900">
                    {renderMessage()}
                </p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
} 