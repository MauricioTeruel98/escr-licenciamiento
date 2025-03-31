<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('mail_logs', function (Blueprint $table) {
            $table->id();
            $table->string('to_email');
            $table->string('subject');
            $table->string('mailable_class');
            $table->json('mailable_data');
            $table->enum('status', ['pending', 'sent', 'failed']);
            $table->text('error_message')->nullable();
            $table->integer('attempts')->default(0);
            $table->timestamp('last_attempt')->nullable();
            $table->timestamps();
            $table->index(['status', 'attempts']); // Para búsquedas eficientes
        });
    }

    public function down()
    {
        Schema::dropIfExists('mail_logs');
    }
};