<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('info_adicional_empresas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            
            // Información básica
            $table->string('nombre_comercial')->nullable();
            $table->string('nombre_legal')->nullable();
            $table->text('descripcion_es')->nullable();
            $table->text('descripcion_en')->nullable();
            $table->integer('anio_fundacion')->nullable();
            $table->string('sitio_web')->nullable();
            
            // Redes sociales
            $table->string('facebook')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('instagram')->nullable();
            
            // Información de la empresa
            $table->string('sector')->nullable();
            $table->string('tamano_empresa')->nullable();
            $table->integer('cantidad_hombres')->nullable();
            $table->integer('cantidad_mujeres')->nullable();
            $table->integer('cantidad_otros')->nullable();
            $table->string('telefono_1')->nullable();
            $table->string('telefono_2')->nullable();
            $table->boolean('es_exportadora')->default(false);
            $table->text('paises_exportacion')->nullable();
            
            // Dirección
            $table->string('provincia')->nullable();
            $table->string('canton')->nullable();
            $table->string('distrito')->nullable();
            
            // Información legal y comercial
            $table->string('cedula_juridica')->nullable();
            $table->string('actividad_comercial')->nullable();
            $table->string('producto_servicio')->nullable();
            $table->string('rango_exportaciones')->nullable();
            $table->text('planes_expansion')->nullable();
            
            // Licenciamiento
            $table->text('razon_licenciamiento_es')->nullable();
            $table->text('razon_licenciamiento_en')->nullable();
            $table->text('proceso_licenciamiento')->nullable();
            $table->boolean('recomienda_marca_pais')->nullable();
            $table->text('observaciones')->nullable();
            
            // Contacto de Mercadeo
            $table->string('mercadeo_nombre')->nullable();
            $table->string('mercadeo_email')->nullable();
            $table->string('mercadeo_puesto')->nullable();
            $table->string('mercadeo_telefono')->nullable();
            $table->string('mercadeo_celular')->nullable();
            
            // Contacto de Micrositio
            $table->string('micrositio_nombre')->nullable();
            $table->string('micrositio_email')->nullable();
            $table->string('micrositio_puesto')->nullable();
            $table->string('micrositio_telefono')->nullable();
            $table->string('micrositio_celular')->nullable();
            
            // Contacto del Vocero
            $table->string('vocero_nombre')->nullable();
            $table->string('vocero_email')->nullable();
            $table->string('vocero_puesto')->nullable();
            $table->string('vocero_telefono')->nullable();
            $table->string('vocero_celular')->nullable();
            
            // Contacto del Representante Legal
            $table->string('representante_nombre')->nullable();
            $table->string('representante_email')->nullable();
            $table->string('representante_puesto')->nullable();
            $table->string('representante_telefono')->nullable();
            $table->string('representante_celular')->nullable();
            
            // Arrays JSON
            $table->json('productos')->nullable();
            
            // Agregar campos para imágenes
            $table->string('logo_path')->nullable();
            $table->json('fotografias_paths')->nullable();
            $table->json('certificaciones_paths')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('info_adicional_empresas');
    }
};