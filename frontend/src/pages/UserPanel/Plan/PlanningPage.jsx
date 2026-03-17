import React, { useState, useMemo } from 'react';
import { 
  Search, Info, CheckCircle2, BookOpen, 
  PenTool, Globe, Trash2, Calendar, 
  Printer, Download, X, FileText
} from 'lucide-react';

// 1. ОБЯЗАТЕЛЬНО ДОБАВЬ ЭТИ КОНСТАНТЫ В НАЧАЛО ФАЙЛА (Line 10-50 примерно)
const indicators = [
  { id: 1, category: 'Наука', title: 'Публикация в Scopus/WoS', points: 100, desc: 'Статья в журналах 1, 2, 3 квартиля', difficulty: 'Высокая', year: '2025-2026' },
  { id: 2, category: 'Наука', title: 'Публикация в КОКСНВО', points: 50, desc: 'Статья в перечне рекомендованных изданий', difficulty: 'Средняя', year: '2025-2026' },
  { id: 3, category: 'Метод.раб', title: 'Разработка учебного пособия', points: 70, desc: 'Издание пособия с ISBN и рекомендацией УМС', difficulty: 'Средняя', year: '2025-2026' },
  { id: 4, category: 'Метод.раб', title: 'Курс повышения квалификации', points: 30, desc: 'Сертификат более 72 часов по профилю', difficulty: 'Низкая', year: '2025-2026' },
  { id: 7, category: 'Наука', title: 'Получение авторского свидетельства', points: 60, desc: 'Регистрация прав на объект интеллектуальной собственности', difficulty: 'Средняя', year: '2025-2026' },
  { id: 8, category: 'Метод.раб', title: 'Разработка силлабуса на англ. языке', points: 40, desc: 'Для новых дисциплин полиязычного отделения', difficulty: 'Средняя', year: '2025-2026' },
  { id: 9, category: 'Общ.деят', title: 'Профориентационная работа', points: 25, desc: 'Выезды в школы и проведение встреч с абитуриентами', difficulty: 'Низкая', year: '2025-2026' },
  { id: 10, category: 'Наука', title: 'Руководство стартап-проектом', points: 90, desc: 'Подготовка студенческой команды к инвест-питчу', difficulty: 'Высокая', year: '2025-2026' },
  { id: 5, category: 'Общ.деят', title: 'Кураторство группы', points: 40, desc: 'Активное участие в воспитательной работе', difficulty: 'Средняя', year: '2026-2027' },
  { id: 6, category: 'Общ.деят', title: 'Организация конференции', points: 80, desc: 'Международный или республиканский уровень', difficulty: 'Высокая', year: '2026-2027' },
  { id: 11, category: 'Наука', title: 'Подготовка призера Олимпиады', points: 75, desc: 'Призовое место (1-3) на республиканском этапе', difficulty: 'Высокая', year: '2026-2027' },
  { id: 12, category: 'Метод.раб', title: 'Создание МООК курса', points: 120, desc: 'Размещение видео-лекций на платформе Coursera/Stepik', difficulty: 'Высокая', year: '2026-2027' },
  { id: 13, category: 'Общ.деят', title: 'Работа в приемной комиссии', points: 50, desc: 'Технический секретарь в летний период', difficulty: 'Средняя', year: '2026-2027' },
  { id: 14, category: 'Наука', title: 'Цитируемость (Хирш)', points: 35, desc: 'Рост индекса Хирша в текущем календарном году', difficulty: 'Средняя', year: '2026-2027' },
  { id: 15, category: 'Метод.раб', title: 'Мастер-класс для коллег', points: 20, desc: 'Обмен опытом по использованию новых IT-инструментов', difficulty: 'Низкая', year: '2026-2027' },
  { id: 16, category: 'Общ.деят', title: 'Волонтерское наставничество', points: 30, desc: 'Координация социальных проектов студентов', difficulty: 'Низкая', year: '2026-2027' },
];

