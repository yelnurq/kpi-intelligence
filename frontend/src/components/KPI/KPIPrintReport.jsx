import React from 'react';
import { Info, Printer, X } from 'lucide-react';

const KPIPrintReport = ({ selectedItems, totalPoints, selectedYear, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Элемент предпросмотра на экране */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm no-print">
        <div className="bg-white w-[95%] h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Панель управления (не печатается) */}
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Info size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Предпросмотр отчета</h3>
                <p className="text-xs text-slate-500">Формат А4, Альбомная ориентация</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <Printer size={18} /> Печать
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Область предпросмотра */}
          <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center">
            <div id="printable-content" className="report-paper shadow-xl">
              <ReportContent 
                selectedItems={selectedItems} 
                totalPoints={totalPoints} 
                selectedYear={selectedYear} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Стили для печати */}
      <style>{`
        /* Контейнер листа в браузере */
        .report-paper {
          background: white;
          width: 297mm;
          min-height: 210mm;
          padding: 20mm;
          color: black;
          font-family: "Times New Roman", serif;
        }

        @media print {
          /* Скрываем вообще всё на странице */
          body * {
            visibility: hidden !important;
          }

          /* Показываем только наш отчет */
          #printable-content, #printable-content * {
            visibility: visible !important;
          }

          /* Вырываем отчет из потока и ставим в начало страницы */
          #printable-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            visibility: visible !important;
          }

          @page {
            size: A4 landscape;
            margin: 0;
          }

          /* Отключаем фон браузера, чтобы были видны наши таблицы */
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

// Вынес контент в отдельный компонент для чистоты
const ReportContent = ({ selectedItems, totalPoints, selectedYear }) => (
  <div className="text-black">
    {/* Шапка по ГОСТу */}
    <div className="flex justify-between items-start mb-6 text-[11pt]">
      <div className="w-[45%] text-center font-bold uppercase">
        АО «Казахский университет технологии и бизнеса им. К. Кулажанова»
      </div>
      <div className="text-right italic">
        Утверждено на заседании Ученого совета<br/>
        Протокол №___ от «___» ________ 2026 г.
      </div>
    </div>

    <div className="text-center my-12">
      <h1 className="text-[16pt] font-bold uppercase mb-2">Индивидуальный план KPI</h1>
      <p className="text-[14pt]">на {selectedYear} учебный год</p>
    </div>

    {/* Данные преподавателя */}
    <div className="mb-10 space-y-2 text-[12pt]">
      <div className="flex border-b border-dotted border-black">
        <span className="w-48 font-semibold">Преподаватель:</span>
        <span>Зейнолла Елнур</span>
      </div>
      <div className="flex border-b border-dotted border-black">
        <span className="w-48 font-semibold">Кафедра:</span>
        <span>Информационные технологии</span>
      </div>
      <div className="flex border-b border-dotted border-black">
        <span className="w-48 font-semibold">Должность:</span>
        <span>Fullstack разработчик / Преподаватель</span>
      </div>
    </div>

    {/* Таблица индикаторов */}
    <table className="w-full border-collapse border-2 border-black text-[10pt]">
      <thead>
        <tr className="bg-gray-50 text-center">
          <th className="border-2 border-black p-2 w-10">№</th>
          <th className="border-2 border-black p-2 text-left">Наименование индикатора</th>
          <th className="border-2 border-black p-2 w-32">Категория</th>
          <th className="border-2 border-black p-2 w-24">Баллы</th>
        </tr>
      </thead>
      <tbody>
        {selectedItems.map((item, index) => (
          <tr key={item.id}>
            <td className="border border-black p-2 text-center">{index + 1}</td>
            <td className="border border-black p-2">{item.title}</td>
            <td className="border border-black p-2 text-center">{item.category}</td>
            <td className="border border-black p-2 text-center font-bold">{item.points}</td>
          </tr>
        ))}
        <tr className="bg-gray-100 font-bold">
          <td colSpan="3" className="border-2 border-black p-2 text-right uppercase">Итого запланировано:</td>
          <td className="border-2 border-black p-2 text-center text-lg">{totalPoints}</td>
        </tr>
      </tbody>
    </table>

    {/* Подписи */}
    <div className="mt-20 flex justify-between text-[11pt]">
      <div className="text-center">
        <div className="border-b border-black w-48 mb-1"></div>
        <span>Подпись преподавателя</span>
      </div>
      <div className="text-center">
        <div className="border-b border-black w-48 mb-1"></div>
        <span>Зав. кафедрой</span>
      </div>
      <div className="text-center">
        <div className="border-b border-black w-48 mb-1"></div>
        <span>Декан факультета</span>
      </div>
    </div>
  </div>
);

export default KPIPrintReport;