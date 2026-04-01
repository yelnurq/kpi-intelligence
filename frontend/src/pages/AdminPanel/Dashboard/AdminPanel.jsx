import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  RefreshCw, Calendar, ShieldCheck, Activity, 
  PieChart as PieIcon, ChevronDown, ClipboardCheck,
  TrendingUp, Users, Globe, CheckCircle2
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
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFaculty]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (!stats) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-4 font-sans">
      <div className="relative">
        <RefreshCw className="animate-spin text-blue-600" size={48} />
        <div className="absolute inset-0 blur-xl bg-blue-400/20 animate-pulse rounded-full"></div>
      </div>
      <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Lumina Intelligence System</span>
    </div>
  );

  const planData = [
    { name: 'Утверждено', value: stats.plan_monitoring.approved, color: '#10B981' },
    { name: 'Проверка', value: stats.plan_monitoring.pending, color: '#FBBF24' },
    { name: 'Отклонено', value: stats.plan_monitoring.rejected, color: '#F43F5E' },
  ];

  const completionRate = Math.round((stats.plan_monitoring.approved / stats.plan_monitoring.total) * 100) || 0;

  return (
    <main className="mx-auto px-6 md:px-12 py-12 bg-[#F8FAFC] min-h-screen font-sans text-left text-slate-900">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
              <Globe size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic">KPI / Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               Панель управления университетом
            </p>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${stats.ldap ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
               {stats.ldap ? '• LDAP Synchronized' : '• Local Mode'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative group">
            <select 
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="appearance-none bg-white border-2 border-slate-100 text-slate-700 px-6 py-4 pr-14 rounded-2xl text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-all shadow-sm hover:shadow-md cursor-pointer w-full sm:min-w-[280px]"
            >
              <option value="all">Глобальный мониторинг</option>
              {stats.faculties?.map(f => (
                <option key={f.id} value={f.id}>{f.short_title || f.title}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <button 
            onClick={fetchDashboard} 
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Update' : 'Refresh'}
          </button>
        </div>
      </header>

      {/* TOP ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        
        {/* DONUT CHART: PLAN STATUS */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={80} />
          </div>
          
          <div className="mb-6 relative z-10">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <ClipboardCheck size={16} /> Статус планов
            </h3>
          </div>
          
          <div className="h-[240px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black italic">{completionRate}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Выполнено</span>
            </div>
          </div>

          <div className="space-y-3 mt-6">
             {planData.map((item, i) => (
               <div key={i} className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900 italic">{item.value}</span>
               </div>
             ))}
          </div>
        </div>

        {/* AREA CHART: TIMELINE */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-1">
              <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Calendar size={16} /> Хронология активности
              </h3>
              <p className="text-sm font-bold text-slate-400">Динамика входящих заявок за 2 недели</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100">
               <TrendingUp size={14} />
               <span className="text-[11px] font-black uppercase tracking-tighter">Active Growth</span>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '12px 16px' }}
                />
                <Area 
                  type="monotone" 
                  name="Заявки" 
                  dataKey="received" 
                  stroke="#2563EB" 
                  strokeWidth={4} 
                  fill="url(#colorBlue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* BAR CHART: FACULTY PERFORMANCE */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="space-y-1">
              <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={16} /> Исполнительская дисциплина
              </h3>
              <p className="text-sm font-bold text-slate-400 italic">Срез по подразделениям университета</p>
            </div>
            
            <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
               {[
                 { label: 'OK', color: 'bg-emerald-500' },
                 { label: 'WAIT', color: 'bg-amber-400' },
                 { label: 'FAIL', color: 'bg-rose-500' }
               ].map((tag, i) => (
                 <div key={i} className="flex items-center gap-2 px-2">
                    <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                    <span className="text-[9px] font-black text-slate-500 uppercase">{tag.label}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.faculty_analysis} layout="vertical" barGap={8}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fontWeight: 900, fill: '#64748B'}} 
                  width={110} 
                />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }}
                />
                <Bar name="Готово" dataKey="approved" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} barSize={16} />
                <Bar name="В работе" dataKey="pending" stackId="a" fill="#FBBF24" radius={[0, 0, 0, 0]} barSize={16} />
                <Bar name="Просрочено" dataKey="rejected" stackId="a" fill="#F43F5E" radius={[0, 8, 8, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INFRASTRUCTURE & STATS */}
        <div className="lg:col-span-2 space-y-8">
          {/* USER SYSTEM CARD */}
          <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl shadow-blue-100 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 p-8 text-white/10 group-hover:rotate-12 transition-transform duration-500">
               <Users size={120} />
            </div>
            
            <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8">System Infrastructure</h3>
            
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-4xl font-black italic tracking-tighter mb-1">
                  {stats.users_db + stats.users_ldap}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Всего пользователей</p>
              </div>
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black">
                     {String.fromCharCode(64 + i)}
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                   +
                 </div>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase">LDAP Directory</span>
                <span className="text-sm font-black text-blue-400 italic">{stats.users_ldap}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Local Database</span>
                <span className="text-sm font-black text-white italic">{stats.users_db}</span>
              </div>
            </div>
          </div>

          {/* QUICK STATUS INFO */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">LDAP Security</p>
                   <p className="text-lg font-black italic">Active Protocol</p>
                </div>
                <CheckCircle2 size={32} className="text-emerald-500" />
             </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default AdminDashboard;