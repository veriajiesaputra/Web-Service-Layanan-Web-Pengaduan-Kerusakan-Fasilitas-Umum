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
        Schema::create('citizens', function (Blueprint $table) {
            $table->string('id')->primary(); // cit-001 or generated
            $table->string('nik', 16)->nullable()->unique();
            $table->string('name');
            $table->string('phone')->index();
            $table->string('dusun')->nullable();
            $table->string('rt_rw')->nullable();
            $table->string('role')->default('Warga');
            $table->string('password')->default('123456');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citizens');
    }
};
