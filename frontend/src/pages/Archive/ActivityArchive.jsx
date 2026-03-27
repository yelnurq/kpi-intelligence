import React, { useState, useEffect } from 'react';
import { 
  Search, Clock, CheckCircle2, AlertCircle, 
  Calendar, Loader2, Inbox, 
  ArrowUpRight, Zap, Plus, Download, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Компонент скелетона для карточек статистики
const StatSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-3">
        <div className="h-2 w-12 bg-slate-100 rounded" />
        <div className="h-6 w-20 bg-slate-100 rounded" />
      </div>
      <div className="w-10 h-10 bg-slate-50 rounded-lg" />
    </div>
    <div className="h-2 w-32 bg-slate-100 rounded" />
  </div>
);

const StatCard = ({ icon: Icon, label, value, trend, colorClass, description, isPrimary, unit = "баллов" }) => (
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
    <div className="flex items-center justify-between mt-2 text-left">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">{description}</p>
      {trend && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
          <ArrowUpRight size={14} /> {trend}%
        </div>
      )}
    </div>
  </div>
);

const ActivityArchive = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [allIndicators, setAllIndicators] = useState([]); 
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [archiveRes, indicatorsRes] = await Promise.all([
          fetch(`${API_BASE}/kpi-activities`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          }),
          fetch(`${API_BASE}/user/kpi-indicators`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          })
        ]);
        const archiveResult = await archiveRes.json();
        const indicatorsResult = await indicatorsRes.json();

        if (archiveResult.status === 'success') {
          setSubmissions(archiveResult.data || []);
          setStats(archiveResult.stats || { total: 0, approved: 0, pending: 0, rejected: 0 });
        }
        if (indicatorsResult.status === 'success') {
          setAllIndicators(indicatorsResult.data || []);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const statusMap = {
    approved: { label: 'Одобрено', color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircle2 size={14} /> },
    pending: { label: 'На проверке', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock size={14} /> },
    rejected: { label: 'Отклонено', color: 'bg-red-50 text-red-600 border-red-100', icon: <AlertCircle size={14} /> }
  };

  const filteredData = submissions.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = (item.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || `KPI-${item.id}`.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const pendingPoints = submissions
    .filter(s => s.status === 'pending')
    .reduce((sum, s) => sum + (Number(s.total_points) || 0), 0);

  const pendingIndicators = allIndicators.filter(indicator => {
    const indicatorSubmissions = submissions.filter(sub => 
      Number(sub.indicator_id) === Number(indicator.id) || sub.title === indicator.title
    );
    return !indicatorSubmissions.some(sub => sub.status === 'approved' || sub.status === 'pending');
  });

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans"> 
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="lg:col-span-2 flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Архив активностей</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">История поданных документов и их статусы</p>
            </div>
            
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {['all', 'approved', 'pending', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${filter === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab === 'all' ? 'Все' : statusMap[tab].label}
                </button>
              ))}
            </div>
          </div>

          {/* Сетка статистики (карточки или скелетоны) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              <>
                <StatSkeleton /> <StatSkeleton /> <StatSkeleton /> <StatSkeleton />
              </>
            ) : (
              <>
                <StatCard label="Всего" value={stats.total} icon={Inbox} colorClass="bg-slate-100 text-slate-600" description="Активностей в базе" unit="записей" />
                <StatCard label="Одобрено" value={stats.approved} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600" description="Подтвержденные KPI" isPrimary={true} unit="записей" />
                <StatCard label="В работе" value={stats.pending} icon={Clock} colorClass="bg-amber-100 text-amber-600" description="Ожидают модерации" unit="записей" />
                <StatCard label="На проверке" value={pendingPoints} icon={ArrowUpRight} colorClass="bg-blue-100 text-blue-600" description="Потенциальные баллы" unit="баллов" />
              </>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по названию или ID..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:border-blue-500 shadow-sm transition-all text-left"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Достижение</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Статус</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Баллы</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Файлы</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="animate-spin text-blue-500" size={30} />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Загружаем архив...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                        {/* ... остальной код строки таблицы без изменений ... */}
                        <td className="px-6 py-6 text-left">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#KPI-{item.id}</span>
                              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                            </div>
                            <span className="text-sm font-bold text-slate-800 leading-snug">{item.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center align-top">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${statusMap[item.status].color}`}>
                            {statusMap[item.status].icon} {statusMap[item.status].label}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center font-bold text-slate-900 align-top">
                          {item.status === 'approved' ? `+${item.total_points}` : '—'}
                        </td>
                        <td className="px-6 py-6 text-right align-top">
                          <div className="flex justify-end gap-2 flex-wrap max-w-[200px] ml-auto">
                            {item.files?.length > 0 ? item.files.map((file, idx) => (
                              <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white border border-slate-200 rounded-lg transition-all"><Download size={14} /></a>
                            )) : <span className="text-[10px] text-slate-300 italic font-medium">Пусто</span>}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center text-slate-400 text-sm font-medium">Ничего не найдено</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Правая колонка с индикатором загрузки в заголовке */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden sticky top-10">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-amber-500 fill-amber-500"/> Доступно
              </h3>
              {loading ? <Loader2 size={12} className="animate-spin text-slate-300" /> : (
                <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingIndicators.length}
                </span>
              )}
            </div>
          <div className="p-2 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="p-10 text-center">
                <div className="w-8 h-8 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              pendingIndicators.map((indicator) => (
                <div 
                  key={indicator.id} 
                  // Добавляем параметр ID в URL для перехода
                  onClick={() => navigate(`/submit?indicator_id=${indicator.id}`)} 
                  className="p-4 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100 cursor-pointer text-left"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                      +{indicator.weight || indicator.points} баллов
                    </span>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Останавливаем всплытие, чтобы не срабатывал onClick у родительского div
                        navigate(`/submit?indicator_id=${indicator.id}`);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 bg-blue-600 text-white rounded-md transition-all shadow-md"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <p className="text-xs font-bold text-slate-700 leading-relaxed mb-1">
                    {indicator.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium italic">
                    Нажмите, чтобы отправить отчет
                  </p>
                </div>
              ))
            )}
          </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ActivityArchive;