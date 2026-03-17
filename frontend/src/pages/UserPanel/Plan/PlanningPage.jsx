import React, { useState, useMemo } from 'react';
import { Search, CheckCircle2, Globe, BookOpen, PenTool, Trash2, Calendar, FileText } from 'lucide-react';
import KPIPrintReport from '../../../components/KPI/KPIPrintReport';


const indicators = [
  { id: 1, category: 'Наука', title: 'Публикация в Scopus/WoS', points: 100, desc: 'Статья в журналах 1, 2, 3 квартиля', difficulty: 'Высокая', year: '2025-2026' },
  { id: 2, category: 'Наука', title: 'Публикация в КОКСНВО', points: 50, desc: 'Статья в перечне рекомендованных изданий', difficulty: 'Средняя', year: '2025-2026' },
  { id: 3, category: 'Метод.раб', title: 'Разработка учебного пособия', points: 70, desc: 'Издание пособия с ISBN и рекомендацией УМС', difficulty: 'Средняя', year: '2025-2026' },
  { id: 4, category: 'Метод.раб', title: 'Курс повышения квалификации', points: 30, desc: 'Сертификат более 72 часов по профилю', difficulty: 'Низкая', year: '2025-2026' },
  { id: 7, category: 'Наука', title: 'Получение авторского свидетельства', points: 60, desc: 'Регистрация прав на объект интеллектуальной собственности', difficulty: 'Средняя', year: '2025-2026' },
  { id: 5, category: 'Общ.деят', title: 'Кураторство группы', points: 40, desc: 'Активное участие в воспитательной работе', difficulty: 'Средняя', year: '2026-2027' },
  // ... добавь остальные если нужно
];

