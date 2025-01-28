export default function StepIndicator({ steps, currentStep, onStepClick }) {
    return (
        <nav 
            aria-label="Progress" 
            className="w-full overflow-x-auto scrollbar-custom"
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#16a34a #e5e7eb',
            }}
        >
            <ol role="list" className="flex items-center min-w-max md:min-w-0">
                {steps.map((step, index) => (
                    <li 
                        key={step.title} 
                        className={`
                            flex-1 relative
                            ${index !== steps.length - 1 ? 'flex items-center' : ''}
                        `}
                        onClick={() => onStepClick(index)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="flex items-center w-full">
                            {/* Círculo con número y texto */}
                            <div className="flex items-center flex-1">
                                <div className={`
                                    flex items-center justify-center
                                    min-w-[2.5rem] min-h-[2.5rem] 
                                    sm:min-w-[3rem] sm:min-h-[3rem]
                                    w-10 h-10 sm:w-12 sm:h-12
                                    rounded-full aspect-square shrink-0
                                    ${index <= currentStep ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'}
                                    font-semibold text-base sm:text-lg
                                    transition-colors duration-200
                                `}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                
                                {/* Texto del paso */}
                                <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                                    <p className={`
                                        font-medium text-sm sm:text-base truncate
                                        ${index <= currentStep ? 'text-green-700' : 'text-gray-600'}
                                    `}>
                                        {step.title}
                                    </p>
                                    {step.subtitle && (
                                        <p className="hidden sm:block text-xs sm:text-sm text-gray-500 truncate">
                                            {step.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Flecha separadora */}
                            {index < steps.length - 1 && (
                                <div className="flex items-center justify-center w-8 sm:w-12 shrink-0">
                                    <svg 
                                        className={`w-6 h-6 sm:w-8 sm:h-8 ${
                                            index < currentStep ? 'text-green-700' : 'text-gray-300'
                                        }`}
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
                    </li>
                ))}
            </ol>
        </nav>
    );
}