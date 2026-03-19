<table style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman'; font-size: 12px; text-align: center;">
    <thead>
        <tr>
            <th colspan="7" style="text-transform:uppercase;font-family: 'Times New Roman';font-size:12px; text-align:center;text-align: left; font-weight: bold; font-size: 12px; padding-bottom: 5px;">
                9. 2025 / 2026 ОҚУ ЖЫЛЫНДА ЖЕКЕ ЖОСПАРДЫ ОРЫНДАУ ҚОРЫТЫНДЫСЫ /<br>
                ИТОГИ ВЫПОЛНЕНИЯ ИНДИВИДУАЛЬНОГО ПЛАНА ЗА 2025 / 2026 УЧЕБНОГО ГОДА
            </th>
        </tr>
        <tr>
            <th colspan="7"></th>
        </tr>
        <tr>
            <th colspan="7" style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
                1 АКАДЕМИЯЛЫҚ КЕЗЕҢ / 1 АКАДЕМИЧЕСКИЙ ПЕРИОД
            </th>
        </tr>
        <tr style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">
            <th style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">рр/с<br>№<br>п/п</th>
            <th style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Жұмыс түрлері / Виды работ</th>
            <th style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Жоспар / План</th>
            <th style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Орындалған жоспар /<br>Фактическое выполнение</th>
            <th style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Орындалмауы /<br>Недовыполнение</th>
            <th style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Асыра орындалуы /<br>Перевыполнение</th>
            <th style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Себебі / Причина</th>
        </tr>
    </thead>
    <tbody>
        @php
            $rows = [
                ['id' => 1, 'name' => 'Оқу жұмысы / Учебная работа'],
                ['id' => 2, 'name' => 'Оқу-әдістемелік жұмыс / Учебно-методическая работа'],
                ['id' => 3, 'name' => 'Ұйымдастыру-әдістемелік жұмыс / Организационно-методическая работа'],
                ['id' => 4, 'name' => 'Ғылыми-зерттеу жұмысы / Научно-исследовательская работа'],
                ['id' => 5, 'name' => 'Тәрбие жұмыстары / Воспитательная работа'],
                ['id' => 6, 'name' => 'Кәсіптік бағдар беру жұмыстары / Профориентационная работа'],
                ['id' => 7, 'name' => 'Біліктілікті арттыру / Повышение квалификации'],
            ];
        @endphp

        @foreach($rows as $row)
        <tr>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">{{ $row['id'] }}</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;">{{ $row['name'] }}</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
        </tr>
        @endforeach

        <tr style="font-weight: bold;">
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;font-weight:bold;border: 1px solid black; vertical-align: middle;" colspan="2">Барлығы / Всего</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
        </tr>
    <tr>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;" colspan="7">

            Бірінші академиялық кезеңге оқытушының жеке жоспарын құрастыру және орындау туралы ескертулер /<br>
            Замечания по составлению и выполнению индивидуального плана преподавателем за первый академический период
        </td>
    </tr>

    <tr>
        <td colspan="1" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Күні / Дата</td>
        <td colspan="4" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Ескертулер мазмұны / Содержание замечаний</td>
        <td colspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Лауазымы, қолы / Должность и подпись</td>
    </tr>
    @for($i=0; $i<4; $i++)
    <tr>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical        <td colspan="4" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle; middle;"></td>
        <td colspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td>
    </tr>
    @endfor
        <tr style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
            <td colspan="7" style="font-family: 'Times New Roman';font-size:12px;text-align:left;vertical-align: middle;">
            </td>
        </tr>
      <tr style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
            <td colspan="3" style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
                Жеке жоспар кафедра отырысында талқыланды/<br>                        
                Индивидуальный план обсужден на заседании кафедры                                     
            </td>
            <td colspan="4" style="font-family: 'Times New Roman';font-size:11px; text-align:right;vertical-align: middle;">
            « ____ » __________ 20 ____ ж./г.      № ____   хаттама /протокол
            </td>
        </tr>
        <tr style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
            <td colspan="7" style="font-family: 'Times New Roman';font-size:12px;text-align:left;vertical-align: middle;">
            </td>
        </tr>
        <tr style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
            <td colspan="3" style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
                Кафедра меңгерушісі / Заведующий кафедрой                                     
            </td>
            <td colspan="4" style="font-family: 'Times New Roman';font-size:11px; text-align:right;vertical-align: middle;">
            Факультет деканы/ Декан факультета
            </td>
        </tr>
        <tr style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
            <td colspan="7" style="font-family: 'Times New Roman';font-size:12px;text-align:left;vertical-align: middle;">
            </td>
        </tr>
         <tr style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
            <td colspan="3" style="font-family: 'Times New Roman';font-size:11px; text-align:left;vertical-align: middle;">
                ____________________  _________________________
            </td>
            <td colspan="4" style="font-family: 'Times New Roman';font-size:11px; text-align:right;vertical-align: middle;">
                ____________________ Серимбетов Б.А.
            </td>
        </tr>
        <tr style="font-family: 'Times New Roman';font-size:12px; text-align:left;vertical-align: middle;">
            <td colspan="3" style="font-family: 'Times New Roman';font-size:11px; text-align:left;vertical-align: middle;">
                « ____ » _____________ 20 ____  ж./г.
            </td>
            <td colspan="4" style="font-family: 'Times New Roman';font-size:11px; text-align:right;vertical-align: middle;">
                « ____ » ___________ 20 ____  ж./г.
            </td>
        </tr>
</table>