const categories = ['Все', 'Наука', 'Метод.раб', 'Общ.деят'];
const years = ['2025-2026', '2026-2027'];
const PlanningPage = () => {
  const [selectedIds, setSelectedIds] = useState([1, 4]);
  const [activeTab, setActiveTab] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [showReport, setShowReport] = useState(false);

  const toggleIndicator = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredIndicators = useMemo(() => {
    return indicators.filter(item => {
      const matchesYear = item.year === selectedYear;
      const matchesTab = activeTab === 'Все' || item.category === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, selectedYear]);

  const selectedItems = useMemo(() => 
    indicators.filter(item => selectedIds.includes(item.id)), 
  [selectedIds]);

  const totalPoints = useMemo(() => 
    selectedItems.reduce((acc, curr) => acc + curr.points, 0), 
  [selectedItems]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Планирование KPI</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>Учебный год:</span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)} 
              className="font-bold text-blue-600 bg-transparent border-none focus:ring-0 cursor-pointer p-0"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <button 
          onClick={() => setShowReport(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <FileText size={18} /> Сохранить и создать отчет
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Левая колонка: Фильтры и Список */}
        <div className="lg:col-span-8 space-y-6">
          {/* Фильтры */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex-1 md:flex-none ${
                    activeTab === cat ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Найти индикатор..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Список индикаторов */}
          <div className="grid grid-cols-1 gap-4">
            {filteredIndicators.map(item => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => toggleIndicator(item.id)}
                  className={`flex items-center gap-6 p-5 bg-white border rounded-xl transition-all cursor-pointer group ${
                    isSelected ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  }`}>
                    {item.category === 'Наука' ? <Globe size={20} /> : item.category === 'Метод.раб' ? <BookOpen size={20} /> : <PenTool size={20} />}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wide">
                        {item.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-lg font-bold text-slate-900">{item.points} <span className="text-xs text-gray-400 font-normal">баллов</span></div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-transparent group-hover:border-gray-400'
                    }`}>
                      <CheckCircle2 size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Правая колонка: Итоги */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm sticky top-8">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-slate-900">Ваш выбор</h3>
              <p className="text-xs text-gray-500 mt-1">Итого за все периоды</p>
            </div>
            
            <div className="p-6 space-y-4">
              {selectedIds.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4 italic">Ничего не выбрано</p>
              ) : (
                selectedItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="flex flex-col max-w-[80%]">
                      <span className="text-sm font-medium text-slate-700 truncate">{item.title}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-blue-500 font-bold">{item.points} баллов</span>
                        <span className="text-[10px] text-gray-400 italic">{item.year}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleIndicator(item.id); }}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Итоговая цель:</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-slate-900">{totalPoints}</span>
                    <span className="text-sm text-gray-400 font-bold ml-1">/ 600</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${totalPoints >= 450 ? 'bg-green-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min((totalPoints / 600) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-gray-400 text-center">Минимум для подтверждения: 450 баллов</p>
              </div>
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Модалка отчета */}
      {showReport && (
        <KPIPrintReport 
          selectedItems={selectedItems} 
          totalPoints={totalPoints} 
          selectedYear={selectedYear}
          onClose={() => setShowReport(false)} 
        />
      )}

      {/* Стили для печати */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { display: none !important; }
          #printable-report, #printable-report * { 
            display: block !important; 
            visibility: visible !important; 
          }
          #printable-report { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 297mm !important; 
            margin: 0 !important;
            padding: 14mm 10mm 14mm 13mm !important;
          }
          .page-break { 
            display: block !important; 
            page-break-before: always !important; 
            height: 0 !important;
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
=======
      {/* --- МОДАЛЬНОЕ ОКНО ОТЧЕТА --- */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header модалки */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FileText size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Предпросмотр отчета KPI</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  <Printer size={16} /> Печать / PDF
                </button>
                <button 
                  onClick={() => setShowReport(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Тело отчета (то, что пойдет на печать) */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-100/30">
              <div id="printable-report" className="bg-white shadow-sm border border-gray-200 mx-auto w-full max-w-[210mm] p-12 min-h-[297mm]">
                
                {/* Шапка документа */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                   <div className="text-xs font-black uppercase tracking-tighter">
                      KazUTB <br /> <span className="text-gray-400 font-normal">Professional KPI System</span>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Дата формирования</p>
                      <p className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Индивидуальный план развития</h2>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Учебный период: {selectedYear}</p>
                </div>

                {/* Информация о сотруднике (пример) */}
                <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">ФИО сотрудника</p>
                    <p className="text-sm font-bold text-slate-900">Зейнолла Елнур</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Должность</p>
                    <p className="text-sm font-bold text-slate-900">Преподаватель / Разработчик</p>
                  </div>
                </div>

                {/* Таблица индикаторов */}
                <table className="w-full mb-10">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 text-left text-[10px] font-bold text-gray-400 uppercase">№</th>
                      <th className="py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Индикатор</th>
                      <th className="py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Категория</th>
                      <th className="py-3 text-right text-[10px] font-bold text-gray-400 uppercase">Баллы</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-4 text-xs text-gray-400">{idx + 1}</td>
                        <td className="py-4 text-xs font-bold text-slate-900">{item.title}</td>
                        <td className="py-4 text-[10px] font-medium text-gray-500 uppercase">{item.category}</td>
                        <td className="py-4 text-right text-xs font-bold text-slate-900">{item.points}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900">
                      <td colSpan="3" className="py-6 text-sm font-bold text-slate-900 uppercase">Итого за период:</td>
                      <td className="py-6 text-right text-lg font-black text-blue-600">{totalPoints}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Футер документа */}
                <div className="mt-20 flex justify-between items-center opacity-50">
                  <div className="text-center">
                    <div className="w-32 h-px bg-slate-900 mb-2"></div>
                    <p className="text-[9px] font-bold uppercase">Подпись сотрудника</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-px bg-slate-900 mb-2"></div>
                    <p className="text-[9px] font-bold uppercase">Декан факультета</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Стили для печати (скрываем всё, кроме самого отчета) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            border: none !important;
            box-shadow: none !important;
>>>>>>> parent of 72bb1b8 (Update PlanningPage.jsx)
          }
        }
      `}} />
    </main>
  );
};

export default PlanningPage;