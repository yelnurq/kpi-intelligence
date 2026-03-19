import React from 'react';
import { Info, Printer, X, FileSpreadsheet } from 'lucide-react';
// Библиотека *as XLSX больше не нужна, если ты всё делаешь через сервер

const KPIPrintReport = ({ selectedItems, totalPoints, selectedYear, onClose }) => {
  
const exportToExcel = async (e) => {
    try {
        const token = localStorage.getItem("token");
        
        // Получаем только массив ID из объектов selectedItems
        const indicatorIds = selectedItems.map(item => item.id);

        const response = await fetch("http://localhost:8000/api/export", {
            method: 'POST', // Используем POST для передачи данных
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            body: JSON.stringify({
                indicator_ids: indicatorIds,
                year: selectedYear
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server Error:", errorText);
            alert("Ошибка сервера. Проверьте логи Laravel.");
            return;
        }

        // Скачивание файла (код остается прежним)
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Individual_Plan_${selectedYear.replace('/', '_')}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (err) {
        console.error("Export failed:", err);
    }
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
              {/* Кнопка теперь дергает сервер */}
              <button 
                onClick={exportToExcel}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
              >
                <FileSpreadsheet size={16} /> Скачать XLSX (Сервер)
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

        
        </div>
      </div>
    </>
  );
};

export default KPIPrintReport;