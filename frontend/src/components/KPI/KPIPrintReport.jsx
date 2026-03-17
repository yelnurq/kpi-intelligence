import React from 'react';
import { Info, Printer, X } from 'lucide-react';

const KPIPrintReport = ({ selectedItems, totalPoints, selectedYear, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm ">
        <div className="bg-white w-full max-w-[95%] max-h-[98vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          
          {/* Панель управления (не печатается) */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">
                <Info size={14} /> ТИТУЛЬНЫЙ ЛИСТ ПО ГОСТУ
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                <Printer size={16} /> Печать (Альбомная)
              </button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Область предпросмотра */}
          <div className="flex-1 overflow-y-auto p-10 bg-slate-100 flex justify-center no-print">
            <div 
              id="printable-report" 
              className="bg-white text-black shadow-2xl print:shadow-none print:border-none"
              style={{ 
                width: '297mm', 
                minHeight: '210mm', 
                padding: '14mm 10mm 14mm 13mm',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: '1.2'
              }}
            >
              {/* ВЕРХНЯЯ ЧАСТЬ (Шифр документа) */}
              <div className="flex justify-end mb-1">
                <span className="text-[11px] font-bold">Ф.УОП.8.3/8.1-2025-05-02</span>
              </div>

              {/* ШАПКА: ЛОГО И НАЗВАНИЕ */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="w-[40%] text-[12px] font-bold text-center leading-tight uppercase">
                  «Қ. Құлажанов атындағы Қазақ технология және бизнес университеті» <br /> Акционерлік қоғамы
                </div>
                <div className="min-w-[45px] h-12 flex items-center justify-center overflow-hidden">
                  <img src="images/icons/logo.png" alt="Logo" className="h-full w-full object-contain" />
                </div>
                <div className="w-[40%] text-[12px] font-bold text-center leading-tight uppercase">
                  Акционерное общество <br /> «Казахский университет технологии и бизнеса им. К.Кулажанова»
                </div>
              </div>

              {/* НАЗВАНИЕ ФАКУЛЬТЕТА */}
              <div className="text-center text-[12px] font-bold uppercase border-t border-b border-black py-2 mb-10">
                Факультет инжиниринга и информационных технологий / Инжиниринг және ақпараттық технологиялар факультеті
              </div>

              {/* БЛОК УТВЕРЖДЕНИЯ */}
              <div className="flex justify-end mb-16">
                <div className="w-[300px] text-[13px] leading-snug">
                  <p className="font-bold text-right mb-4">БЕКІТЕМІН / УТВЕРЖДАЮ</p>
                  <p className="text-right">Факультет деканы/ Декан факультета</p>
                  <div className="flex justify-end items-end gap-2 mt-4">
                    <div className="border-b border-black w-[150px]"></div>
                    <p className="font-bold">Серимбетов Б.А.</p>
                  </div>
                  <p className="text-right mt-1">«____» ____________ 2026 ж./г.</p>
                </div>
              </div>

              {/* ЦЕНТРАЛЬНЫЙ ЗАГОЛОВОК */}
              <div className="text-center mb-10">
                <h1 className="text-[15px] font-bold uppercase leading-tight">
                  ОҚЫТУШЫНЫҢ ЖЕКЕ ЖҰМЫС ЖОСПАРЫ / <br />
                  ИНДИВИДУАЛЬНЫЙ ПЛАН РАБОТЫ
                </h1>
                <p className="text-[15px] font-bold mt-1">{selectedYear} оқу жылы / учебный год</p>
                <p className="text-[12px] mt-4">1 ставка</p>
              </div>

              {/* ТАБЛИЦА ДАННЫХ ПРЕПОДАВАТЕЛЯ */}
              <div className="text-[13px] w-full">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="align-bottom">
                      <td className="w-[450px] pb-2">Аты-жөні, тегі/ Фамилия, имя, отчество</td>
                      <td className="font-bold pb-2 border-b border-black uppercase text-[12px]">Зейнолла Елнур</td>
                    </tr>
                    <tr className="align-bottom">
                      <td className="pt-3 pb-2">Ғылыми дәрежесі, атағы/ Ученая (академическая) степень, ученое звание</td>
                      <td className="font-bold pb-2 border-b border-black uppercase text-[12px]">Fullstack Developer</td>
                    </tr>
                    <tr className="align-bottom">
                      <td className="pt-3 pb-2">Кафедра</td>
                      <td className="font-bold pb-2 border-b border-black uppercase text-[12px]">Ақпараттық технологиялар</td>
                    </tr>
                    <tr className="align-bottom">
                      <td className="pt-3 pb-2">Лауазымы/ Должность</td>
                      <td className="font-bold pb-2 border-b border-black uppercase text-[12px]">Оқытушы</td>
                    </tr>
                    <tr className="align-bottom">
                      <td className="pt-3 pb-2">Оқытушының қолы/ Подпись преподавателя</td>
                      <td className="pb-2 border-b border-black h-[40px]"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ГОРОД (ВНИЗУ) */}
              <div className="mt-10 text-center font-bold text-[13px]">
                Астана, 2026
              </div>

              {/* ВТОРАЯ СТРАНИЦА (Сама таблица KPI) */}
              <div className="page-break"></div>
              <h2 className="text-center font-bold text-sm mb-6 uppercase">Запланированные показатели KPI</h2>
              <table className="w-full text-[11px] border-collapse border border-black">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-2 w-10">№</th>
                    <th className="border border-black p-2 text-left uppercase">Индикатор</th>
                    <th className="border border-black p-2 uppercase">Категория</th>
                    <th className="border border-black p-2 w-20 uppercase">Баллы</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="border border-black p-2 text-center">{idx + 1}</td>
                      <td className="border border-black p-2">{item.title}</td>
                      <td className="border border-black p-2 text-center uppercase">{item.category}</td>
                      <td className="border border-black p-2 text-center font-bold">{item.points}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan="3" className="border border-black p-2 text-right uppercase">ИТОГО БАЛЛОВ:</td>
                    <td className="border border-black p-2 text-center text-blue-700">{totalPoints}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

 <style dangerouslySetInnerHTML={{ __html: `
  @media print {
    /* 1. Скрываем корень приложения и все фиксированные элементы (модалки, уведомления) */
    #root, 
    body > div:not(.print-priority) {
      display: none !important;
    }

    /* 2. Делаем наш отчет видимым и вырываем его из всех контейнеров */
    #printable-report {
      display: block !important;
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 297mm !important; /* Фиксируем ширину под A4 альбомную */
      margin: 0 !important;
      padding: 14mm 10mm 14mm 13mm !important;
      background: white !important;
      z-index: 10000 !important;
    }

    /* 3. Гарантируем, что все внутренние элементы отчета видны */
    #printable-report * {
      display: inherit;
    }

    /* 4. Специфические фиксы для таблиц */
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      table-layout: auto !important;
    }
    
    th, td {
      border: 1px solid black !important;
    }

    /* Скрываем ненужные элементы предпросмотра внутри отчета */
    .no-print {
      display: none !important;
    }

    @page {
      size: A4 landscape;
      margin: 0;
    }
  }

  /* Стили для экрана (чтобы ты видел лист в модалке) */
  @media screen {
    #printable-report {
      width: 297mm;
      min-height: 210mm;
      background: white;
      margin: 0 auto;
    }
  }
`}} />
    </>
  );
};

export default KPIPrintReport;