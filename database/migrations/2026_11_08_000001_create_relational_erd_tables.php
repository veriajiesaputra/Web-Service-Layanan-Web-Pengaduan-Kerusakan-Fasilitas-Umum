<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Categories Table
        if (!Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('slug', 100)->unique();
                $table->string('name', 100);
                $table->string('icon', 50)->nullable();
                $table->timestamps();
            });

            DB::table('categories')->insert([
                ['id' => 1, 'name' => 'Jalan & Jembatan', 'slug' => 'jalan', 'icon' => 'add_road', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 2, 'name' => 'Tata Air & Irigasi', 'slug' => 'irigasi', 'icon' => 'water_damage', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 3, 'name' => 'Penerangan Jalan Umum (PJU)', 'slug' => 'penerangan', 'icon' => 'light', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 4, 'name' => 'Kebersihan & Sampah', 'slug' => 'kebersihan', 'icon' => 'delete_sweep', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 5, 'name' => 'Fasilitas & Balai', 'slug' => 'fasilitas', 'icon' => 'roofing', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 6, 'name' => 'Taman & Pohon', 'slug' => 'taman', 'icon' => 'park', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        // Add FK from reports.category to categories.slug
        Schema::table('reports', function (Blueprint $table) {
            $table->string('category', 100)->change();
            $table->foreign('category')->references('slug')->on('categories')->onUpdate('cascade')->onDelete('cascade');
        });

        // 2. Dispatches Table
        if (!Schema::hasTable('dispatches')) {
            Schema::create('dispatches', function (Blueprint $table) {
                $table->id();
                $table->string('report_id');
                $table->string('team_id');
                $table->string('officer_name', 100)->default('Kaur Pelayanan Desa');
                $table->text('instruction')->nullable();
                $table->string('status', 50)->default('deployed');
                $table->timestamp('dispatched_at')->nullable();
                $table->timestamps();

                $table->foreign('report_id')->references('id')->on('reports')->onUpdate('cascade')->onDelete('cascade');
                $table->foreign('team_id')->references('id')->on('teams')->onUpdate('cascade')->onDelete('cascade');
            });

            $sampleReport = DB::table('reports')->first();
            $sampleTeam = DB::table('teams')->first();
            if ($sampleReport && $sampleTeam) {
                DB::table('dispatches')->insert([
                    'report_id' => $sampleReport->id,
                    'team_id' => $sampleTeam->id,
                    'officer_name' => 'Kaur Pelayanan Desa',
                    'instruction' => 'Regu satgas diterjunkan untuk perbaikan darurat infrastruktur.',
                    'status' => 'deployed',
                    'dispatched_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 3. Comments Table
        if (!Schema::hasTable('comments')) {
            Schema::create('comments', function (Blueprint $table) {
                $table->id();
                $table->string('report_id');
                $table->string('author', 100);
                $table->string('role', 50)->default('citizen');
                $table->text('text');
                $table->timestamps();

                $table->foreign('report_id')->references('id')->on('reports')->onUpdate('cascade')->onDelete('cascade');
            });

            $sampleReport = DB::table('reports')->first();
            if ($sampleReport) {
                DB::table('comments')->insert([
                    [
                        'report_id' => $sampleReport->id,
                        'author' => 'Siti Rahmawati',
                        'role' => 'Warga',
                        'text' => 'Mohon segera diperbaiki karena mengganggu mobilitas warga.',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'report_id' => $sampleReport->id,
                        'author' => 'Perangkat Desa Kepunduhan',
                        'role' => 'Admin',
                        'text' => 'Laporan telah diverifikasi dan tim lapangan sudah ditugaskan ke lokasi.',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);
            }
        }

        // 4. Upvotes Table
        if (!Schema::hasTable('upvotes')) {
            Schema::create('upvotes', function (Blueprint $table) {
                $table->id();
                $table->string('report_id');
                $table->string('citizen_id');
                $table->timestamps();

                $table->unique(['report_id', 'citizen_id']);
                $table->foreign('report_id')->references('id')->on('reports')->onUpdate('cascade')->onDelete('cascade');
                $table->foreign('citizen_id')->references('id')->on('citizens')->onUpdate('cascade')->onDelete('cascade');
            });

            $sampleReport = DB::table('reports')->first();
            $sampleCitizen = DB::table('citizens')->first();
            if ($sampleReport && $sampleCitizen) {
                DB::table('upvotes')->insert([
                    'report_id' => $sampleReport->id,
                    'citizen_id' => $sampleCitizen->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('upvotes');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('dispatches');
        Schema::table('reports', function (Blueprint $table) {
            $table->dropForeign(['category']);
        });
        Schema::dropIfExists('categories');
    }
};
