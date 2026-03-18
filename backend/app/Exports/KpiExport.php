<?php

namespace App\Exports;

use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithEvents; // ОБЯЗАТЕЛЬНО ДОБАВИТЬ

class KPIExport implements WithMultipleSheets, WithEvents { // ДОБАВИТЬ ИНТЕРФЕЙС
    protected $data;

    public function __construct($data) {
        $this->data = $data;
    }

    public function sheets(): array
    {
        $sheets = [];

        $sheets[] = new Sheets\TitleSheet($this->data);
        $sheets[] = new Sheets\PlanSheet($this->data);

        $categories = [
    'учебно-методическая работа'         => '2. УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА',
    'организационно-методическая работа' => '3. ОРГАНИЗАЦИОННО-МЕТОДИЧЕСКАЯ РАБОТА',
    'научно-исследовательская работа'     => '4. НАУЧНО-ИССЛЕДОВАТЕЛЬСКАЯ РАБОТА',
    'воспитательная работа'              => '5. ВОСПИТАТЕЛЬНАЯ РАБОТА',
    'профориентационная работа'          => '6. ПРОФОРИЕНТАЦИОННАЯ РАБОТА',
    'повышение квалификации'             => '7. ПОВЫШЕНИЕ КВАЛИФИКАЦИИ',
];

        foreach ($categories as $key => $title) {
            $sheets[] = new Sheets\BaseCategorySheet($this->data, $title, $key);
        }

        return $sheets;
    }

    public function registerEvents(): array {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                
                // Применяем ко всей рабочей области
                $sheet->getStyle('A1:J500')->getAlignment()->setWrapText(true);
                $sheet->getStyle('A1:J500')->getAlignment()->setVertical('center');
                
                // Авто-высота строк для контента
                foreach (range(5, 100) as $row) {
                    $sheet->getRowDimension($row)->setRowHeight(-1);
                }
            },
        ];
    }
}