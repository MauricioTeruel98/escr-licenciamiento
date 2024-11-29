import { useEffect } from 'react';
import { X } from 'lucide-react';

const ICONS = {
    success: (
        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    ),
    error: (
        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
    )
};

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className={`flex items-center gap-3 rounded-lg py-2.5 px-4 shadow-lg bg-white border-l-4 ${
                type === 'success' ? 'border-green-500' : 'border-red-500'
            }`}>
                <div className="flex-shrink-0">
                    {ICONS[type]}
                </div>
                <p className="text-sm font-medium text-gray-900">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}