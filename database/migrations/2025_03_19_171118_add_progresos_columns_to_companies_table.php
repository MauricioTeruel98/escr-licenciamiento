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
            $table->integer('progreso_evaluacion')->default(0);
            $table->integer('progreso_auto_evaluacion')->default(0);
            // Fecha de inicio de la autoevaluacion y evaluacion
            $table->date('fecha_inicio_auto_evaluacion')->nullable();
            $table->date('fecha_inicio_evaluacion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('progreso_evaluacion');
            $table->dropColumn('progreso_auto_evaluacion');
            $table->dropColumn('fecha_inicio_auto_evaluacion');
            $table->dropColumn('fecha_inicio_evaluacion');
        });
    }
};
