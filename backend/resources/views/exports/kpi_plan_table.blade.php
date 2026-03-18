<table style="width: 100%; border-collapse: collapse;">
    <thead>
        <tr style="background-color: #f2f2f2; font-weight: bold;">
            <td rowspan="2" style="border: 1px solid #000; text-align: center;">№</td>
            <td rowspan="2" colspan="10" style="border: 1px solid #000; text-align: center;">Виды работ</td>
            <td colspan="2" style="border: 1px solid #000; text-align: center;">Сроки</td>
            <td rowspan="2" colspan="3" style="border: 1px solid #000; text-align: center;">Балл</td>
        </tr>
        <tr style="background-color: #f2f2f2; font-weight: bold;">
            <td style="border: 1px solid #000; text-align: center;">план</td>
            <td style="border: 1px solid #000; text-align: center;">факт</td>
        </tr>
    </thead>
    <tbody>
        @php $global_index = 1; @endphp
        @foreach(['учеб.работа' => '1. УЧЕБНАЯ РАБОТА', 'учебно-методическая работа' => '2. МЕТОДИЧЕСКАЯ РАБОТА'] as $key => $label)
            @php $items = $selectedItems->where('category', $key); @endphp
            @if($items->isNotEmpty())
                <tr>
                    <td colspan="16" style="border: 1px solid #000; background-color: #e9e9e9; font-weight: bold; text-align: center;">
                        {{ $label }}
                    </td>
                </tr>
                @foreach($items as $item)
                    <tr>
                        <td style="border: 1px solid #000; text-align: center;">{{ $global_index++ }}</td>
                        <td colspan="10" style="border: 1px solid #000;">{{ $item->title }}</td>
                        <td style="border: 1px solid #000; text-align: center;">{{ $year }}</td>
                        <td style="border: 1px solid #000;"></td>
                        <td colspan="3" style="border: 1px solid #000; text-align: center;">{{ $item->points }}</td>
                    </tr>
                @endforeach
            @endif
        @endforeach
    </tbody>
</table>