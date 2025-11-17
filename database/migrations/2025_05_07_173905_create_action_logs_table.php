<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('action_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action'); // create, update, delete, etc.
            $table->string('model_type'); // Nombre del modelo (Company, User, etc.)
            $table->unsignedBigInteger('model_id'); // ID del registro afectado
            $table->json('old_data')->nullable(); // Datos anteriores (para updates)
            $table->json('new_data')->nullable(); // Datos nuevos
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            
            // Índices para búsquedas eficientes
            $table->index(['model_type', 'model_id']);
            $table->index('action');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('action_logs');
    }
};