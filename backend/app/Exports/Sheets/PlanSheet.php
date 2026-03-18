<?php
namespace App\Exports\Sheets;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PlanSheet implements FromView, WithTitle, WithColumnWidths, WithStyles
{
    protected $data;
    public function __construct($data) { $this->data = $data; }

    public function title(): string { return '1. Учебная работа'; }

    public function columnWidths(): array {
        return [
            'A' => 6,   
            'B' => 52,  
            'C' => 14, 'D' => 14, 'E' => 14, 'F' => 14, 'G' => 14, 'H' => 14,
        ];
    }

    public function styles(Worksheet $sheet) {
        return [
            'A:H' => ['alignment' => ['wrapText' => true, 'vertical' => 'center']],
        ];
    }

    public function view(): View {
        $educationalWork = $this->data['selectedItems']->where('category', 'учеб.работа');

        return view('exports.kpi_plan_table', [
            'items' => $educationalWork,
            'year'  => $this->data['year']
        ]);
    }
}