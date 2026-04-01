import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { 
  FileText, CheckCircle2, Clock, XCircle, 
  RefreshCw, ExternalLink, Calendar, ShieldCheck, 
  PieChart as PieIcon, Activity
} from 'lucide-react';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

const StatCard = ({ icon: Icon, label, value, colorClass, description }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass} shadow-sm`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-left leading-relaxed italic">
      {description}
    </p>
  </div>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ---

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ faculty: 'all', status: 'all' });

  // Получаем динамические данные из API для графика факультетов
  const getFacultyAnalysis = () => {
    if (!stats || !stats.faculty_analysis) return [];
    return stats.faculty_analysis;
  };

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
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json' 
        }
      });
      const result = await res.json();
      if (result.status === 'success') {
        setData(result.data || []);
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (!stats) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-4 font-sans">
      <RefreshCw className="animate-spin text-blue-600" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Lumina System...</span>
    </div>
  );

  return (
    <main className="mx-auto px-6 md:px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">KPI Intelligence / Admin</h1>
          <p className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-bold uppercase text-[10px] tracking-widest">
            <ShieldCheck size={14} className="text-blue-500" /> System Root: {stats.ldap ? 'LDAP Active' : 'DB Only Mode'}
          </p>
        </div>
        <button 
          onClick={fetchDashboard} 
          disabled={loading}
          className="flex items-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Updating...' : 'Refresh Data'}
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Всего заявок" value={stats.total} icon={FileText} colorClass="bg-slate-100 text-slate-600" description="Общий объем поданных KPI" />
        <StatCard label="Принято" value={stats.approved} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" description="Подтвержденные баллы" />
        <StatCard label="Ожидают" value={stats.pending} icon={Clock} colorClass="bg-amber-50 text-amber-600" description="В очереди на проверку" />
        <StatCard label="Просрочено" value={stats.rejected} icon={XCircle} colorClass="bg-rose-50 text-rose-600" description="Нарушение дедлайнов" />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* LINE CHART: Timeline */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" /> Activity Timeline
            </h3>
          </div>
          <div className="h-[300px] w-full">
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
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={3} fill="url(#colorBlue)" />
                <Area type="monotone" dataKey="verified" stroke="#10B981" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART: User Distribution */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <PieIcon size={14} className="text-indigo-500" /> Infrastructure
          </h3>
          
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getUserDistributionData()}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {getUserDistributionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
              <p className="text-2xl font-black text-slate-900 leading-none italic tracking-tighter">
                {stats.users_db + stats.users_ldap}
              </p>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            {getUserDistributionData().map((item, idx) => (
              <div key={idx} className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 tracking-tighter">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FACULTY DEADLINE ANALYSIS */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity size={14} className="text-blue-500" /> Faculty Deadline Analysis
          </h3>
          <div className="flex flex-wrap gap-4">
             <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Completed</div>
             <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase"><div className="w-2 h-2 rounded-full bg-amber-400"/> Pending</div>
             <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase"><div className="w-2 h-2 rounded-full bg-rose-500"/> Overdue</div>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getFacultyAnalysis()} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 900, fill: '#64748B'}} 
                width={80}
              />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }} />
              <Bar dataKey="approved" stackId="a" fill="#10B981" barSize={12} />
              <Bar dataKey="pending" stackId="a" fill="#FBBF24" barSize={12} />
              <Bar dataKey="rejected" stackId="a" fill="#F43F5E" barSize={12} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Live KPI Stream</h3>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-inner">
             {['all', 'pending', 'approved'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilters({...filters, status: s})}
                  className={`text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-lg transition-all ${filters.status === s ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {s}
                </button>
             ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee / Faculty</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Indicator</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg italic">
                        {item.user_name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm tracking-tight">{item.user_name}</h4>
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">{item.user?.faculty?.short_title || 'General'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-600 tracking-tight leading-tight line-clamp-1">{item.title}</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="font-black text-lg text-slate-900 italic tracking-tighter">{item.total_points}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all
                      ${item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm active:scale-90">
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;