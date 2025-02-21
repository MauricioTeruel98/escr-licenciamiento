<?php

namespace App\Http\Controllers\Commands;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;

class StorageCommandController extends Controller
{
    public function link()
    {
        Artisan::call('storage:link');
        return redirect()->back()->with('success', 'Enlace de almacenamiento creado con éxito.');
    }

    public function unlink()
    {
        // No hay un comando directo para "unlink", pero puedes eliminar el enlace simbólico manualmente
        $linkPath = public_path('storage');
        if (file_exists($linkPath)) {
            unlink($linkPath);
            return redirect()->back()->with('success', 'Enlace de almacenamiento eliminado con éxito.');
        }
        return redirect()->back()->with('error', 'El enlace de almacenamiento no existe.');
    }
}