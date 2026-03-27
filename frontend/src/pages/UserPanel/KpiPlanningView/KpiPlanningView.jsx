import React, { useState } from 'react';
import { 
  Calendar, CheckCircle2, Clock, AlertTriangle, 
  ChevronRight, Filter, Search, ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const KpiPlanningView = () => {
  // ФЕЙКОВЫЕ ДАННЫЕ (Имитация ответа от API)
  const [mockIndicators] = useState([
    {
      id: 1,
      title: "Публикация статьи в журнале КОКСНВО (Scopus/Web of Science)",
      weight: 50,
      progress: 100,
      deadline: "2026-03-01", // Прошлое
      category: "Научная деятельность"
    },
    {
      id: 2,
      title: "Разработка электронного учебного курса в системе Moodle",
      weight: 30,
      progress: 45,
      deadline: "2026-04-05", // Скоро (через 9 дней от текущей даты 27 марта)
      category: "Учебно-методическая"
    },
    {
      id: 3,
      title: "Участие в международной конференции с докладом",
      weight: 20,
      progress: 10,
      deadline: "2026-06-15", // Далеко
      category: "Научная деятельность"
    },
    {
      id: 4,
      title: "Руководство дипломными работами студентов (5+ человек)",
      weight: 40,
      progress: 0,
      deadline: "2026-03-20", // Просрочено (уже 27 марта)
      category: "Воспитательная"
    }
  ]);

  // Функция для определения статуса дедлайна
  const getDeadlineStatus = (deadline, progress) => {
    if (progress >= 100) return { label: 'Выполнено', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 };
    
    const today = new Date();
    const date = new Date(deadline);
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Просрочено', color: 'bg-red-50 text-red-600 border-red-100', icon: AlertTriangle };
    if (diffDays <= 10) return { label: `Срочно: ${diffDays} дн.`, color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock };
    return { label: `До: ${deadline}`, color: 'bg-slate-50 text-slate-500 border-slate-100', icon: Calendar };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Хедер страницы */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="text-left">
            <Link to="/" className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2 hover:gap-3 transition-all">
              <ArrowLeft size={14} /> На дашборд
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Мой план KPI на 2025/2026</h1>
            <p className="text-slate-500 text-sm mt-1">Список выбранных индикаторов и отслеживание выполнения</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Общий прогресс</p>
                <p className="text-lg font-black text-slate-800">140 / 350</p>
              </div>
              <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-slate-100 rotate-45" />
            </div>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по названию индикатора..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
            <Filter size={18} /> Фильтры
          </button>
        </div>

        {/* Список карточек */}
        <div className="grid grid-cols-1 gap-4">
          {mockIndicators.map((item) => {
            const status = getDeadlineStatus(item.deadline, item.progress);
            const StatusIcon = status.icon;

            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  
                  {/* Прогресс-кольцо */}
                  <div className="relative w-16 h-16 flex-shrink-0 mx-auto md:mx-0">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3"></circle>
                      <circle 
                        cx="18" cy="18" r="16" fill="none" 
                        className={`${item.progress >= 100 ? 'stroke-emerald-500' : 'stroke-blue-600'}`}
                        strokeWidth="3" 
                        strokeDasharray={`${item.progress}, 100`} 
                        strokeLinecap="round"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-slate-700">
                      {item.progress}%
                    </div>
                  </div>

                  {/* Инфо */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                        {item.category}
                      </span>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase border ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Баллы и кнопка */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Вес индикатора</p>
                      <p className="text-xl font-black text-slate-900">{item.weight} <span className="text-xs text-slate-400 font-bold">Баллов</span></p>
                    </div>
                    <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default KpiPlanningView;