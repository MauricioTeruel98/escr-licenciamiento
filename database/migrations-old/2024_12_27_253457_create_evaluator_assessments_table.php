<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('evaluator_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('evaluation_question_id')->constrained('evaluation_questions');
            $table->foreignId('indicator_id')->constrained('indicators');
            $table->boolean('approved');
            $table->text('comment')->nullable();
            $table->timestamps();

            // Índices para optimizar búsquedas
            $table->index(['company_id', 'evaluation_question_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluator_assessments');
    }
}; 