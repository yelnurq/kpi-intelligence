<?php

namespace App\Exports;

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
            new Sheets\TitleSheet($this->data),
            new Sheets\PlanSheet($this->data),
        ];
    }
    public function registerEvents(): array {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                
                $sheet->getStyle('A1:P500')->getAlignment()->setWrapText(true);
                $sheet->getStyle('A1:P500')->getAlignment()->setVertical('center');
                
                foreach (range(40, 100) as $row) {
                    $sheet->getRowDimension($row)->setRowHeight(-1);
                }
            },
        ];
  }
}