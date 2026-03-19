<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('kpi_indicators', function (Blueprint $table) {
            $table->id();
            $table->string('category'); 
            $table->text('title');
            $table->integer('points');
            $table->text('desc')->nullable();
            $table->string('difficulty')->default('Средняя');
            $table->string('year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpi_indicatiors');
    }
};
