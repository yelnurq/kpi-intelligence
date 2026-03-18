<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents; // Добавлено
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class KPIExport implements FromView, WithDrawings, WithColumnWidths, WithEvents
{
    protected $data;

    public function __construct($data) {
        $this->data = $data;
    }

    public function view(): View {
        return view('exports.kpi_report', ['user' => $this->data]);
    }

    public function columnWidths(): array {
        // Увеличим ширину до 10-11, чтобы тексту было просторнее
        $widths = [];
        foreach (range('A', 'P') as $col) {
            $widths[$col] = 10; 
        }
        return $widths;
    }

    public function drawings()
{
    $drawing = new Drawing();
    $drawing->setName('Logo');
    $drawing->setPath(public_path('images/icons/logo.png'));
    $drawing->setHeight(80); // Немного уменьшим высоту для лучшего зазора
    
    // Привязываем к началу объединенной ячейки (в вашем HTML это 7-я колонка, т.е. 'G')
    $drawing->setCoordinates('G4'); 

    // Центрирование: 
    // Колонки G, H, I имеют суммарную ширину. 
    // Чтобы встало по центру, подберите OffsetX (обычно от 40 до 60)
    $drawing->setOffsetX(60); 
    $drawing->setOffsetY(15); // Небольшой отступ сверху
    
    return $drawing;
}
    public function registerEvents(): array {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                // Это заставляет текст переноситься на новую строку, если он не влезает
                $event->sheet->getDelegate()->getStyle('A1:P100')
                    ->getAlignment()->setWrapText(true);
                
            },
        ];
    }
}