export default function StepIndicator({ steps }) {
    return (
        <div className="flex items-center justify-between w-full mx-auto">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                    {/* Círculo con número */}
                    <div className="flex items-center">
                        <div className={`
                            flex items-center justify-center
                            w-12 h-12 rounded-full 
                            ${index === 0 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'}
                            font-semibold text-lg
                        `}>
                            {String(index + 1).padStart(2, '0')}
                        </div>
                        
                        {/* Texto del paso */}
                        <div className="ml-3">
                            <p className={`
                                font-medium
                                ${index === 0 ? 'text-green-700' : 'text-gray-600'}
                            `}>
                                {step.title}
                            </p>
                            {step.subtitle && (
                                <p className="text-sm text-gray-500">
                                    {step.subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Flecha separadora */}
                    {index < steps.length - 1 && (
                        <div className="flex-grow mx-4">
                            <svg 
                                className="w-8 h-8 text-gray-300" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}