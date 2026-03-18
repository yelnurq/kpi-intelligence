<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body style="font-family: 'Times New Roman', serif; font-size: 12px;">
    <table style="border-collapse: collapse; width: 100%;">
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
        <tr style="height: 70px;">
            <td colspan="7" style="text-align: center; font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">
                «Қ. Құлажанов атындағы Қазақ технология және бизнес университеті» Акционерлік қоғамы
            </td>
            <td colspan="2" style="text-align: center; vertical-align: middle;">
                <img src="{{asset("images/icons/logo.png")}}" style="height: 100px" alt="">
            </td>
            <td colspan="7" style="text-align: center; font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">
                Акционерное общество «Казахский университет технологии и бизнес им. К.Кулажанова»
            </td>
        </tr>

        {{-- Строка 5: Пустая --}}
        <tr><td colspan="16" style="height: 10px;"></td></tr>

        {{-- Строка 6: Факультет с линиями сверху и снизу --}}
        <tr>
            <td colspan="16" style="text-align: center; font-weight: bold; border-top: 1px solid #000; border-bottom: 1px solid #000; height: 30px; vertical-align: middle; font-family: 'Times New Roman';">
                Факультет инжиниринга и информационных технологий/ Инжиниринг және ақпараттық технологиялар факультеті
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
            <td colspan="3" style="border-bottom: 1px solid #000;"></td>
            <td colspan="3" style="font-weight: bold; text-align: left; vertical-align: bottom; font-family: 'Times New Roman';">Серимбетов Б.А.</td>
        </tr>
        <tr>
            <td colspan="10"></td>
            <td colspan="6" style="text-align: right; font-family: 'Times New Roman';">«____» ____________ 2025 ж./г.</td>
        </tr>

        {{-- Центральный заголовок --}}
        <tr><td colspan="16" style="height: 40px;"></td></tr>
        <tr>
            <td colspan="16" style="text-align: center; font-weight: bold; font-size: 14px; font-family: 'Times New Roman';">ОҚЫТУШЫНЫҢ ЖЕКЕ ЖҰМЫС ЖОСПАРЫ/</td>
        </tr>
        <tr>
            <td colspan="16" style="text-align: center; font-weight: bold; font-size: 14px; font-family: 'Times New Roman';">ИНДИВИДУАЛЬНЫЙ ПЛАН РАБОТЫ</td>
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
            <td colspan="8" style="vertical-align: middle; font-family: 'Times New Roman';">Аты-жөні, тегі/ Фамилия, имя, отчество</td>
            <td colspan="8" style="font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">{{ $user->name ?? 'Рыстыгулова Венера Ботабаевна' }}</td>
        </tr>
        <tr style="height: 30px;">
            <td colspan="8" style="vertical-align: middle; font-family: 'Times New Roman';">Ғылыми дәрежесі, атағы/ Ученая (академическая) степень, ученое звание</td>
            <td colspan="8" style="font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">кандидат ф.-м. наук</td>
        </tr>
        <tr style="height: 30px;">
            <td colspan="8" style="vertical-align: middle; font-family: 'Times New Roman';">Кафедра</td>
            <td colspan="8" style="font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">Ақпараттық технологиялар</td>
        </tr>
        <tr style="height: 30px;">
            <td colspan="8" style="vertical-align: middle; font-family: 'Times New Roman';">Лауазымы/ Должность</td>
            <td colspan="8" style="font-weight: bold; vertical-align: middle; font-family: 'Times New Roman';">Профессор</td>
        </tr>
        <tr style="height: 30px;">
            <td colspan="8" style="vertical-align: middle; font-family: 'Times New Roman';">Оқытушының қолы/ Подпись преподавателя</td>
            <td colspan="8" style="border-bottom: 1px solid #000; vertical-align: middle;"></td>
        </tr>

        {{-- Футер --}}
        <tr><td colspan="16" style="height: 60px;"></td></tr>
        <tr>
            <td colspan="16" style="text-align: center; font-weight: bold; font-family: 'Times New Roman';">Астана, 2025</td>
        </tr>
    </table>
</body>
</html>