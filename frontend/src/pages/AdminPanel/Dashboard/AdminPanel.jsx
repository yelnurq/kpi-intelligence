import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { 
  RefreshCw, Calendar, ShieldCheck, Activity, 
  ChevronDown, ClipboardCheck, TrendingUp, Users, 
  Globe, CheckCircle2, Terminal, History, Database,
  Layers, ChevronRight, Server
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:8000/api/admin/dashboard?faculty_id=${selectedFaculty}`;
      const res = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json' 
        }
      });
      const result = await res.json();
      if (result.status === 'success') {
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Critical system error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFaculty]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (!stats) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] gap-6 font-sans">
      <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-blue-400/60">System Booting...</span>
    </div>
  );

  const planData = [
    { name: 'Утверждено', value: stats.plan_monitoring.approved, color: '#0F172A' }, // Темный для серьезности
    { name: 'Проверка', value: stats.plan_monitoring.pending, color: '#334155' },
    { name: 'Отклонено', value: stats.plan_monitoring.rejected, color: '#94A3B8' },
  ];

  const completionRate = Math.round((stats.plan_monitoring.approved / stats.plan_monitoring.total) * 100) || 0;

  return (
    <main className="mx-auto min-h-screen bg-[#F1F5F9] font-sans text-slate-900 border-x border-slate-200">
      
      {/* TOP SYSTEM BAR */}
      <div className="bg-[#0F172A] text-white px-8 py-3 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-400">Control Panel v4.0</span>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Server: Active</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Auth: {stats.ldap ? 'LDAP_PROT_SECURED' : 'LOCAL_STORAGE_ONLY'}
        </div>
      </div>

      <div className="px-6 md:px-12 py-10">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-b border-slate-300 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Layers size={28} className="text-slate-900" strokeWidth={2.5} />
              <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">Intelligence <span className="text-blue-600">.</span></h1>
            </div>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest leading-none">
              Аналитический департамент мониторинга KPI
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <select 
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="appearance-none bg-white border border-slate-300 text-slate-700 px-5 py-3 pr-12 rounded-sm text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer w-full sm:min-w-[300px]"
              >
                <option value="all">Глобальный сектор</option>
                {stats.faculties?.map(f => (
                  <option key={f.id} value={f.id}>{f.short_title || f.title}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <button 
              onClick={fetchDashboard} 
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-700 text-white px-6 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Processing' : 'Update Data'}
            </button>
          </div>
        </header>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          
          {/* DONUT CHART: PLAN STATUS */}
          <div className="lg:col-span-1 bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-8 border-l-4 border-slate-900 pl-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Статус выполнения</h3>
              <p className="text-lg font-black uppercase tracking-tight">Core Monitoring</p>
            </div>
            
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planData}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{completionRate}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Passed</span>
              </div>
            </div>

            <div className="space-y-2 mt-8">
               {planData.map((item, i) => (
                 <div key={i} className="flex justify-between items-center px-3 py-2 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-none" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-900">{item.value}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* AREA CHART: TIMELINE */}
          <div className="lg:col-span-3 bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest tracking-[0.2em]">Активность заявок</h3>
                <p className="text-lg font-black uppercase tracking-tight">Timeline Analytics</p>
              </div>
              <div className="text-[10px] font-bold bg-slate-100 px-3 py-1 border border-slate-200 uppercase">Period: 14D</div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.timeline}>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 9, fontWeight: 700, fill: '#94A3B8'}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 9, fontWeight: 700, fill: '#94A3B8'}} 
                  />
                  <Tooltip 
                    contentStyle={{ background: '#0F172A', border: 'none', color: '#fff', borderRadius: '0px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="stepAfter" 
                    dataKey="received" 
                    stroke="#2563EB" 
                    strokeWidth={2} 
                    fill="#EFF6FF" 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* PERFORMANCE BAR */}
          <div className="lg:col-span-3 bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="border-l-4 border-slate-900 pl-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Дисциплина подразделений</h3>
                <p className="text-lg font-black uppercase tracking-tight">Faculty Rankings</p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.faculty_analysis} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 800, fill: '#1E293B'}} 
                    width={100} 
                  />
                  <Tooltip cursor={{fill: '#F8FAFC'}} />
                  <Bar dataKey="approved" stackId="a" fill="#0F172A" barSize={12} />
                  <Bar dataKey="pending" stackId="a" fill="#475569" barSize={12} />
                  <Bar dataKey="rejected" stackId="a" fill="#CBD5E1" barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SYSTEM INFO */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0F172A] p-8 rounded-sm text-white relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-6">User Infrastructure</p>
                  <div className="flex items-end gap-4 mb-8">
                    <span className="text-5xl font-black tracking-tighter italic">{(stats.users_db + stats.users_ldap).toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase pb-2 underline decoration-blue-500 underline-offset-4">Database Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10">
                      <p className="text-[9px] font-bold text-slate-500 uppercase">LDAP Sync</p>
                      <p className="text-xl font-bold">{stats.users_ldap}</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10">
                      <p className="text-[9px] font-bold text-slate-500 uppercase">Local Users</p>
                      <p className="text-xl font-bold">{stats.users_db}</p>
                    </div>
                  </div>
               </div>
               <Server size={120} className="absolute -right-8 -bottom-8 opacity-5" />
            </div>

            <div className="bg-white border border-slate-200 p-6 flex justify-between items-center group cursor-pointer hover:bg-slate-50 transition-colors">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-slate-100 text-slate-900 border border-slate-200">
                    <History size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">System Audit</p>
                    <p className="text-sm font-bold uppercase">{stats.api_logs_total?.toLocaleString()} Logs Recorded</p>
                 </div>
               </div>
               <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-6 flex items-center gap-4">
               <CheckCircle2 className="text-emerald-600" size={24} />
               <div>
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Security Protocol</p>
                  <p className="text-xs font-bold text-emerald-800 uppercase">Data Integrity Verified via SHA-256</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;