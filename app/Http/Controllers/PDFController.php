<?php

namespace App\Http\Controllers;

use App\Models\Value;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use ZipArchive;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CompanyExport;

class PDFController extends Controller
{
    public function downloadIndicatorsPDF()
    {
        $values = Value::with(['subcategories.indicators.requisito'])->get();

        $pdf = Pdf::loadView('pdf.indicators', compact('values'));

        return $pdf->download('indicadores_licenciamiento.pdf');
    }

    public function downloadCompanyDocumentation()
    {
        // Obtener el usuario autenticado y su empresa
        $user = Auth::user();
        
        if (!$user || !$user->company_id) {
            return redirect()->back()->with('error', 'No se encontró información de la empresa.');
        }

        $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($user->company_id);
        
        if (!$company) {
            return redirect()->back()->with('error', 'No se encontró información de la empresa.');
        }

        // Verificar si la empresa ha completado la autoevaluación
        if (!$company->autoeval_ended) {
            return redirect()->back()->with('error', 'La empresa aún no ha completado la autoevaluación.');
        }

        // Ruta de la carpeta de autoevaluaciones de la empresa
        $companySlug = Str::slug($company->name);
        $companyPath = "autoevaluations/{$company->id}-{$companySlug}";
        
        // Verificar si existe la carpeta
        if (!Storage::disk('public')->exists($companyPath)) {
            return redirect()->back()->with('error', 'No se encontraron documentos de autoevaluación.');
        }

        // Obtener el archivo PDF más reciente
        $pdfFiles = Storage::disk('public')->files($companyPath);
        
        if (empty($pdfFiles)) {
            return redirect()->back()->with('error', 'No se encontraron documentos de autoevaluación.');
        }
        
        // Ordenar archivos por fecha de modificación (más reciente primero)
        usort($pdfFiles, function($a, $b) {
            return Storage::disk('public')->lastModified($b) - Storage::disk('public')->lastModified($a);
        });
        
        $latestPdf = $pdfFiles[0];
        
        // Crear un archivo Excel con la información de la empresa
        $excelFileName = "informacion_empresa_{$company->id}_{$companySlug}.xlsx";
        
        // Asegurarse de que la carpeta temp exista
        if (!Storage::disk('public')->exists('temp')) {
            Storage::disk('public')->makeDirectory('temp');
        }
        
        // Crear la clase de exportación y guardar el Excel directamente en el storage
        Excel::store(new CompanyExport($company), "temp/{$excelFileName}", 'public');
        
        // Verificar que el archivo Excel se haya creado correctamente
        if (!Storage::disk('public')->exists("temp/{$excelFileName}")) {
            return redirect()->back()->with('error', 'No se pudo generar el archivo Excel.');
        }
        
        // Crear archivo ZIP
        $zipFileName = "documentacion_empresa_{$company->id}_{$companySlug}.zip";
        $zipPath = storage_path("app/public/temp/{$zipFileName}");
        
        $zip = new ZipArchive();
        
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            // Agregar el PDF al ZIP
            $pdfContent = Storage::disk('public')->get($latestPdf);
            $pdfFileName = basename($latestPdf);
            $zip->addFromString($pdfFileName, $pdfContent);
            
            // Agregar el Excel al ZIP
            $excelContent = Storage::disk('public')->get("temp/{$excelFileName}");
            $zip->addFromString($excelFileName, $excelContent);
            
            $zip->close();
            
            // Descargar el archivo ZIP
            return response()->download($zipPath)->deleteFileAfterSend(true);
        } else {
            return redirect()->back()->with('error', 'No se pudo crear el archivo ZIP.');
        }
    }
} 