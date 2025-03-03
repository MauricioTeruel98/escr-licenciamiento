<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            //Por defecto, se establece como "auto-evaluación", y agregale un enum con los siguientes valores:
            //auto-evaluación, evaluación-pendiente, evaluación-completada, evaluación
            $table->enum('estado_eval', [
                'auto-evaluacion',
                'auto-evaluacion-completed',
                'evaluacion-pendiente',
                'evaluacion',
                'evaluacion-completada'
            ])->default('auto-evaluacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('estado_eval');
        });
    }
};
