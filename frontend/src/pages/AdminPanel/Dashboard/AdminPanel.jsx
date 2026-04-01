import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  FileText, CheckCircle2, Clock, XCircle, Users,
  Filter, RefreshCw, ExternalLink, Globe, Database, 
  LayoutDashboard, Calendar, Server, ShieldCheck, PieChart as PieIcon
} from 'lucide-react';

// Компонент карточки статистики
const StatCard = ({ icon: Icon, label, value, colorClass, description }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-left leading-relaxed">
      {description}
    </p>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ faculty: 'all', status: 'all' });

  // Формирование данных для PieChart
  const getUserDistributionData = () => {
    if (!stats) return [];
    return [
      { name: 'Локальная БД', value: stats.users_db || 0, color: '#3B82F6' },
      { name: 'Active Directory', value: stats.users_ldap || 0, color: '#6366F1' },
    ];
  };

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const token = localStorage.getItem("token");
      
      const res = await fetch(`http://localhost:8000/api/admin/dashboard?${query}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json' 
        }
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const result = await res.json();
      if (result.status === 'success') {
        setData(result.data || []);
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (!stats) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-4">
      <RefreshCw className="animate-spin text-blue-600" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Синхронизация с сервером...</span>
    </div>
  );

  return (
    <main className="mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase">KPI Intelligence / Admin</h1>
          <p className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-bold uppercase text-[10px] tracking-widest">
            <ShieldCheck size={14} className="text-blue-500" /> 
            Специализация: {stats.specialization || 'Глобальный аудит'}
          </p>
        </div>

        <div className="flex gap-3">
            <button onClick={fetchDashboard} disabled={loading} className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all disabled:opacity-50">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Загрузка...' : 'Обновить данные'}
            </button>
            <div className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest border ${stats.ldap ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                <Server size={16} /> AD: {stats.ldap ? 'Online' : 'Offline'}
            </div>
        </div>
      </div>

      {/* KPI СТАТИСТИКА (4 КАРТОЧКИ) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="Всего заявок" value={stats.total} icon={FileText} colorClass="bg-slate-100 text-slate-600" description="Общий поток за период" />
        <StatCard label="Принято" value={stats.approved} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600" description="Прошли верификацию" />
        <StatCard label="Ожидают" value={stats.pending} icon={Clock} colorClass="bg-amber-100 text-amber-600" description="На рассмотрении" />
        <StatCard label="Отказ" value={stats.rejected} icon={XCircle} colorClass="bg-rose-100 text-rose-600" description="Отклоненные записи" />
      </div>

      {/* ИНФРАСТРУКТУРНЫЕ МЕТРИКИ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatCard label="Пользователей в БД" value={stats.users_db} icon={Users} colorClass="bg-blue-100 text-blue-600" description="Активные в системе" />
        <StatCard label="Найдено в домене" value={stats.users_ldap} icon={Database} colorClass="bg-indigo-100 text-indigo-600" description="Всего в OU Univer" />
        <StatCard label="Статус шифрования" value={stats.ldap ? "Secure" : "Unsafe"} icon={Globe} colorClass={stats.ldap ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"} description="TLS TLS_REQCERT шлюз" />
      </div>

      {/* ГРАФИКИ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Линейный график */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" /> Динамика за 14 дней
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline}>
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorVer" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }} />
                <Area name="Поступило" type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={3} fill="url(#colorRec)" />
                <Area name="Одобрено" type="monotone" dataKey="verified" stroke="#10B981" strokeWidth={3} fill="url(#colorVer)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Круговая диаграмма */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <PieIcon size={14} className="text-indigo-500" /> Состав пользователей
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getUserDistributionData()}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={10}
                  dataKey="value"
                >
                  {getUserDistributionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={6} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  content={({ payload }) => (
                    <div className="flex flex-col gap-3 mt-6">
                      {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{entry.value}</span>
                          </div>
                          <span className="text-sm font-black text-slate-900">{getUserDistributionData()[index].value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-auto pt-6 border-t border-slate-50">
             <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">
                <span>Общий охват (Университет)</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{(stats.users_db || 0) + (stats.users_ldap || 0)}</span>
             </div>
          </div>
        </div>
      </div>

      {/* ТАБЛИЦА */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Последние записи KPI</h3>
            <div className="flex gap-4">
               {['all', 'pending', 'approved', 'rejected'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setFilters({...filters, status: s})}
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all ${filters.status === s ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    {s}
                  </button>
               ))}
            </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Сотрудник</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Описание KPI</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Балл</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Статус</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200 uppercase">
                      {item.user_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.user_name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.user?.faculty?.short_title || 'Университет'}
                        </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-slate-700 leading-snug max-w-md">{item.title}</p>
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase mt-1 inline-block border border-blue-100">
                    {item.indicator?.category || item.category}
                  </span>
                </td>
                <td className="px-8 py-5 text-center font-black text-xl text-slate-900 tracking-tighter">
                  {item.total_points}
                </td>
                <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest 
                        ${item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          item.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        {item.status}
                    </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2.5 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="p-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            Записей не найдено
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;