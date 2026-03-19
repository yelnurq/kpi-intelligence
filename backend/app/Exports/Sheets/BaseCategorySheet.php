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
        'A' => 47, // Виды работ (широкая)
        'B' => 15, // Норма времени
        'C' => 40, // НАИМЕНОВАНИЕ РАБОТ (самая широкая для Title)
        'D' => 12, // кол-во
        'E' => 20, // 1-й период
        'F' => 12, // кол-во
        'G' => 20, // 2-й период
        'H' => 20, // отчетность
        'I' => 20, // срок
        'J' => 20  // дата выполнения
    ];
}

    public function styles(Worksheet $sheet) {
        $sheet->getStyle('A:J')->getAlignment()->setWrapText(true);
        return [];
    }
}