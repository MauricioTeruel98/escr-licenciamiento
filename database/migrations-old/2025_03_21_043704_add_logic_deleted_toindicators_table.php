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
        Schema::table('indicators', function (Blueprint $table) {
            $table->boolean('deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
        });

        Schema::table('values', function (Blueprint $table) {
            $table->boolean('deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
        });

        Schema::table('subcategories', function (Blueprint $table) {
            $table->boolean('deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
        });

        Schema::table('requisitos', function (Blueprint $table) {
            $table->boolean('deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
        });

        Schema::table('evaluation_questions', function (Blueprint $table) {
            $table->boolean('deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('indicators', function (Blueprint $table) {
            $table->dropColumn('deleted');
            $table->dropColumn('deleted_at');
        });

        Schema::table('values', function (Blueprint $table) {
            $table->dropColumn('deleted');
            $table->dropColumn('deleted_at');
        });

        Schema::table('subcategories', function (Blueprint $table) {
            $table->dropColumn('deleted');
            $table->dropColumn('deleted_at');
        });

        Schema::table('requisitos', function (Blueprint $table) {
            $table->dropColumn('deleted');
            $table->dropColumn('deleted_at');
        });

        Schema::table('evaluation_questions', function (Blueprint $table) {
            $table->dropColumn('deleted');
            $table->dropColumn('deleted_at');
        });
    }
};
