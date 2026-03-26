<table style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; width: 100%; border-collapse: collapse; font-family: 'Times New Roman'; font-size: 12px;">
<thead style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman'; text-align:center; font-size: 10px;">
    <tr>
        <th colspan="8" style="font-family: 'Times New Roman';font-size:12px; text-align:center;text-align: left; font-weight: bold; font-size: 12px; border: none; padding-bottom: 5px;">
            1 ОҚУ ЖҰМЫСЫ / УЧЕБНАЯ РАБОТА
        </th>
    </tr>
    <tr><td colspan="1"></td></tr>
 <tr>
        <th colspan="8" style="font-family: 'Times New Roman';border:1px solid black;font-size:12px; text-align:center;text-align: left; font-weight: bold; font-size: 12px; border: none; padding-bottom: 5px;">
            1.1 Жиынтық деректер/ Сводные данные

        </th>
    </tr>
    <tr style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-weight: bold;">
        <td rowspan="4" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">p/c № п/п</td>
        <td rowspan="4" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Жұмыс түрлері / Виды работ</td>
        <td colspan="6" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">Оқу жүктемесі, академиялық сағатта/ Учебная нагрузка, в академических часах</td>
    </tr>

    <tr style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-weight: bold;">
        <td colspan="4" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">академиялық кезең бойынша/ за академический период</td>
        <td colspan="2" rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">оқу жылы бойынша/ за учебный год</td>
    </tr>

    <tr style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-weight: bold;">
        <td colspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">бірінші/ первый</td>
        <td colspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">екінші/ второй</td>
    </tr>

    <tr style="font-family: 'Times New Roman';font-size:10px; text-align:center;font-weight: bold;">
        <td style="font-family: 'Times New Roman';font-size:10px; text-align:center;border: 1px solid black;">жоспарланған/ запланировано</td>
        <td style="font-family: 'Times New Roman';font-size:10px; text-align:center;border: 1px solid black;">орындалған/ выполнено</td>
        <td style="font-family: 'Times New Roman';font-size:10px; text-align:center;border: 1px solid black;">жоспарланған/ запланировано</td>
        <td style="font-family: 'Times New Roman';font-size:10px; text-align:center;border: 1px solid black;">орындалған/ выполнено</td>
        <td style="font-family: 'Times New Roman';font-size:10px; text-align:center;border: 1px solid black;">жоспарланған/ запланировано</td>
        <td style="font-family: 'Times New Roman';font-size:10px; text-align:center;border: 1px solid black;">орындалған/ выполнено</td>
    </tr>

    <tr style="font-family: 'Times New Roman';font-size:12px; text-align:center;background-color: #f0f0f0; font-weight: bold;">
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">1</td>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">2</td>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">3</td>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">4</td>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">5</td>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">6</td>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">7</td>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black;">8</td>
    </tr>
</thead>
    <tbody>
        @foreach($items as $index => $item)
        <tr>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black; text-align: center;">{{ $index + 1 }}</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:left; border: 1px solid black; padding-left: 5px;">{{ $item->title }}</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black; text-align: center; font-weight: bold;">
            </td>
        </tr>
        @endforeach

        <tr style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; font-weight: bold; background-color: #f9f9f9;">
            <td colspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black; text-align: right; padding-right: 10px;">Барлығы/ Итого:</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; border: 1px solid black; text-align: center;"></td>
        </tr>
    </tbody>
</table>