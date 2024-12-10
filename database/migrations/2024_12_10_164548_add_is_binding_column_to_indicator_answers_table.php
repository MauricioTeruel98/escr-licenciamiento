<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('indicator_answers', function (Blueprint $table) {
            $table->boolean('is_binding')->default(false)->after('answer');
        });
    }

    public function down()
    {
        Schema::table('indicator_answers', function (Blueprint $table) {
            $table->dropColumn('is_binding');
        });
    }
};