<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('auto_evaluation_valor_result', function (Blueprint $table) {
            $table->integer('progress')->default(0);
        });

        Schema::table('evaluation_value_results', function (Blueprint $table) {
            $table->integer('progress')->default(0);
        });

        Schema::table('evaluation_value_result_reference', function (Blueprint $table) {
            $table->integer('progress')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auto_evaluation_valor_result', function (Blueprint $table) {
            $table->dropColumn('progress');
        });

        Schema::table('evaluation_value_results', function (Blueprint $table) {
            $table->dropColumn('progress');
        });

        Schema::table('evaluation_value_result_reference', function (Blueprint $table) {
            $table->dropColumn('progress');
        });
    }
};
