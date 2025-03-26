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
            $table->string('puntos_fuertes')->nullable();
            $table->string('justificacion')->nullable();
            $table->string('oportunidades')->nullable();
        });

        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->string('puntos_fuertes')->nullable();
            $table->string('justificacion')->nullable();
            $table->string('oportunidades')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('puntos_fuertes');
            $table->dropColumn('justificacion');
            $table->dropColumn('oportunidades');
        });

        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->dropColumn('puntos_fuertes');
            $table->dropColumn('justificacion');
            $table->dropColumn('oportunidades');
        });
    }
};
