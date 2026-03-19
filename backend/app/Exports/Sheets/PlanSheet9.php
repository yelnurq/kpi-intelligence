<?php
namespace App\Exports\Sheets;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PlanSheet9 implements FromView, WithTitle, WithColumnWidths, WithStyles
{
    protected $data;
    public function __construct($data) { $this->data = $data; }

    public function title(): string { return '9. ИТОГИ ВЫПОЛНЕНИЯ ИНДИВИДУАЛЬНОГО ПЛАНА
 '; }

    public function columnWidths(): array {
        return [
            'A' => 9,   
            'B' => 45,  
            'C' => 35, 'D' => 20, 'E' => 20, 'F' => 20, 'G' => 20
        ];
    }

    public function styles(Worksheet $sheet) {
        return [
            'A:H' => ['alignment' => ['wrapText' => true, 'vertical' => 'center']],
        ];
    }

    public function view(): View {

        return view('exports.kpi_plan9_table', [
            'year'  => $this->data['year']
        ]);
    }
}