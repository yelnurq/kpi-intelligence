<?php

namespace App\Exports\Sheets;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class PlanSheet implements FromView, WithTitle, WithColumnWidths
{
    protected $data;
    public function __construct($data) { $this->data = $data; }

    public function title(): string { return 'Индивидуальный план'; }

    public function columnWidths(): array {
        return ['A' => 5, 'B' => 10, 'C' => 10, 'D' => 10, 'E' => 10, 'F' => 10, 'G' => 10, 'P' => 10];
    }

    public function view(): View {
        return view('exports.kpi_plan_table', [
            'selectedItems' => $this->data['selectedItems'],
            'year' => $this->data['year']
        ]);
    }
}