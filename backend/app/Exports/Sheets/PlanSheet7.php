<?php
namespace App\Exports\Sheets;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PlanSheet7 implements FromView, WithTitle, WithColumnWidths, WithStyles
{
    protected $data;
    public function __construct($data) { $this->data = $data; }

    public function title(): string { return '7. ПОВЫШЕНИЕ КВАЛИФИКАЦИИ'; }

    public function columnWidths(): array {
        return [
            'A' => 47,   
            'B' => 15,  
            'C' => 12, 'D' => 20, 'E' => 12, 'F' => 20, 'G' => 30, 'H' => 30,
        ];
    }

    public function styles(Worksheet $sheet) {
        return [
            'A:H' => ['alignment' => ['wrapText' => true, 'vertical' => 'center']],
        ];
    }

    public function view(): View {
        $educationalWork = $this->data['selectedItems']->where('category', 'повышение квалификации');

        return view('exports.kpi_plan7_table', [
            'items' => $educationalWork,
            'year'  => $this->data['year']
        ]);
    }
}