const categories = ['Все', 'Наука', 'Метод.раб', 'Общ.деят'];
const years = ['2025-2026', '2026-2027'];
const PlanningPage = () => {
  const [selectedIds, setSelectedIds] = useState([1, 4]);
  const [activeTab, setActiveTab] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  
  // Состояния для модального окна отчета
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

  const selectedItems = useMemo(() => {
    return indicators.filter(item => selectedIds.includes(item.id));
  }, [selectedIds]);

  const totalPoints = useMemo(() => {
    return selectedItems.reduce((acc, curr) => acc + curr.points, 0);
  }, [selectedItems]);

  // Функция для печати
  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">       
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Планирование KPI</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>Учебный год:</span>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="font-bold text-blue-600 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        {/* Кнопка теперь открывает отчет */}
        <button 
          onClick={() => setShowReport(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <FileText size={18} />
          Сохранить и создать отчет
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Код выбора индикаторов и сайдбара остается таким же, как в твоем исходнике */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
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
                    isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 transition-colors'
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

        {/* Сайдбарт итоги */}
        <div className="lg:col-span-4 space-y-6">
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

{showReport && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
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
          <button onClick={() => setShowReport(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Область предпросмотра */}
     <div className="flex-1 overflow-y-auto p-10 bg-slate-100 flex justify-center no-print">
  <div 
    id="printable-report" 
    className="bg-white text-black shadow-2xl print:shadow-none print:border-none" // Убрали тени для печати
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
            <p className="text-[15px] font-bold mt-1">2025 / 2026 оқу жылы / учебный год</p>
            <p className="text-[12px] mt-4">1 ставка</p>
          </div>

          {/* ТАБЛИЦА ДАННЫХ ПРЕПОДАВАТЕЛЯ */}
          <div className="text-[13px] w-full">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="align-bottom">
                  <td className="w-[450px] pb-2">Аты-жөні, тегі/ Фамилия, имя, отчество</td>
                  <td className="font-bold pb-2 border-b border-black">Зейнолла Елнур</td>
                </tr>
                <tr className="align-bottom">
                  <td className="pt-3 pb-2">Ғылыми дәрежесі, атағы/ Ученая (академическая) степень, ученое звание</td>
                  <td className="font-bold pb-2 border-b border-black">Fullstack Developer</td>
                </tr>
                <tr className="align-bottom">
                  <td className="pt-3 pb-2">Кафедра</td>
                  <td className="font-bold pb-2 border-b border-black uppercase">Ақпараттық технологиялар</td>
                </tr>
                <tr className="align-bottom">
                  <td className="pt-3 pb-2">Лауазымы/ Должность</td>
                  <td className="font-bold pb-2 border-b border-black uppercase">Оқытушы</td>
                </tr>
                <tr className="align-bottom">
                  <td className="pt-3 pb-2">Оқытушының қолы/ Подпись преподавателя</td>
                  <td className="pb-2 border-b border-black h-[40px]"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ГОРОД (ВНИЗУ) */}
          <div className="bottom-[14mm] mt-10 left-0 right-0 text-center font-bold text-[13px]">
            Астана, 2026
          </div>

          {/* ВТОРАЯ СТРАНИЦА (Сама таблица KPI) */}
          <div className="page-break"></div>
          <h2 className="text-center font-bold text-sm mb-6 uppercase">Запланированные показатели KPI</h2>
          <table className="w-full text-[11px] border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 w-10">№</th>
                <th className="border border-black p-2 text-left">Индикатор</th>
                <th className="border border-black p-2">Категория</th>
                <th className="border border-black p-2 w-20">Баллы</th>
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
                <td colSpan="3" className="border border-black p-2 text-right">ИТОГО БАЛЛОВ:</td>
                <td className="border border-black p-2 text-center text-blue-700">{totalPoints}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}

<style dangerouslySetInnerHTML={{ __html: `
  @media print {
    @page { 
      size: A4 landscape; 
      margin: 0; 
    }

    /* Разблокируем высоту всех контейнеров, чтобы они не ограничивали контент */
    html, body, #root, main, .fixed, .overflow-y-auto {
      height: auto !important;
      overflow: visible !important;
      position: static !important;
    }

    /* Скрываем интерфейс */
    body * {
      visibility: hidden;
    }

    /* Показываем отчет и его содержимое */
    #printable-report, 
    #printable-report * {
      visibility: visible;
    }

    #printable-report {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 297mm !important;
      /* Убираем фиксированную высоту, чтобы страницы шли друг за другом */
      height: auto !important; 
      min-height: 210mm;
      padding: 14mm 10mm 14mm 13mm !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
      display: block !important;
      background: white !important;
    }

    /* Прячем кнопки внутри отчета, если они есть */
    .no-print {
      display: none !important;
    }

    /* Ключевое правило для разрыва страниц */
    .page-break { 
      display: block;
      page-break-before: always !important;
      clear: both;
    }
  }

  /* Стили для экрана (чтобы в модалке тоже выглядело как страницы) */
  @media screen {
    .page-break {
      border-top: 2px dashed #e2e8f0;
      margin-top: 40px;
      margin-bottom: 40px;
      position: relative;
    }
    .page-break::after {
      content: "Разрыв страницы (следующий лист)";
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #f8fafc;
      padding: 0 10px;
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
    }
  }
`}} />  


    </main>
  );
};

export default PlanningPage;