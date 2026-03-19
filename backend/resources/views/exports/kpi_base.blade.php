<table style="font-family: 'Times New Roman';font-size:12px; text-align:center;font-family: 'Times New Roman';text-align:center; width: 100%; border-collapse: collapse; font-family: 'Times New Roman'; font-size: 12px;">
    <thead>
        <tr>
            <th colspan="10" style="font-family: 'Times New Roman';font-size:12px; text-align:center;text-align: left; font-weight: bold; font-size: 12px; border: none; padding-bottom: 5px;">
                {{ $categoryTitle }}
            </th>
        </tr>
        
        <tr style="font-weight: bold; text-align: center;">
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Жұмыс түрлері/<br>Виды работ</td> {{-- Колонка 1 --}}
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Норма времени</td> {{-- Колонка 2 --}}
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Жұмыс атауы/<br>Наименование работ</td> {{-- Колонка 3 --}}
            <td colspan="4" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Еңбек сыйымдылығы (акад. сағат)</td> {{-- 4,5,6,7 --}}
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Есеп беру түрі</td> {{-- 8 --}}
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Орындалу мерзімі</td> {{-- 9 --}}
            <td rowspan="2" style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">Орындалу күні</td> {{-- 10 --}}
        </tr>
        <tr style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:centerfont-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;e;">количество</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:centerfont-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;e;">1-й период</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:centerfont-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;e;">количество</td>
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">2-й период</td>
        </tr>
        <tr style="background-color: #f0f0f0; text-align: center; font-weight: bold;">
            @foreach(range(1, 10) as $num) <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;">{{ $num }}</td> @endforeach
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
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 9 --}}
                <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> {{-- 10 --}}
            </tr>
        @endforeach

        {{-- Секция ИТОГО --}}
@php $footers = ['первый период', 'второй период', 'учебный год']; @endphp

@foreach($footers as $f)
    <tr>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:left;border: 1px solid black; vertical-align: middle;" rowspan="2">
            Бірінші {{ $f }}
        </td>
        
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;" colspan="2">
            запланировано
        </td>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;" colspan="4"></td>
        @for($i=0; $i<3; $i++) 
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> 
        @endfor
    </tr>
    <tr>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;" colspan="2">
            выполнено
        </td>
        <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;" colspan="4"></td>
        @for($i=0; $i<3; $i++) 
            <td style="font-family: 'Times New Roman';font-size:12px; text-align:center;border: 1px solid black; vertical-align: middle;"></td> 
        @endfor
    </tr>
@endforeach
    </tbody>
</table>