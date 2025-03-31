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
            $table->text('puntos_fuertes')->nullable()->change();
            $table->text('justificacion')->nullable()->change();
            $table->text('oportunidades')->nullable()->change();
        });

        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->text('puntos_fuertes')->nullable()->change();
            $table->text('justificacion')->nullable()->change();
            $table->text('oportunidades')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('puntos_fuertes')->nullable()->change();
            $table->string('justificacion')->nullable()->change();
            $table->string('oportunidades')->nullable()->change();
        });

        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->string('puntos_fuertes')->nullable()->change();
            $table->string('justificacion')->nullable()->change();
            $table->string('oportunidades')->nullable()->change();
        });
    }
};
