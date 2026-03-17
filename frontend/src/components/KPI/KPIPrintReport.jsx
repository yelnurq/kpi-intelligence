import React from 'react';
import { Info, Printer, X } from 'lucide-react';

const KPIPrintReport = ({ selectedItems, totalPoints, selectedYear, onClose }) => {
  return (
    <>
      {/* Overlay - виден только на экране */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
        <div className="bg-white w-full max-w-[95%] max-h-[98vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          
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

          <div className="flex-1 overflow-y-auto p-10 bg-slate-100 flex justify-center">
            {/* САМ ОТЧЕТ */}
            <div 
              id="printable-report" 
              className="bg-white text-black print:shadow-none"
              style={{ 
                width: '297mm', 
                minHeight: '210mm', 
                padding: '14mm 10mm 14mm 13mm',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: '1.2'
              }}
            >
              <div className="flex justify-end mb-1">
                <span className="text-[11px] font-bold uppercase">Ф.УОП.8.3/8.1-2025-05-02</span>
              </div>

              <div className="flex items-center justify-between gap-4 mb-4 text-center">
                <div className="w-[40%] text-[11px] font-bold uppercase leading-tight">
                  «Қ. Құлажанов атындағы Қазақ технология және бизнес университеті» <br /> Акционерлік қоғамы
                </div>
                <div className="min-w-[45px] h-12">
                   <img src="/images/icons/logo.png" alt="Logo" className="h-full w-full object-contain" />
                </div>
                <div className="w-[40%] text-[11px] font-bold uppercase leading-tight">
                  Акционерное общество <br /> «Казахский университет технологии и бизнеса им. К.Кулажанова»
                </div>
              </div>

              <div className="text-center text-[12px] font-bold uppercase border-t border-b border-black py-2 mb-10">
                Факультет инжиниринга и информационных технологий / Инжиниринг және ақпараттық технологиялар факультеті
              </div>

              <div className="flex justify-end mb-16">
                <div className="w-[300px] text-[13px]">
                  <p className="font-bold text-right mb-4 uppercase">БЕКІТЕМІН / УТВЕРЖДАЮ</p>
                  <p className="text-right">Декан факультета</p>
                  <div className="flex justify-end items-end gap-2 mt-4">
                    <div className="border-b border-black w-[150px]"></div>
                    <p className="font-bold">Серимбетов Б.А.</p>
                  </div>
                  <p className="text-right mt-1 uppercase">«____» ____________ 2026 ж./г.</p>
                </div>
              </div>

              <div className="text-center mb-10">
                <h1 className="text-[15px] font-bold uppercase">
                  ИНДИВИДУАЛЬНЫЙ ПЛАН РАБОТЫ ПРЕПОДАВАТЕЛЯ
                </h1>
                <p className="text-[15px] font-bold mt-1 uppercase">{selectedYear} оқу жылы / учебный год</p>
              </div>

              <div className="text-[13px] space-y-3">
                <div className="flex border-b border-black pb-1">
                  <span className="w-1/2">ФИО / Аты-жөні:</span>
                  <span className="font-bold uppercase">Зейнолла Елнур</span>
                </div>
                <div className="flex border-b border-black pb-1">
                  <span className="w-1/2">Должность / Лауазымы:</span>
                  <span className="font-bold uppercase">Оқытушы</span>
                </div>
                <div className="flex border-b border-black pb-1">
                  <span className="w-1/2">Кафедра:</span>
                  <span className="font-bold uppercase">Ақпараттық технологиялар</span>
                </div>
              </div>

              <div className="mt-20 text-center font-bold text-[13px] uppercase">Астана, 2026</div>

              <div className="page-break"></div>
              
              <h2 className="text-center font-bold text-sm mb-6 uppercase">Запланированные показатели KPI</h2>
              <table className="w-full text-[11px] border-collapse border border-black">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-2 w-10">№</th>
                    <th className="border border-black p-2 text-left uppercase">Индикатор</th>
                    <th className="border border-black p-2 uppercase">Категория</th>
                    <th className="border border-black p-2 w-20 uppercase text-center">Баллы</th>
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
                  <tr className="font-bold">
                    <td colSpan="3" className="border border-black p-2 text-right uppercase">ИТОГО БАЛЛОВ:</td>
                    <td className="border border-black p-2 text-center">{totalPoints}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Скрываем всё */
          body * {
            visibility: hidden !important;
          }
          
          /* Показываем только контейнер отчета */
          #printable-report, #printable-report * {
            visibility: visible !important;
          }

          /* Стилизуем позицию при печати */
          #printable-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            padding: 10mm !important;
            width: 100% !important;
            display: block !important;
          }

          @page {
            size: A4 landscape;
            margin: 0;
          }

          /* Прячем элементы с классом no-print */
          .no-print {
            display: none !important;
          }

          .page-break {
            page-break-before: always;
            height: 0;
          }
        }

        @media screen {
          .page-break {
            border-top: 2px dashed #e2e8f0;
            margin: 40px 0;
            position: relative;
          }
          .page-break::after {
            content: "РАЗРЫВ СТРАНИЦЫ";
            position: absolute;
            top: -12px; left: 50%;
            transform: translateX(-50%);
            background: #f8fafc;
            padding: 0 10px;
            font-size: 10px; color: #94a3b8;
          }
        }
      `}} />
    </>
  );
};

export default KPIPrintReport;