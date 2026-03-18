<table style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman'; font-size: 10px;">
    <thead>
        {{-- Заголовок раздела --}}
        <tr>
            <th colspan="8" style="font-weight: bold; text-align: left; font-size: 12px; padding-bottom: 5px;">
                1 ОҚУ ЖҰМЫСЫ / УЧЕБНАЯ РАБОТА
            </th>
        </tr>
        
        {{-- Многоуровневая шапка из ваших скриншотов --}}
        <tr style="background-color: #ffffff; text-align: center; font-weight: bold;">
            <td rowspan="3" style="border: 1px solid black; width: 40px;">p/c № п/п</td>
            <td rowspan="3" style="border: 1px solid black; width: 350px;">Жұмыс түрлері / Виды работ</td>
            <td colspan="6" style="border: 1px solid black;">Оқу жүктемесі, академиялық сағатта / Учебная нагрузка, в академических часах</td>
        </tr>
        <tr style="font-weight: bold; text-align: center;">
            <td colspan="2" style="border: 1px solid black;">академиялық кезең бойынша / за академический период</td>
            <td colspan="2" style="border: 1px solid black;">екінші / второй</td>
            <td colspan="2" style="border: 1px solid black;">оқу жылы бойынша / за учебный год</td>
        </tr>
        <tr style="font-weight: bold; text-align: center;">
            <td style="border: 1px solid black;">бірінші / первый</td>
            <td style="border: 1px solid black;">орындалған / выполнено</td>
            <td style="border: 1px solid black;">жоспарланған / запланировано</td>
            <td style="border: 1px solid black;">орындалған / выполнено</td>
            <td style="border: 1px solid black;">жоспарланған / запланировано</td>
            <td style="border: 1px solid black;">орындалған / выполнено</td>
        </tr>
        
        {{-- Техническая строка с номерами колонок (1-8) --}}
        <tr style="text-align: center; background-color: #f0f0f0; font-weight: bold;">
            <td style="border: 1px solid black;">1</td>
            <td style="border: 1px solid black;">2</td>
            <td style="border: 1px solid black;">3</td>
            <td style="border: 1px solid black;">4</td>
            <td style="border: 1px solid black;">5</td>
            <td style="border: 1px solid black;">6</td>
            <td style="border: 1px solid black;">7</td>
            <td style="border: 1px solid black;">8</td>
        </tr>
    </thead>

    <tbody>
        @php
            $categories = [
                'учеб.работа' => '1.1 Жиынтық деректер (Оқу жұмысы)',
                'учебно-методическая работа' => '2. ОҚУ-ӘДІСТЕМЕЛІК ЖҰМЫС / УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА',
                'научно-исследовательская работа' => '3. ҒЫЛЫМИ-ЗЕРТТЕУ ЖҰМЫСЫ / НАУЧНО-ИССЛЕДОВАТЕЛЬСКАЯ РАБОТА',
                'воспитательная работа' => '4. ТӘРБИЕ ЖҰМЫСЫ / ВОСПИТАТЕЛЬНАЯ РАБОТА'
            ];
            $globalIdx = 1;
        @endphp

        @foreach($categories as $key => $title)
            @php $items = $selectedItems->where('category', $key); @endphp

            @if($items->isNotEmpty())
                {{-- Разделитель категории --}}
                <tr style="background-color: #e9e9e9; font-weight: bold;">
                    <td colspan="8" style="border: 1px solid black; padding: 5px; text-align: left;">
                        {{ $title }}
                    </td>
                </tr>

                @foreach($items as $item)
                <tr>
                    <td style="border: 1px solid black; text-align: center;">{{ $globalIdx++ }}</td>
                    <td style="border: 1px solid black; padding-left: 5px;">{{ $item->title }}</td>
                    {{-- Колонки 3-8 (пустые для заполнения вручную или из данных) --}}
                    <td style="border: 1px solid black; text-align: center;"></td>
                    <td style="border: 1px solid black; text-align: center;"></td>
                    <td style="border: 1px solid black; text-align: center;"></td>
                    <td style="border: 1px solid black; text-align: center;"></td>
                    <td style="border: 1px solid black; text-align: center;"></td>
                    <td style="border: 1px solid black; text-align: center; font-weight: bold;">
                        {{ $item->points }} {{-- Баллы выводим в последнюю колонку --}}
                    </td>
                </tr>
                @endforeach

                {{-- Итого по разделу --}}
                <tr style="font-weight: bold; background-color: #f9f9f9;">
                    <td colspan="2" style="border: 1px solid black; text-align: right; padding-right: 10px;">Барлығы / ИТОГО:</td>
                    <td style="border: 1px solid black;"></td>
                    <td style="border: 1px solid black;"></td>
                    <td style="border: 1px solid black;"></td>
                    <td style="border: 1px solid black;"></td>
                    <td style="border: 1px solid black;"></td>
                    <td style="border: 1px solid black; text-align: center;">{{ $items->sum('points') }}</td>
                </tr>
            @endif
        @endforeach
    </tbody>
</table>