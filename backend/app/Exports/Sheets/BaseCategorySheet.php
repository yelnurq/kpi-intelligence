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
            'A' => 5, 'B' => 25, 'C' => 10, 'D' => 40,
            'E' => 10, 'F' => 10, 'G' => 10, 'H' => 10, 'I' => 15, 'J' => 15
        ];
    }

    public function styles(Worksheet $sheet) {
        $sheet->getStyle('A:J')->getAlignment()->setWrapText(true);
        return [];
    }
}