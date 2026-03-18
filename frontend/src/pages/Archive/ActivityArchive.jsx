import React, { useState, useEffect } from 'react';
import { 
  Search, Clock, CheckCircle2, AlertCircle, Download, 
  Eye, FileText, ChevronRight, Calendar, Loader2, 
  Inbox, HelpCircle, ArrowUpRight,Zap
} from 'lucide-react';

const ActivityArchive = () => {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:8000/api/kpi-activities', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const result = await response.json();
        if (result.status === 'success') {
          setSubmissions(result.data);
          setStats(result.stats);
        }
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, []);

  const statusMap = {
    approved: { label: 'Одобрено', color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircle2 size={14} /> },
    pending: { label: 'На проверке', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock size={14} /> },
    rejected: { label: 'Отклонено', color: 'bg-red-50 text-red-600 border-red-100', icon: <AlertCircle size={14} /> }
  };

  const filteredData = submissions.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          `KPI-${item.id}`.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Расчет потенциальных баллов (те, что еще на проверке)
  const pendingPoints = submissions
    .filter(s => s.status === 'pending')
    .reduce((sum, s) => sum + (Number(s.points) || 0), 0);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <Zap className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={20} />
        </div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Синхронизация данных...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">       
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Архив активностей</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-sm text-slate-500 font-medium">Данные обновлены сегодня в {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
          {['all', 'approved', 'pending', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all ${filter === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab === 'all' ? 'Все' : statusMap[tab].label}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Всего подано', val: stats.total, color: 'text-slate-900', icon: <Inbox size={16}/> },
          { label: 'Подтверждено', val: stats.approved, color: 'text-green-600', icon: <CheckCircle2 size={16}/> },
          { label: 'В обработке', val: stats.pending, color: 'text-amber-500', icon: <Clock size={16}/> },
          { label: 'Прогноз баллов', val: `+${pendingPoints}`, color: 'text-blue-600', icon: <ArrowUpRight size={16}/> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className={`${s.color} opacity-20 group-hover:opacity-100 transition-opacity`}>{s.icon}</div>
            </div>
            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по названию достижения или #ID..."
          className="w-full bg-white border-2 border-slate-50 rounded-[24px] pl-14 pr-6 py-5 text-sm font-bold text-slate-700 focus:border-blue-500/10 focus:bg-white outline-none shadow-sm transition-all"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Достижение / Дата</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Статус</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Баллы</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Документы</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.length > 0 ? filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">#KPI-{item.id}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                            <Calendar size={12} /> {item.date}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-800 leading-snug max-w-md">{item.title}</span>
                      
                      {/* ПРИЧИНА ОТКЛОНЕНИЯ */}
                      {item.status === 'rejected' && item.reason && (
                        <div className="mt-2 flex items-start gap-2 bg-red-50/50 p-3 rounded-2xl border border-red-100/50">
                           <AlertCircle className="text-red-500 mt-0.5" size={14} />
                           <p className="text-[11px] text-red-700 font-bold leading-relaxed">
                            Отказ: <span className="font-medium text-red-600/80">{item.reason}</span>
                           </p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-8 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${statusMap[item.status].color}`}>
                      {statusMap[item.status].icon} {statusMap[item.status].label}
                    </div>
                  </td>
                  <td className="px-6 py-8 text-center font-black text-lg">
                    <span className={item.status === 'approved' ? 'text-green-600' : 'text-slate-200'}>
                      +{item.points || 0}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2">
                      {item.files?.length > 0 ? item.files.map((file, idx) => (
                        <a 
                          key={idx} 
                          href={file.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg transition-all"
                          title={file.name}
                        >
                          <FileText size={18} />
                        </a>
                      )) : <span className="text-[10px] font-bold text-slate-300 italic">Empty</span>}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="4" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <Search size={32} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-900 font-bold text-sm">Ничего не найдено</p>
                                <p className="text-slate-400 text-xs">Попробуйте изменить фильтры или поисковый запрос</p>
                            </div>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ActivityArchive;