<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('indicator_answers_evaluation', function (Blueprint $table) {
            $table->unsignedBigInteger('indicator_id')->after('company_id');
            $table->foreign('indicator_id')
                  ->references('id')
                  ->on('indicators')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('indicator_answers_evaluation', function (Blueprint $table) {
            $table->dropForeign(['indicator_id']);
            $table->dropColumn('indicator_id');
        });
    }
}; 