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
        Schema::create('reports', function (Blueprint $table) {
            $table->string('id')->primary(); // #LAP-0419
            $table->string('title');
            $table->string('category')->index();
            $table->string('category_label')->nullable();
            $table->string('category_icon')->nullable();
            $table->string('status')->default('Diajukan')->index();
            $table->text('location')->nullable();
            $table->string('dusun')->nullable()->index();
            $table->text('description')->nullable();
            $table->string('time_ago')->nullable();
            $table->string('priority')->default('Sedang');
            $table->string('officer_badge')->nullable();
            $table->string('officer_badge_type')->default('priority');
            $table->json('coordinates')->nullable();
            $table->string('reporter_name')->nullable();
            $table->string('reporter_role')->nullable();
            $table->string('reporter_phone')->nullable()->index();
            $table->string('reporter_nik', 16)->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->integer('upvotes')->default(0);
            $table->boolean('has_upvoted')->default(false);
            $table->string('assigned_team')->nullable();
            $table->text('notes')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->json('photos')->nullable();
            $table->json('timeline')->nullable();
            $table->json('comments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
