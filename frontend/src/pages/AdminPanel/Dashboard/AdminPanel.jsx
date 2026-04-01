import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  FileText, CheckCircle2, Clock, XCircle, Users,
  RefreshCw, ExternalLink, Globe, Database, 
  Calendar, Server, ShieldCheck, PieChart as PieIcon
} from 'lucide-react';

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
      const token = localStorage.getItem("token");
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:8000/api/admin/dashboard?${query}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const result = await res.json();
      if (result.status === 'success') {
        setData(result.data || []);
        setStats(result.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (!stats) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-4 font-sans">
      <RefreshCw className="animate-spin text-blue-600" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing System...</span>
    </div>
  );

  return (
    <main className="mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase">KPI Intelligence / Admin</h1>
          <p className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-bold uppercase text-[10px] tracking-widest">
            <ShieldCheck size={14} className="text-blue-500" /> System Root: Authorized
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchDashboard} className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Update
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Всего заявок" value={stats.total} icon={FileText} colorClass="bg-slate-100 text-slate-600" description="Общий объем данных" />
        <StatCard label="Принято" value={stats.approved} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600" description="Успешный KPI" />
        <StatCard label="Ожидают" value={stats.pending} icon={Clock} colorClass="bg-amber-100 text-amber-600" description="Требуют проверки" />
        <StatCard label="Отказ" value={stats.rejected} icon={XCircle} colorClass="bg-rose-100 text-rose-600" description="Несоответствие" />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* LINE CHART */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" /> Processing Timeline
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={3} fill="url(#colorBlue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART С ФИКСОМ ВИДИМОСТИ */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <PieIcon size={14} className="text-indigo-500" /> User Allocation
          </h3>
          
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getUserDistributionData()}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  minAngle={20} // ГАРАНТИРУЕТ ВИДИМОСТЬ МАЛЫХ СЕКТОРОВ
                >
                  {getUserDistributionData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      strokeWidth={0} 
                      className="outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Центр круга с общей цифрой */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
              <p className="text-xl font-black text-slate-900 leading-none">{(stats.users_db || 0) + (stats.users_ldap || 0)}</p>
            </div>
          </div>

          {/* Кастомная легенда с четкими цифрами (3 и 1000) */}
          <div className="mt-6 space-y-3">
            {getUserDistributionData().map((item, idx) => (
              <div key={idx} className="flex justify-between items-center px-4 py-3 rounded-xl border border-slate-50 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 tracking-tighter">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Data Verification Ledger</h3>
          <div className="flex gap-2">
             {['all', 'pending', 'approved'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilters({...filters, status: s})}
                  className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${filters.status === s ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-900'}`}
                >
                  {s}
                </button>
             ))}
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Indicator</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs border border-indigo-100">
                      {item.user_name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.user_name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{item.user?.faculty?.short_title || 'Univer'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-slate-600">{item.title}</td>
                <td className="px-8 py-5 text-center font-black text-lg text-slate-900 italic tracking-tighter">{item.total_points}</td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border 
                    ${item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminDashboard;