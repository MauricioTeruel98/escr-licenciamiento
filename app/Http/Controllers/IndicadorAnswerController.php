<?php

namespace App\Http\Controllers;

use App\Models\IndicatorAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IndicadorAnswerController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Datos recibidos en el controlador:', $request->all());

            $user = auth()->user();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            if (!$request->has('answers') || !is_array($request->answers)) {
                return response()->json(['message' => 'No se recibieron respuestas válidas'], 422);
            }

            $successCount = 0;

            foreach ($request->answers as $indicatorId => $answer) {
                // Crear o actualizar la respuesta
                IndicatorAnswer::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'company_id' => $user->company_id,
                        'indicator_id' => $indicatorId,
                    ],
                    ['answer' => $answer]
                );
                
                $successCount++;
            }

            return back()->with('success', 'Se guardaron las respuestas exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al guardar respuestas:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Error al guardar las respuestas: ' . $e->getMessage());
        }
    }
}
