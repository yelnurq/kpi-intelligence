import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Clock, CheckCircle2, AlertCircle, 
  Calendar, Loader2, LayoutGrid, 
  ArrowUpRight, Zap, ChevronRight, Info, 
  Download, Filter, Target, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Компонент карточки статистики в твоем фирменном стиле
const StatCard = ({ icon: Icon, label, value, colorClass, description, isPrimary, unit = "баллов" }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-md ${isPrimary ? 'ring-1 ring-blue-600/10' : ''}`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${isPrimary ? 'bg-blue-600' : 'bg-slate-200'}`} />
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{value}</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed text-left">{description}</p>
  </div>
);

const KpiPlanMonitor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');

  // Имитация данных (в реальности придут с твоего API)
  const [planIndicators] = useState([
    { id: 1, title: "Публикация статьи Scopus (Q1/Q2)", weight: 50, progress: 100, deadline: "2026-03-01", category: "Наука" },
    { id: 2, title: "Разработка электронного курса в Moodle", weight: 30, progress: 45, deadline: "2026-04-10", category: "Учебная" },
    { id: 3, title: "Руководство дипломными работами (5+ чел)", weight: 40, progress: 0, deadline: "2026-03-20", category: "Воспитательная" },
    { id: 4, title: "Участие в международной конференции", weight: 20, progress: 10, deadline: "2026-06-15", category: "Наука" },
    { id: 5, title: "Разработка силлабуса по новой дисциплине", weight: 15, progress: 0, deadline: "2026-03-28", category: "Учебная" },
  ]);

  useEffect(() => {
    // Имитация загрузки
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Логика определения статуса дедлайна
  const getDeadlineStatus = (deadline, progress) => {
    if (progress >= 100) return { label: 'Выполнено', color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircle2 size={14} />, priority: 4 };
    
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return { label: 'Просрочено', color: 'bg-red-50 text-red-600 border-red-100 animate-pulse', icon: <AlertCircle size={14} />, priority: 1 };
    if (diff <= 5) return { label: `Критично: ${diff} дн.`, color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <Clock size={14} />, priority: 2 };
    if (diff <= 14) return { label: `Срочно: ${diff} дн.`, color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock size={14} />, priority: 3 };
    
    return { label: `До ${deadline}`, color: 'bg-slate-50 text-slate-500 border-slate-100', icon: <Calendar size={14} />, priority: 4 };
  };

  // Фильтрация и Умная сортировка (Сначала просроченные, потом дорогие)
  const filteredData = useMemo(() => {
    return planIndicators
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = filter === 'all' || (filter === 'completed' ? item.progress === 100 : item.progress < 100);
        return matchesSearch && matchesTab;
      })
      .sort((a, b) => {
        const statusA = getDeadlineStatus(a.deadline, a.progress);
        const statusB = getDeadlineStatus(b.deadline, b.progress);
        if (statusA.priority !== statusB.priority) return statusA.priority - statusB.priority;
        return b.weight - a.weight; // Если приоритет одинаковый, выше тот, что дороже
      });
  }, [searchTerm, filter, planIndicators]);

  // Расчет статистики
  const totalPoints = planIndicators.reduce((sum, item) => sum + (item.progress >= 100 ? item.weight : 0), 0);
  const potentialPoints = planIndicators.reduce((sum, item) => sum + item.weight, 0);
  const urgentCount = planIndicators.filter(i => i.progress < 100 && Math.ceil((new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24)) <= 7).length;

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="space-y-8">
        
        {/* Хедер страницы */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded tracking-wider">Plan 2025/26</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Личный мониторинг</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Дорожная карта KPI</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Отслеживание выполнения индивидуального плана развития</p>
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={14} /> Экспорт PDF
            </button>
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {['all', 'active', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${filter === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab === 'all' ? 'Весь план' : tab === 'active' ? 'В работе' : 'Завершено'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Сетка статистики */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Текущий прогресс" value={totalPoints} icon={Target} colorClass="bg-blue-100 text-blue-600" description={`Цель: ${potentialPoints} баллов`} unit="баллов" isPrimary={true} />
          <StatCard label="Эффективность" value={Math.round((totalPoints/potentialPoints)*100)} icon={TrendingUp} colorClass="bg-emerald-100 text-emerald-600" description="Процент выполнения плана" unit="%" />
          <StatCard label="В работе" value={planIndicators.filter(i => i.progress < 100).length} icon={Clock} colorClass="bg-amber-100 text-amber-600" description="Активные индикаторы" unit="записи" />
          <StatCard label="Срочные задачи" value={urgentCount} icon={AlertCircle} colorClass="bg-red-100 text-red-600" description="Дедлайн менее 7 дней" unit="задачи" />
        </div>

        {/* Поиск и Инфо */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по названию индикатора..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:border-blue-500 shadow-sm transition-all text-left"
            />
          </div>
          <div className="flex items-center gap-3 px-6 bg-white border border-slate-200 rounded-xl shadow-sm">
             <Filter size={16} className="text-slate-400" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Сортировка по приоритету</span>
          </div>
        </div>

        {/* Основная таблица */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Индикатор / Категория</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Статус и сроки</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Прогресс выполнения</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ценность</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-left">
                {loading ? (
                   <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-blue-500" size={30} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Загружаем ваш план...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => {
                    const status = getDeadlineStatus(item.deadline, item.progress);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-6 py-6 text-left max-w-md">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                              <span className="text-[10px] font-medium text-slate-300">#PLN-{item.id}</span>
                            </div>
                            <span className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center align-middle">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                            {status.icon} {status.label}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center align-middle min-w-[160px]">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex justify-between w-24">
                               <span className="text-[10px] font-bold text-slate-700">{item.progress}%</span>
                               {item.progress >= 100 && <CheckCircle2 size={12} className="text-emerald-500" />}
                            </div>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-700 ease-out ${item.progress >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right align-middle">
                          <div className="flex items-center justify-end gap-4">
                             <div className="text-right">
                                <span className={`text-lg font-black ${item.progress >= 100 ? 'text-emerald-600' : 'text-slate-900'}`}>{item.weight}</span>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">баллов</p>
                             </div>
                             <button 
                               onClick={() => navigate('/submit')}
                               title="Отправить подтверждение"
                               className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-blue-200"
                             >
                               <ArrowUpRight size={16} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <Zap size={40} className="text-slate-300" />
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ничего не найдено</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Футер-подсказка */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
           <div className="flex items-center gap-3 text-left">
             <div className="p-2 bg-amber-50 rounded-lg">
                <Info size={18} className="text-amber-600" />
             </div>
             <div>
               <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Методическая поддержка</p>
               <p className="text-xs text-slate-500">Не знаете как подтвердить индикатор? Ознакомьтесь с правилами набора баллов.</p>
             </div>
           </div>
           <button className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all">
             Инструкции KPI
           </button>
        </div>
      </div>
    </main>
  );
};

export default KpiPlanMonitor;