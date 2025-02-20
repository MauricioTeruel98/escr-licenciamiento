import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-24 right-4 z-50 animate-slide-up shadow-md">
            <div className={`flex items-center gap-6 rounded-lg py-4 px-6 shadow-lg bg-white border-l-4 min-w-[400px] ${
                type === 'success' ? 'border-green-500' : 'border-red-500'
            }`}>
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-lg font-medium text-gray-900">
                    {message}
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