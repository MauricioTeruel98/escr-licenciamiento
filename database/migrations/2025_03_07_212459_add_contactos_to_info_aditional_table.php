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
        /*
            'contacto_notificacion_nombre',
            'contacto_notificacion_email',
            'contacto_notificacion_puesto',
            'contacto_notificacion_cedula',
            'contacto_notificacion_telefono',
            'contacto_notificacion_celular',
            'asignado_proceso_nombre',
            'asignado_proceso_email',
            'asignado_proceso_puesto',
            'asignado_proceso_cedula',
            'asignado_proceso_telefono',
            'asignado_proceso_celular',
            'representante_cedula',
        */
        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->string('contacto_notificacion_nombre')->nullable();
            $table->string('contacto_notificacion_email')->nullable();
            $table->string('contacto_notificacion_puesto')->nullable();
            $table->string('contacto_notificacion_cedula')->nullable();
            $table->string('contacto_notificacion_telefono')->nullable();
            $table->string('contacto_notificacion_celular')->nullable();

            $table->string('asignado_proceso_nombre')->nullable();
            $table->string('asignado_proceso_email')->nullable();
            $table->string('asignado_proceso_puesto')->nullable();
            $table->string('asignado_proceso_cedula')->nullable();
            $table->string('asignado_proceso_telefono')->nullable();
            $table->string('asignado_proceso_celular')->nullable();

            $table->string('representante_cedula')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('info_adicional_empresas', function (Blueprint $table) {
            $table->dropColumn('contacto_notificacion_nombre');
            $table->dropColumn('contacto_notificacion_puesto');
            $table->dropColumn('contacto_notificacion_cedula');
            $table->dropColumn('contacto_notificacion_telefono');
            $table->dropColumn('contacto_notificacion_celular');

            $table->dropColumn('asignado_proceso_nombre');
            $table->dropColumn('asignado_proceso_puesto');
            $table->dropColumn('asignado_proceso_cedula');
            $table->dropColumn('asignado_proceso_telefono');
            $table->dropColumn('asignado_proceso_celular');

            $table->dropColumn('representante_cedula');
        });
    }
};
