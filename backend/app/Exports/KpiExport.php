<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents; // Добавлено
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
class KPIExport implements WithMultipleSheets{
    protected $data;

    public function __construct($data) {
        $this->data = $data;
    }

public function sheets(): array
    {
        return [
            // Первый лист (Титульный)
            new Sheets\TitleSheet($this->data),
            // Второй лист (План KPI)
            new Sheets\PlanSheet($this->data),
        ];
    }
  public function registerEvents(): array {
    return [
        AfterSheet::class => function(AfterSheet $event) {
            $sheet = $event->sheet->getDelegate();
            
            // Глобальный перенос текста
            $sheet->getStyle('A1:P500')->getAlignment()->setWrapText(true);
            $sheet->getStyle('A1:P500')->getAlignment()->setVertical('center');
            
            // Можно добавить специфические настройки высоты строк, если текст обрезается
            foreach (range(40, 100) as $row) {
                $sheet->getRowDimension($row)->setRowHeight(-1); // Автовысота
            }
        },
    ];
  }
}