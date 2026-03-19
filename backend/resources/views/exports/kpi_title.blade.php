    <table style="border-collapse: collapse; width: 100%;font-family: 'Times New Roman', serif; font-size: 12px;">
        {{-- Строка 1: Пустая --}}
        <tr><td colspan="16" style="height: 15px;"></td></tr>

        {{-- Строка 2: Шифр документа справа --}}
        <tr>
            <td colspan="10"></td>
            <td colspan="6" style="text-align: right; font-weight: bold; font-family: 'Times New Roman';">Ф.УОП.8.3/8.1-2025-05-02</td>
        </tr>

        {{-- Строка 3: Пустая --}}
        <tr><td colspan="16" style="height: 15px;"></td></tr>

        {{-- Строка 4: Высокая шапка с Университетом --}}
        <tr style="height: 110px;">
    {{-- Университет слева (6 колонок: A, B, C, D, E, F) --}}
    <td colspan="6" style="height:110px;white-space: normal; text-align: center; font-size: 12px; font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">
        «Қ. Құлажанов атындағы Қазақ технология және бизнес университеті» <br>Акционерлік қоғамы
    </td>

    {{-- Ячейка под лого (3 колонки: G, H, I) --}}
    <td colspan="3" style="height:110px;text-align: center; vertical-align: middle;">
        {{-- В Excel-экспорте тег <img> часто игнорируется или дублируется, 
             поэтому здесь оставляем пустое место, куда "наложится" drawing из PHP --}}
    </td>

    {{-- Университет справа (7 колонок: J, K, L, M, N, O, P) --}}
    <td colspan="7" style="height:110px;white-space: normal; text-align: center; font-size: 12px; font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">
        Акционерное общество<br> «Казахский университет технологии и бизнес им. К.Кулажанова»
    </td>
</tr>

        {{-- Строка 5: Пустая --}}
        <tr><td colspan="16" style="height: 10px;"></td></tr>

        {{-- Строка 6: Факультет с линиями сверху и снизу --}}
        <tr>
            <td colspan="16" style="text-align: center; font-weight: bold;   height: 30px; vertical-align: middle; font-family: 'Times New Roman';">
                {{$user->department->title}}
            </td>
        </tr>

        {{-- Отступ перед Утверждаю --}}
        <tr><td colspan="16" style="height: 30px;"></td></tr>

        {{-- Блок Утверждения --}}
        <tr>
            <td colspan="10"></td>
            <td colspan="6" style="text-align: right; font-weight: bold; font-family: 'Times New Roman';">БЕКІТЕМІН / УТВЕРЖДАЮ</td>
        </tr>
        <tr>
            <td colspan="10"></td>
        </tr>
        <tr>
            <td colspan="10"></td>
            <td colspan="6" style="text-align: right; font-family: 'Times New Roman';">Факультет деканы/ Декан факультета</td>
        </tr>
        <tr>
            <td colspan="10"></td>
            <td colspan="6" style="font-weight: bold; text-align: right; font-family: 'Times New Roman';">{{'______________'. $user->department->short_name}}</td>
        </tr>
        <tr>
            <td colspan="10"></td>
            <td colspan="6" style="font-weight: bold; text-align: right; font-family: 'Times New Roman';">«____» ____________ 2026 ж./г.</td>
        </tr>

        {{-- Центральный заголовок --}}
        <tr><td colspan="16" style="height: 40px;"></td></tr>
        <tr>
            <td colspan="16" style="text-align: center; font-weight: bold; font-size: 12px; font-family: 'Times New Roman';">ОҚЫТУШЫНЫҢ ЖЕКЕ ЖҰМЫС ЖОСПАРЫ/</td>
        </tr>
        <tr>
            <td colspan="16" style="text-align: center; font-weight: bold; font-size: 12px; font-family: 'Times New Roman';">ИНДИВИДУАЛЬНЫЙ ПЛАН РАБОТЫ</td>
        </tr>
        <tr>
            <td colspan="16" style="text-align: center; font-weight: bold; font-family: 'Times New Roman';">2025 / 2026 оқу жылы / учебный год</td>
        </tr>

        <tr><td colspan="16" style="height: 15px;"></td></tr>
        <tr>
            <td colspan="16" style="text-align: center; font-family: 'Times New Roman';">1 ставка</td>
        </tr>

        {{-- Данные преподавателя --}}
        <tr style="height: 30px;">
            <td colspan="9" style="vertical-align: middle; font-family: 'Times New Roman';">Аты-жөні, тегі/ Фамилия, имя, отчество</td>
            <td colspan="7" style="font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">{{ $user->name}}</td>
        </tr>
        <tr style="height: 30px;">
            <td colspan="9" style="vertical-align: middle; font-family: 'Times New Roman';">Ғылыми дәрежесі, атағы/ Ученая (академическая) степень, ученое звание</td>
            <td colspan="7" style="font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">{{ $user->academic_degree->title}}</td>
        </tr>
        <tr style="height: 30px;">
            <td colspan="9" style="vertical-align: middle; font-family: 'Times New Roman';">Кафедра</td>
            <td colspan="7" style="font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">Ақпараттық технологиялар</td>
        </tr>
        <tr style="height: 30px;">
            <td colspan="9" style="vertical-align: middle; font-family: 'Times New Roman';">Лауазымы/ Должность</td>
            <td colspan="7" style="font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">{{ $user->position->title}}</td>
        </tr>
        <tr style="height: 30px;">
            <td colspan="9" style="vertical-align: middle; font-family: 'Times New Roman';">Оқытушының қолы/ Подпись преподавателя</td>
            <td colspan="7" style=" vertical-align: middle;">_______________________</td>
        </tr>

        {{-- Футер --}}
        <tr><td colspan="16" style="height: 60px;"></td></tr>
        <tr>
            <td colspan="16" style="text-align: center; font-weight: bold; font-family: 'Times New Roman';">Астана, 2026</td>
        </tr>

        
    </table>
