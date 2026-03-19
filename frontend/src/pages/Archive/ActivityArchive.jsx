
import React, { useState, useEffect } from 'react';
import { 
  Search, Clock, CheckCircle2, AlertCircle, 
  FileText, Calendar, Loader2, Inbox, 
  ArrowUpRight, Zap, Plus, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
          setSubmissions(archiveResult.data);
          setStats(archiveResult.stats);
        }
        if (indicatorsResult.status === 'success') {
          setAllIndicators(indicatorsResult.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const pendingIndicators = allIndicators.filter(indicator => {
    const indicatorSubmissions = submissions.filter(sub => 
      Number(sub.indicator_id) === Number(indicator.id) || sub.title === indicator.title
    );
    const hasActiveOrApproved = indicatorSubmissions.some(sub => 
      sub.status === 'approved' || sub.status === 'pending'
    );
    return !hasActiveOrApproved;
  });

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

  const pendingPoints = submissions
    .filter(s => s.status === 'pending')
    .reduce((sum, s) => sum + (Number(s.total_points) || 0), 0);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Загрузка документов...</span>
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen"> 
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* АРХИВ */}
        <div className="lg:col-span-2 flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Всего', val: stats.total, color: 'text-slate-900', icon: <Inbox size={16}/> },
              { label: 'Принято', val: stats.approved, color: 'text-green-600', icon: <CheckCircle2 size={16}/> },
              { label: 'В работе', val: stats.pending, color: 'text-amber-500', icon: <Clock size={16}/> },
              { label: 'В ожидании', val: `+${pendingPoints}`, color: 'text-blue-600', icon: <ArrowUpRight size={16}/> },
            ].map((s, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по названию..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:border-blue-500 shadow-sm transition-all"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Достижение</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Статус</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Баллы</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Документы</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#KPI-{item.id}</span>
                            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                              <Calendar size={12} /> {item.date}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-slate-800">{item.title}</span>
                          {item.status === 'rejected' && item.reason && (
                            <div className="text-[11px] text-red-500 font-semibold bg-red-50 p-2 rounded-lg border border-red-100 mt-1">
                              Причина: {item.reason}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${statusMap[item.status].color}`}>
                          {statusMap[item.status].icon} {statusMap[item.status].label}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center font-bold text-slate-900">
                        {item.status === 'approved' ? `+${item.total_points}` : '—'}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2 flex-wrap max-w-[200px] ml-auto">
                          {item.files && item.files.length > 0 ? item.files.map((file, idx) => (
                            <a 
                              key={idx}
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              title={file.name}
                              className="p-2 bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white border border-slate-200 rounded-lg transition-all flex items-center gap-2 group"
                            >
                              <Download size={14} className="group-hover:scale-110 transition-transform" />
                              <span className="sr-only">Скачать {file.name}</span>
                            </a>
                          )) : (
                            <span className="text-[10px] text-slate-300 italic font-medium tracking-tight">Нет файлов</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ОЖИДАЮТ ВЫПОЛНЕНИЯ */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden sticky top-10">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-amber-500 fill-amber-500"/> Ожидают выполнения
              </h3>
              <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingIndicators.length}
              </span>
            </div>
            
            <div className="p-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {pendingIndicators.map((indicator) => (
                <div key={indicator.id} className="p-4 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                      +{indicator.points} баллов
                    </span>
                    <button onClick={() => navigate('/submit')} className="opacity-0 group-hover:opacity-100 p-1 bg-blue-600 text-white rounded-md transition-all shadow-md">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed mb-1">{indicator.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Документы не поданы</p>

                </div>
              ))}
              {pendingIndicators.length === 0 && (
                 <div className="p-10 text-center space-y-2">
                    <CheckCircle2 size={24} className="text-green-500 mx-auto" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">План закрыт</p>
                 </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ActivityArchive;
