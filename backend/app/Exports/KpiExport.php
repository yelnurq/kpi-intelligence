<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class KPIExport implements FromView, WithDrawings, WithColumnWidths
{
    protected $data;

    public function __construct($data) {
        $this->data = $data;
    }

    public function view(): View {
        return view('exports.kpi_report', ['user' => $this->data]);
    }

    public function columnWidths(): array {
        // Устанавливаем ширину колонок для A-P (примерно по 7-8 единиц Excel)
        $widths = [];
        foreach (range('A', 'P') as $col) {
            $widths[$col] = 7.5; 
        }
        return $widths;
    }

    public function drawings() {
        $drawing = new Drawing();
        $drawing->setName('Logo');
        $drawing->setDescription('Университет Лого');
        $drawing->setPath(public_path('images/icons/logo.png')); // Путь к твоему лого
        $drawing->setHeight(55);
        $drawing->setCoordinates('H3'); // Как на скрине, между текстами
        $drawing->setOffsetX(10); 
        return $drawing;
    }
}