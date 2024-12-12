<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // En la nueva migración
    public function up()
    {
        Schema::table('indicator_answers_evaluation', function (Blueprint $table) {

            // Agregamos la nueva columna para evaluation_question_id
            $table->unsignedBigInteger('evaluation_question_id');
            $table->foreign('evaluation_question_id')
                ->references('id')
                ->on('evaluation_questions')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('indicator_answers_evaluation', function (Blueprint $table) {
            $table->dropForeign(['evaluation_question_id']);
            $table->dropColumn('evaluation_question_id');

            $table->unsignedBigInteger('indicator_id');
            $table->foreign('indicator_id')
                ->references('id')
                ->on('indicators')
                ->onDelete('cascade');
        });
    }
};
