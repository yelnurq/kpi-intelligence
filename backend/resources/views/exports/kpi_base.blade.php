<table style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; width: 100%; border-collapse: collapse; font-family: 'Times New Roman'; font-size: 12px;">
<thead style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman'; text-align:center; font-size: 10px;">
        <tr>
            <th colspan="8" style="font-family: 'Times New Roman';border:1px solid black;font-size:12px; text-align:center;text-align: left; font-weight: bold; font-size: 12px; border: none; padding-bottom: 5px;">
                {{ $categoryTitle }}
            </th>
        </tr>
        
        <tr style="font-weight: bold; text-align: center;">
            <td rowspan="4" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Жұмыс түрлері/ Виды работ</td>
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Норма времени (часах)</td>
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Жұмыс атауы/ Наименование работ</td>
            <td colspan="4" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Еңбек сыйымдылығы, академиялық сағаттар/ Трудоемкость, акад. часов</td>
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Есеп беру түрі/ Вид отчетности</td>
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Орындалу мерзімі/ Срок выполнения</td>
        </tr>
        <tr style="font-weight: bold; text-align: center;">
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">количество</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">1-й период</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">количество</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">2-й период</td>
        </tr>
        <tr style="background-color: #f0f0f0; text-align: center; font-weight: bold;">
            @foreach(range(1, 10) as $num) <td style="border: 1px solid black;">{{ $num }}</td> @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach($items as $index => $item)
            <tr>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">{{ $item->title }}</td> {{-- Название из БД --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- Виды работ (пусто) --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- Норма времени (пусто) --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
            </tr>
        @endforeach

        {{-- Секция ИТОГО --}}
        <tr>
            <td colspan="3" rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">
                Бірінші академиялық кезең бойынша барлығы/ Итого за первый академический период
            </td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">жоспарланған/ запланировано</td>
            <td colspan="6" style="border: 1px solid black;"></td>
        </tr>
        <tr>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">орындалған/ выполнено</td>
            <td colspan="6" style="border: 1px solid black;"></td>
        </tr>

        <tr>
            <td colspan="3" rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">
                Екінші академиялық кезең бойынша барлығы/ Итого за второй академический период
            </td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">жоспарланған/ запланировано</td>
            <td colspan="6" style="border: 1px solid black;"></td>
        </tr>
        <tr>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">орындалған/ выполнено</td>
            <td colspan="6" style="border: 1px solid black;"></td>
        </tr>

        <tr>
            <td colspan="3" rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">
                Оқу жылына барлығы/ Итого за учебный год
            </td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">жоспарланған/ запланировано</td>
            <td colspan="6" style="border: 1px solid black;"></td>
        </tr>
        <tr>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">орындалған/ выполнено</td>
            <td colspan="6" style="border: 1px solid black;"></td>
        </tr>
    </tbody>
</table>