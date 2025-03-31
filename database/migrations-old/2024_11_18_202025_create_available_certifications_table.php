<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('available_certifications', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        // Insertar las certificaciones disponibles iniciales
        DB::table('available_certifications')->insert([
            ['nombre' => 'INTE B5:2020', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'INTE G12:2019', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'INTE G8:2013', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'INTE G38:2015', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('available_certifications');
    }
};