export default function Switch({ checked, onChange, label }) {
    return (
        <div className="flex items-center">
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    ${checked ? 'bg-green-600' : 'bg-gray-200'}
                `}
                role="switch"
                aria-checked={checked}
            >
                <span
                    className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                        transition duration-200 ease-in-out
                        ${checked ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
            {label && (
                <span className="ml-3 text-sm font-medium text-gray-700">
                    {label}
                </span>
            )}
        </div>
    );
} 