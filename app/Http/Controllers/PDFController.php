<?php

namespace App\Http\Controllers;

use App\Models\Value;
use Illuminate\Http\Request;
use PDF;

class PDFController extends Controller
{
    public function downloadIndicatorsPDF()
    {
        $values = Value::with(['subcategories.indicators.requisito'])->get();

        $pdf = PDF::loadView('pdf.indicators', compact('values'));

        return $pdf->download('indicadores_licenciamiento.pdf');
    }
} 