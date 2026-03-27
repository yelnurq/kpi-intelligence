import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Clock, CheckCircle2, AlertCircle, 
  Calendar, Loader2, ArrowUpRight, Zap, Info, 
  Target, TrendingUp, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8000/api';

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
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [planIndicators, setPlanIndicators] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Исправлено: запрашиваем обе ветки данных
        const [indicatorsRes, archiveRes] = await Promise.all([
          fetch(`${API_BASE}/get-my-indicators`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          }),
          fetch(`${API_BASE}/kpi-activities`, { // Предполагаемый роут для статистики
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          })
        ]);

        const indicatorsResult = await indicatorsRes.json();
        const archiveResult = await archiveRes.json();

        if (indicatorsResult.status === 'success') {
          setPlanIndicators(indicatorsResult.data || []);
        }

        if (archiveResult.status === 'success') {
          setStats(archiveResult.stats || { total: 0, approved: 0, pending: 0, rejected: 0 });
        }

      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const getDeadlineStatus = (deadline, progress) => {
    if (progress >= 100) return { label: 'Выполнено', color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircle2 size={14} />, priority: 4 };
    if (!deadline) return { label: 'Бессрочно', color: 'bg-slate-50 text-slate-400 border-slate-100', icon: <Calendar size={14} />, priority: 5 };

    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: 'Просрочено', color: 'bg-red-50 text-red-600 border-red-100 animate-pulse', icon: <AlertCircle size={14} />, priority: 1 };
    if (diff <= 7) return { label: `Срочно: ${diff} дн.`, color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <Clock size={14} />, priority: 2 };
    return { label: `До ${deadline}`, color: 'bg-slate-50 text-slate-500 border-slate-100', icon: <Calendar size={14} />, priority: 3 };
  };

  const filteredData = useMemo(() => {
    return planIndicators
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const isCompleted = (item.progress || 0) >= 100;
        const matchesTab = filter === 'all' || (filter === 'completed' ? isCompleted : !isCompleted);
        return matchesSearch && matchesTab;
      })
      .sort((a, b) => {
        const statusA = getDeadlineStatus(a.deadline, a.progress || 0);
        const statusB = getDeadlineStatus(b.deadline, b.progress || 0);
        if (statusA.priority !== statusB.priority) return statusA.priority - statusB.priority;
        // Используем weight из твоего JSON
        return (b.weight || 0) - (a.weight || 0);
      });
  }, [searchTerm, filter, planIndicators]);

  const potentialTotal = useMemo(() => {
    return planIndicators.reduce((sum, item) => sum + (item.weight || 0), 0);
  }, [planIndicators]);

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="space-y-8 text-left">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded tracking-wider">KPI Monitoring</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Личный план</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Дорожная карта баллов</h1>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {['all', 'active', 'completed'].map((id) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${filter === id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {id === 'all' ? 'Весь план' : id === 'active' ? 'В работе' : 'Завершено'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Утверждено" value={stats.approved} icon={Target} colorClass="bg-blue-100 text-blue-600" description={`Цель: ${potentialTotal}`} isPrimary={true} />
          <StatCard label="На проверке" value={stats.pending} icon={Clock} colorClass="bg-amber-100 text-amber-600" description="Ждут модерации" />
          <StatCard label="Индикаторов" value={planIndicators.length} icon={Filter} colorClass="bg-slate-100 text-slate-600" description="Всего в плане" unit="записей" />
          <StatCard label="Прогресс" value={potentialTotal > 0 ? Math.round((stats.approved / potentialTotal) * 100) : 0} icon={TrendingUp} colorClass="bg-emerald-100 text-emerald-600" description="Общий процент" unit="%" />
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск индикатора..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:border-blue-500 shadow-sm text-left"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Индикатор</th>
                  <th className="px-6 py-4 text-center">Срок</th>
                  <th className="px-6 py-4 text-center">Прогресс</th>
                  <th className="px-6 py-4 text-right">Баллы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                   <tr><td colSpan="4" className="px-6 py-20 text-center"><Loader2 className="animate-spin inline text-blue-500" /></td></tr>
                ) : filteredData.map((item) => {
                  const status = getDeadlineStatus(item.deadline, item.progress || 0);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 group">
                      <td className="px-6 py-6 text-left max-w-md">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded w-fit uppercase">{item.category}</span>
                          <span className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                          {status.icon} {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center min-w-[140px]">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-700">{item.progress || 0}%</span>
                          <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.progress >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${item.progress || 0}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                           <div className="text-right">
                              <span className="text-lg font-black text-slate-900">{item.weight}</span>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">баллов</p>
                           </div>
                           <button onClick={() => navigate(`/submit?indicator_id=${item.id}`)} className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                             <ArrowUpRight size={16} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KpiPlanMonitor;