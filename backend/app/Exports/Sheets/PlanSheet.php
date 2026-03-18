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

    public function title(): string { return 'Индивидуальный план'; }

    public function columnWidths(): array {
        return [
            'A' => 5,   // №
            'B' => 45,  // Виды работ
            'C' => 12,  // 1 период план
            'D' => 12,  // 1 период факт
            'E' => 12,  // 2 период план
            'F' => 12,  // 2 период факт
            'G' => 12,  // Итого год план
            'H' => 12,  // Итого год факт
        ];
    }

    public function styles(Worksheet $sheet) {
        return [
            // Устанавливаем перенос текста для всей таблицы
            'A:H' => ['alignment' => ['wrapText' => true, 'vertical' => 'center']],
        ];
    }

    public function view(): View {
        return view('exports.kpi_plan_table', [
            'selectedItems' => $this->data['selectedItems'],
            'year' => $this->data['year']
        ]);
    }
}