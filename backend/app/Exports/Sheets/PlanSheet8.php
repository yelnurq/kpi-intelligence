<?php
namespace App\Exports\Sheets;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PlanSheet8 implements FromView, WithTitle, WithColumnWidths, WithStyles
{
    protected $data;
    public function __construct($data) { $this->data = $data; }

    public function title(): string { return '8. КОРРЕКТИРОВКА ИНДИВИДУАЛЬНОГО ПЛАНА '; }

    public function columnWidths(): array {
        return [
            'A' => 9,   
            'B' => 9,  
            'C' => 9, 'D' => 9, 'E' => 9, 'F' => 9, 'G' => 9, 'H' => 9,
            'I'=>9, 'J'=>9, 'K'=>9,'L'=>9,'M'=>9,'N'=>9,
        ];
    }

    public function styles(Worksheet $sheet) {
        return [
            'A:H' => ['alignment' => ['wrapText' => true, 'vertical' => 'center']],
        ];
    }

    public function view(): View {

        return view('exports.kpi_plan8_table', [
            'year'  => $this->data['year']
        ]);
    }
}