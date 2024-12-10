export default function IndicatorIndex({ code, question, onAnswer, value, isBinding }) {
    const handleChange = (e) => {
        const selectedValue = e.target.value;
        console.log('Seleccionado para indicador', code, ':', selectedValue);
        onAnswer(selectedValue);
    };

    // Convertimos el value a string para la comparación
    const stringValue = String(value);
    console.log('Valor actual para indicador', code, ':', stringValue, typeof stringValue);

    return (
        <div className="bg-white rounded-lg space-y-4">
            {/* Cabecera del indicador */}
            <div className="space-y-2">
                <div className="inline-block">
                    <div className="flex items-center gap-2">
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-green-600/20 flex items-center gap-2">
                            INDICADOR {code}
                        </span>
                        {isBinding && (
                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 ml-2">
                                Vinculante
                            </span>
                        )}
                    </div>
                </div>
                <h3 className="text-gray-900 font-medium leading-6">
                    {question}
                </h3>
            </div>

            {/* Opciones de respuesta */}
            <div className="flex gap-4 mt-4">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name={`indicator-${code}`}
                        value="1"
                        checked={stringValue === "1"}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-gray-900">Sí</span>
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name={`indicator-${code}`}
                        value="0"
                        checked={stringValue === "0"}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-gray-900">No</span>
                </label>
            </div>
        </div>
    );
} 