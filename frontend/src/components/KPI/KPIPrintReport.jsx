import React from 'react';
import { Info, Printer, X, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const KPIPrintReport = ({ selectedItems, totalPoints, selectedYear, onClose }) => {
  
  const exportToExcel = () => {
    // 1. Подготовка данных (превращаем массив объектов в массив массивов для Excel)
    const header = [
      ["Қ. Құлажанов атындағы Қазақ технология және бизнес университеті"],
      [`ИНДИВИДУАЛЬНЫЙ ПЛАН РАБОТЫ (${selectedYear} учебный год)`],
      ["Преподаватель: Зейнолла Елнур"],
      [""], // Пустая строка для отступа
      ["№", "Индикатор", "Категория", "Баллы"] // Заголовки таблицы
    ];

    const rows = selectedItems.map((item, idx) => [
      idx + 1,
      item.title,
      item.category.toUpperCase(),
      item.points
    ]);

    const footer = [
      ["", "", "ИТОГО БАЛЛОВ:", totalPoints]
    ];

    // 2. Создание листа
    const ws = XLSX.utils.aoa_to_sheet([...header, ...rows, ...footer]);

    // 3. Настройка ширины колонок (чтобы текст не обрезался)
    ws['!cols'] = [
      { wch: 5 },  // №
      { wch: 60 }, // Индикатор
      { wch: 20 }, // Категория
      { wch: 10 }, // Баллы
    ];

    // 4. Создание книги и скачивание
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "KPI Report");
    
    // Имя файла: KPI_Report_2026_Zeynolla.xlsx
    XLSX.writeFile(wb, `KPI_Report_${selectedYear.replace('/', '-')}.xlsx`);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-[95%] max-h-[98vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          
          {/* Панель управления */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase">
                <Info size={14} /> Генерация документов
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* НОВАЯ КНОПКА EXCEL */}
              <button 
                onClick={exportToExcel}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
              >
                <FileSpreadsheet size={16} /> Скачать XLSX
              </button>

              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
              >
                <Printer size={16} /> Печать
              </button>

              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Область предпросмотра (остается без изменений для визуального контроля) */}
          <div className="flex-1 overflow-y-auto p-10 bg-slate-100 flex justify-center no-print">
            <div 
              id="printable-report" 
              className="bg-white text-black shadow-2xl p-[14mm] font-serif leading-tight"
              style={{ width: '297mm', minHeight: '210mm' }}
            >
              {/* Содержимое твоего текущего отчета... */}
              <h2 className="text-center font-bold text-lg">ПРЕДПРОСМОТР ПЕЧАТНОЙ ФОРМЫ</h2>
              <p className="text-center text-gray-400 text-sm mt-2">Экспорт в Excel сохранит структуру таблицы данных</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KPIPrintReport;