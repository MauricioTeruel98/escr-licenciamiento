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
        Schema::table('companies', function (Blueprint $table) {
            $table->string('name')->nullable(false)->change();
            $table->string('website')->nullable(false)->change();
            $table->string('sector')->nullable(false)->change();
            $table->string('provincia')->nullable(false)->change();
            $table->longText('commercial_activity')->nullable(false)->change();
            $table->string('phone')->nullable(false)->change();
            $table->string('mobile')->nullable(false)->change();
            $table->boolean('is_exporter')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('name')->nullable()->change();
            $table->string('website')->nullable()->change();
            $table->string('sector')->nullable()->change();
            $table->string('provincia')->nullable()->change();
            $table->longText('commercial_activity')->nullable()->change();
            $table->string('phone')->nullable()->change();
            $table->string('mobile')->nullable()->change();
            $table->boolean('is_exporter')->nullable()->change();
        });
    }
};
