<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('lastname')->nullable()->after('name');
            $table->string('id_number')->nullable()->after('lastname');
            $table->string('phone')->nullable()->after('id_number');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['lastname', 'id_number', 'phone']);
        });
    }
};