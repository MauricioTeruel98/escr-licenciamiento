<?php

namespace App\Http\Controllers;

use App\Models\MailLog;
use App\Services\MailService;
use Illuminate\Http\Request;
use App\Mail\TestMail;

class MailLogController extends Controller
{
    protected $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    public function index()
    {
        // Obtener todos los registros de correos, ordenados por fecha de creación descendente
        $mailLogs = MailLog::query()
            ->orderBy('created_at', 'desc')
            ->when(request('filter') === 'failed', function ($query) {
                $query->where('status', 'failed');
            })
            ->when(request('filter') === 'pending', function ($query) {
                $query->where('status', 'pending');
            })
            ->when(request('filter') === 'sent', function ($query) {
                $query->where('status', 'sent');
            })
            ->paginate(10);

        return view('mail-logs.index', [
            'mailLogs' => $mailLogs,
            'stats' => [
                'total' => MailLog::count(),
                'failed' => MailLog::where('status', 'failed')->count(),
                'pending' => MailLog::where('status', 'pending')->count(),
                'sent' => MailLog::where('status', 'sent')->count(),
            ]
        ]);
    }

    public function retry($id)
    {
        try {
            $result = $this->mailService->retry($id);

            return response()->json([
                'success' => $result,
                'message' => $result ? 'Correo reenviado exitosamente' : 'Error al reenviar el correo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al reenviar el correo: ' . $e->getMessage()
            ], 422);
        }
    }

    public function sendTest(Request $request)
    {
        $request->validate([
            'test_email' => ['required', 'email']
        ]);

        try {
            $testMail = new TestMail();
            $result = $this->mailService->send($request->test_email, $testMail);

            return response()->json([
                'success' => $result,
                'message' => $result ? 'Correo de prueba enviado exitosamente' : 'Error al enviar el correo de prueba'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el correo de prueba: ' . $e->getMessage()
            ], 500);
        }
    }
} 