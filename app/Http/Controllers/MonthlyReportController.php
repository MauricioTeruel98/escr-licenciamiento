<?php

namespace App\Http\Controllers;

use App\Models\MonthlyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MonthlyReportController extends Controller
{
    public function index()
    {
        $reports = MonthlyReport::orderBy('created_at', 'desc')->get();
        return view('monthly-report.index', compact('reports'));
    }

    public function download(MonthlyReport $report)
    {
        if (!Storage::exists($report->file_path)) {
            return back()->with('error', 'El archivo del reporte no existe.');
        }

        return Storage::download(
            $report->file_path,
            $report->file_name,
            ['Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        );
    }
}