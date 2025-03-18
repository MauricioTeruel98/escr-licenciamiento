import React, { useEffect } from 'react';

export default function IndicatorIndex({ code, question, onAnswer, value, isBinding, homologation, guide, autoeval_ended, availableToModifyAutoeval, isBinary, justification = '', onJustificationChange, isExporter = true, wasHomologated = false, autoEvalCompleted, isHomologated = false }) {
    const handleChange = (e) => {
        const selectedValue = e.target.value;
        onAnswer(selectedValue);
    };

    const handleJustificationChange = (e) => {
        const text = e.target.value;
        if (onJustificationChange) {
            onJustificationChange(text);
        }
    };

    // Convertimos el value a string para la comparación, asegurando que no sea null o undefined
    const stringValue = value !== null && value !== undefined ? String(value) : '';
    
    // Si está homologado, deshabilitar los inputs y mostrar como respondido
    const isHomologatedFromCert = !!homologation;

    // Si está homologado (ya sea por prop o por certificación), forzar el valor a "1" (Sí)
    const effectiveValue = isHomologated || isHomologatedFromCert ? "1" : stringValue;

    // Verificar si el usuario ha respondido "Sí" (para habilitar el campo de justificación)
    const wantsToAnswer = effectiveValue === "1";

    // Determinar si los inputs deben estar deshabilitados
    const isDisabled = isHomologated || isHomologatedFromCert || !availableToModifyAutoeval || autoEvalCompleted;

    // Crear texto de justificación para homologación si es necesario
    useEffect(() => {
        // Solo aplicar para indicadores homologados que no son binarios y no tienen justificación
        if ((isHomologated || isHomologatedFromCert) && !isBinary && wantsToAnswer && !justification) {
            const homologationText = `Homologada por certificación ${homologation || 'verificada'}`;
            
            // Usar setTimeout para evitar problemas de renderizado
            setTimeout(() => {
                if (onJustificationChange) {
                    onJustificationChange(homologationText);
                }
            }, 0);
        }
    }, [isHomologated, isHomologatedFromCert, isBinary, wantsToAnswer, justification, homologation, onJustificationChange]);

    // Asegurar que si está homologado, se envíe el valor "1" al componente padre
    // Esto garantiza que el cálculo de puntaje considere los indicadores homologados como "Sí"
    if ((isHomologated || isHomologatedFromCert) && stringValue !== "1" && !autoEvalCompleted) {
        // Solo llamar a onAnswer si el valor actual no es "1" y la autoevaluación no está completa
        setTimeout(() => onAnswer("1"), 0);
    }

    // Determinar si los radios deben estar marcados
    // Asegurarse de que los valores sean strings para la comparación
    const showYesChecked = isHomologated || isHomologatedFromCert || effectiveValue === "1";
    const showNoChecked = !isHomologated && !isHomologatedFromCert && effectiveValue === "0";

    // Mostrar información de depuración en la consola
    // console.log(`Indicador ${code}: value=${value}, stringValue=${stringValue}, effectiveValue=${effectiveValue}, showYesChecked=${showYesChecked}, showNoChecked=${showNoChecked}`);

    return (
        <div className={`bg-white rounded-lg space-y-4 ${isHomologated || isHomologatedFromCert ? 'bg-blue-50/50 ring-1 ring-blue-100 p-3' : wasHomologated ? 'bg-yellow-50/50 ring-1 ring-yellow-100 p-3' : ''}`}>
            {/* Cabecera del indicador */}
            <div className="space-y-2">
                <div className="inline-block">
                    <div className="flex items-center gap-2">
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-green-600/20 flex items-center gap-2">
                            INDICADOR {code}
                        </span>
                        {isBinding && (
                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 ml-2">
                                Descalificatório
                            </span>
                        )}
                        {homologation && (
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10 ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                     className="h-4 w-4 mr-1" 
                                     viewBox="0 0 24 24" 
                                     fill="none" 
                                     stroke="currentColor" 
                                     strokeWidth="2" 
                                     strokeLinecap="round" 
                                     strokeLinejoin="round">
                                    <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.625M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19" />
                                </svg>
                                Homologado por {homologation}
                            </span>
                        )}
                        {wasHomologated && !homologation && (
                            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/10 ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                     className="h-4 w-4 mr-1" 
                                     viewBox="0 0 24 24" 
                                     fill="none" 
                                     stroke="currentColor" 
                                     strokeWidth="2" 
                                     strokeLinecap="round" 
                                     strokeLinejoin="round">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Certificación vencida - Ya no está homologado
                            </span>
                        )}
                        
                    </div>
                </div>
                <h3 className="text-gray-900 font-medium leading-6">
                    {question}
                </h3>
                {guide && (
                    <p className="text-sm text-gray-500 mt-1">
                        {guide}
                    </p>
                )}
            </div>

            {/* Pregunta si desea responder */}
            {!isBinary && (
                <div className="mt-2">
                    <div className="divider" style={{ marginBottom: '5px', marginTop: '5px' }}></div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        ¿Responder esta pregunta?
                    </p>
                </div>
            )}

            {/* Opciones de respuesta */}
            <div className="flex gap-4 mt-2">
                <label className={`flex items-center gap-2 ${isDisabled ? 'cursor-not-allowed' : ''}`}>
                    <input
                        type="radio" 
                        name={`indicator-${code}`}
                        value="1"
                        checked={showYesChecked}
                        onChange={handleChange}
                        disabled={isDisabled}
                        className={`w-4 h-4 ${isDisabled 
                            ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                            : 'text-green-600 border-gray-300'} focus:ring-green-500`}
                    />
                    <span className={`${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>Sí</span>
                </label>

                <label className={`flex items-center gap-2 ${isDisabled ? 'cursor-not-allowed' : ''}`}>
                    <input
                        type="radio"
                        name={`indicator-${code}`}
                        value="0"
                        checked={showNoChecked}
                        onChange={handleChange}
                        disabled={isDisabled}
                        className={`w-4 h-4 ${isDisabled 
                            ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                            : 'text-green-600 border-gray-300'} focus:ring-green-500`}
                    />
                    <span className={`${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>No</span>
                </label>
                
                {(isHomologated || isHomologatedFromCert) && (
                    <span className="text-sm text-blue-600 italic ml-2">
                        Respuesta automática por homologación
                    </span>
                )}
            
            </div>

            {/* Campo de justificación para preguntas no binarias */}
            {!isBinary && (
                <div className="mt-3">
                    <label htmlFor={`justification-${code}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Escriba su respuesta aquí
                        {wantsToAnswer && !(isHomologated || isHomologatedFromCert) && <span className="text-red-500 ml-1">*</span>}
                        {(isHomologated || isHomologatedFromCert) && <span className="text-blue-500 ml-1">(Automática)</span>}
                    </label>
                    <textarea
                        id={`justification-${code}`}
                        name={`justification-${code}`}
                        rows="3"
                        value={justification}
                        onChange={handleJustificationChange}
                        disabled={isDisabled || !wantsToAnswer}
                        className={`block w-full rounded-md shadow-sm sm:text-sm ${
                            isDisabled || !wantsToAnswer 
                            ? 'bg-gray-100 cursor-not-allowed border-gray-300 focus:border-green-500 focus:ring-green-500' 
                            : wantsToAnswer && !justification && !(isHomologated || isHomologatedFromCert)
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        }`}
                        placeholder={wantsToAnswer ? (isHomologated || isHomologatedFromCert) ? "Justificación automática..." : "Respuesta..." : "Respuesta..."}
                        maxLength={240}
                    ></textarea>
                    {wantsToAnswer && !justification && !(isHomologated || isHomologatedFromCert) && (
                        <p className="mt-1 text-sm text-red-600 font-medium">
                            Este campo es obligatorio cuando la respuesta es "Sí".
                        </p>
                    )}
                    {(isHomologated || isHomologatedFromCert) && wantsToAnswer && (
                        <p className="mt-1 text-sm text-blue-600 italic">
                            La justificación se completa automáticamente para indicadores homologados.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
} 