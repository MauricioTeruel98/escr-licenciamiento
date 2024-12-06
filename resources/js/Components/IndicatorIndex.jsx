export default function IndicatorIndex({ code, question, onAnswer, value }) {
    const handleChange = (e) => {
        const selectedValue = e.target.value;
        console.log('Seleccionado para indicador', code, ':', selectedValue); // Debug
        onAnswer(selectedValue);
    };

    // Debug para ver el valor actual
    console.log('Valor actual para indicador', code, ':', value);

    return (
        <div className="bg-white rounded-lg space-y-4">
            {/* Cabecera del indicador */}
            <div className="space-y-2">
                <div className="inline-block">
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm font-semibold ring-1 ring-inset ring-green-600/20 flex items-center gap-2">
                        INDICADOR {code}
                    </span>
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
                        checked={value === "1"}
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
                        checked={value === "0"}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-gray-900">No</span>
                </label>
            </div>
        </div>
    );
} 