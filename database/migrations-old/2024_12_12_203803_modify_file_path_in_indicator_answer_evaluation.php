<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('indicator_answers_evaluation', function (Blueprint $table) {
            $table->text('file_path')->default('[]')->change();
        });
    }

    public function down()
    {
        Schema::table('indicator_answers_evaluation', function (Blueprint $table) {
            $table->text('file_path')->change();
        });
    }
};