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
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-gray-600">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
} 