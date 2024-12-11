<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluationQuestionsTable extends Migration
{
    public function up()
    {
        Schema::create('evaluation_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('indicator_id');
            $table->text('question');
            $table->timestamps();

            $table->foreign('indicator_id')->references('id')->on('indicators')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluation_questions');
    }
}