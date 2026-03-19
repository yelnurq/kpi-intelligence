<table style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; width: 100%; border-collapse: collapse; font-family: 'Times New Roman'; font-size: 12px;">
    <thead>
        <tr>
            <th colspan="8" style="text-transform:uppercase;font-family: 'Times New Roman';font-size:12px; text-align:center;text-align: left; font-weight: bold; font-size: 12px; border: 1px solid black; padding-bottom: 5px;">
                7. БІЛІКТІЛІКТІ АРТТЫРУ / ПОВЫШЕНИЕ КВАЛИФИКАЦИИ
            </th>
        </tr>
        
        <tr style="font-weight: bold; text-align: center;">
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Біліктілікті арттыру түрі және атауы (курстар, тренингтер, семинарлар, тағылымдама  және тақырыбы)/ 
Вид повышения квалификации и название (курсы, тренинги, семинары, стажировка и тема)
</td> 
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Норма времени для расчета нагрузки (часах)</td> 
            <td colspan="4" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Еңбек сыйымдылығы, академиялық сағаттар/ Трудоемкость, академических часов</td> {{-- 4,5,6,7 --}}
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Орындалу мерзімі (орындалмау себебі)/ Сроки выполнения (причина невыполнения)</td>
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Есеп беру түрі (диплом, сертификат, грамоталар, № және берілген күні)/ Вид отчетности (диплом, сертификат, грамоты, № и дата выдачи)</td>
        </tr>
        <tr style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:centerfont-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;e;">количество</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:centerfont-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;e;">Бірінші академиялық кезең/первый академический период</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:centerfont-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;e;">количество</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:centerfont-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;e;">Екінші академиялық кезең/второй академический период</td>

        </tr>
        
    </thead>
    <tbody>
        @foreach($items as $index => $item)
            <tr>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;">{{ $item->title }}</td> {{-- 3. НАЗВАНИЕ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 1. Виды работ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 2. Норма --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 4 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 5 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 6 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 7 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 8 --}}
            </tr>
        @endforeach

        <tr>
                <td style="font-weight:bold;font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;" rowspan="2">
                    Оқу жылы бойынша барлығы/ 
                        Итого за учебный год
                </td>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;"></td>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;" colspan="2"></td>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;" colspan="2"></td>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;"></td>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;"></td>
            </tr>  
   <tr>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;"></td> {{-- 3. НАЗВАНИЕ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 1. Виды работ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 2. Норма --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 4 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 5 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 6 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 7 --}}
            </tr> 
            
             <tr>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;"></td> {{-- 3. НАЗВАНИЕ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 1. Виды работ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 2. Норма --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 4 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 4 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 5 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 6 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 7 --}}
            </tr> 
<tr>
                <td colspan="6" style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;">
                    Жеке жоспар кафедра отырысында талқыланды/<br>                    
                    Индивидуальный план обсужден на заседании кафедры                                     
                </td>
                <td colspan="2" style="font-family: 'Times New Roman';font-size:11px; text-align:right;border: 1px solid black; vertical-align: bottom;">« ____ » ____________ 20 ____ ж./г.        № ____  хаттама /протокол</td>
            </tr>       
       <tr>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;"></td> {{-- 3. НАЗВАНИЕ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 1. Виды работ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 2. Норма --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 4 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 5 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 6 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 7 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 8 --}}
            </tr> 
            <tr>
                <td colspan="6" style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;">
                    Кафедра меңгерушісі / Заведующий кафедрой 
                </td>
                <td colspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:right;border: 1px solid black; vertical-align: middle;">Факультет деканы / Декан факультета</td>
            </tr>  
           <tr>
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;"></td> {{-- 3. НАЗВАНИЕ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 1. Виды работ --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 2. Норма --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 4 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 5 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 6 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 7 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 8 --}}
            </tr> 
            <tr>
                <td colspan="6" style="font-family: 'Times New Roman';font-size:11px; text-align:left;border: 1px solid black; vertical-align: middle;">
                    ____________________   ___________________________
                </td>
                <td colspan="2" style="font-family: 'Times New Roman';font-size:11px; text-align:right;border: 1px solid black; vertical-align: bottom;">
                    ____________________ Серимбетов Б.А.
                </td>
            </tr>  
            <tr>
                <td colspan="6" style="font-family: 'Times New Roman';font-size:11px; text-align:left;border: 1px solid black; vertical-align: middle;">
                    « ____ » ______________  20 ____ ж./г.
                </td>
                <td colspan="2" style="font-family: 'Times New Roman';font-size:11px; text-align:right;border: 1px solid black; vertical-align: bottom;">
                    « ____ » ____________  20 ____ ж./г.
                </td>
            </tr>  
    </tbody>
</table>