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
            $table->integer('cantidad_total')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->dropColumn('cantidad_total');
        });
    }
};
