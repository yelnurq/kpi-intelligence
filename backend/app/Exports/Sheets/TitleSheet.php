<?php

namespace App\Exports\Sheets;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class TitleSheet implements FromView, WithTitle, WithDrawings
{
    protected $data;
    public function __construct($data) { $this->data = $data; }

    public function title(): string { return 'Титульный лист'; }

    public function view(): View {
        return view('exports.kpi_title', ['user' => $this->data['user'], 'year' => $this->data['year']]);
    }

    public function drawings() {
        $drawing = new Drawing();
        $drawing->setName('Logo');
        $drawing->setPath(public_path('images/icons/logo.png'));
        $drawing->setHeight(75);
        $drawing->setCoordinates('G4');
        $drawing->setOffsetY(10);
        $drawing->setOffsetX(80);
        return $drawing;
    }
}