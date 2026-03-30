<?php

namespace Database\Factories;

use App\Models\KpiEvidence;
use App\Models\KpiActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

class KpiEvidenceFactory extends Factory
{
    protected $model = KpiEvidence::class;

    public function definition(): array
    {
        $extensions = ['pdf', 'jpg', 'png', 'docx'];
        $ext = fake()->randomElement($extensions);

        return [
            'kpi_activity_id' => KpiActivity::factory(),
            'file_name' => 'подтверждение_' . fake()->word() . '.' . $ext,
            'file_path' => 'uploads/evidence/' . fake()->uuid() . '.' . $ext,
            'file_type' => $ext === 'pdf' ? 'application/pdf' : 'image/' . $ext,
        ];
    }
}