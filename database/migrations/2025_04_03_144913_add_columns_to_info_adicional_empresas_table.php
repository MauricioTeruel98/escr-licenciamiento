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
        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->boolean('tiene_multi_sitio')->default(false);
            $table->integer('cantidad_multi_sitio')->nullable();
            $table->boolean('aprobo_evaluacion_multi_sitio')->default(false);
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->boolean('tiene_multi_sitio')->default(false);
            $table->integer('cantidad_multi_sitio')->nullable();
            $table->boolean('aprobo_evaluacion_multi_sitio')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->dropColumn('tiene_multi_sitio');
            $table->dropColumn('cantidad_multi_sitio');
            $table->dropColumn('aprobo_evaluacion_multi_sitio');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('tiene_multi_sitio');
            $table->dropColumn('cantidad_multi_sitio');
            $table->dropColumn('aprobo_evaluacion_multi_sitio');
        });
    }
};
