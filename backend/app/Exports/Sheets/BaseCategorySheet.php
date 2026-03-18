<?php 

namespace App\Exports\Sheets;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BaseCategorySheet implements FromView, WithTitle, WithColumnWidths, WithStyles
{
    
    protected $data;
    protected $fullTitle;
    protected $categoryKey;

    public function __construct($data, $fullTitle, $categoryKey) {
        $this->data = $data;
        $this->fullTitle = $fullTitle;
        $this->categoryKey = $categoryKey;
    }

   public function title(): string { 
    // Удаляем спецсимволы, которые запрещены в названиях вкладок Excel
    $cleanTitle = str_replace(['/', '*', '?', ':', '[', ']'], ' ', $this->fullTitle);
    return mb_substr($cleanTitle, 0, 31); 
}

    public function view(): View {
        return view('exports.kpi_base', [
            'items' => $this->data['selectedItems']->where('category', $this->categoryKey),
            'categoryTitle' => $this->fullTitle, // Передаем длинный заголовок в Blade
            'year' => $this->data['year']
        ]);
    }

    public function columnWidths(): array {
    return [
        'A' => 50, // Виды работ (широкая)
        'B' => 12, // Норма времени
        'C' => 45, // НАИМЕНОВАНИЕ РАБОТ (самая широкая для Title)
        'D' => 10, // кол-во
        'E' => 12, // 1-й период
        'F' => 10, // кол-во
        'G' => 12, // 2-й период
        'H' => 15, // отчетность
        'I' => 15, // срок
        'J' => 15  // дата выполнения
    ];
}

    public function styles(Worksheet $sheet) {
        $sheet->getStyle('A:J')->getAlignment()->setWrapText(true);
        return [];
    }
}