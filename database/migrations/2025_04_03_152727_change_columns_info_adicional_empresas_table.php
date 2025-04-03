<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->boolean('tiene_multi_sitio')->nullable()->change();
            $table->integer('cantidad_multi_sitio')->nullable()->change();
            $table->boolean('aprobo_evaluacion_multi_sitio')->nullable()->change();
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->boolean('tiene_multi_sitio')->nullable()->change();
            $table->integer('cantidad_multi_sitio')->nullable()->change();
            $table->boolean('aprobo_evaluacion_multi_sitio')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->boolean('tiene_multi_sitio')->nullable(false)->change();
            $table->integer('cantidad_multi_sitio')->nullable(false)->change();
            $table->boolean('aprobo_evaluacion_multi_sitio')->nullable(false)->change();
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->boolean('tiene_multi_sitio')->nullable(false)->change();
            $table->integer('cantidad_multi_sitio')->nullable(false)->change();
            $table->boolean('aprobo_evaluacion_multi_sitio')->nullable(false)->change();
        });
    }
};