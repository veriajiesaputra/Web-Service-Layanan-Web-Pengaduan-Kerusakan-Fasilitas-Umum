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
        Schema::create('emergency_contacts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title')->nullable();
            $table->string('name')->nullable();
            $table->string('phone');
            $table->string('desc')->nullable();
            $table->string('role')->nullable();
            $table->string('icon')->nullable();
            $table->string('badge')->nullable();
            $table->string('available')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emergency_contacts');
    }
};
