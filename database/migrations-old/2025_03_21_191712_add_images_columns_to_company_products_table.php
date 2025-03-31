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
        Schema::table('company_products', function (Blueprint $table) {
            $table->string('imagen_2')->nullable();
            $table->string('imagen_3')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_products', function (Blueprint $table) {
            $table->dropColumn('imagen_2');
            $table->dropColumn('imagen_3');
        });
    }
};
