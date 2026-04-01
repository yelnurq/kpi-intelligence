import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
  Legend
} from 'recharts';
import { 
  RefreshCw, Calendar, Activity, ChevronDown, ChevronRight, ClipboardCheck, 
  TrendingUp, Users, Globe, CheckCircle2, Terminal, 
  History, Database, LayoutDashboard, Mail, Search, Loader2,
  AlertCircle, Timer,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ (в твоем стиле) ---
const StatCard = ({ icon: Icon, label, value, colorClass, description }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-left">{description}</p>
  </div>
);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-6 font-sans text-left">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">Lumina Intelligence</span>
    </div>
  );

  const planData = [
    { name: 'Утверждено', value: stats.plan_monitoring.approved, color: '#2563eb' },
    { name: 'Проверка', value: stats.plan_monitoring.pending, color: '#f59e0b' },
    { name: 'Отклонено', value: stats.plan_monitoring.rejected, color: '#ef4444' },
  ];

  const completionRate = Math.round((stats.plan_monitoring.approved / stats.plan_monitoring.total) * 100) || 0;

  return (
    <main className="mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      
      {/* HEADER (Как в LdapManagement) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">KPI Intelligence System</h1>
          <p className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Globe size={14} className="text-blue-500" /> 
            Панель глобального мониторинга университета
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 px-6 py-3.5 pr-12 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer w-full md:min-w-[280px]"
            >
              <option value="all">Все подразделения</option>
              {stats.faculties?.map(f => (
                <option key={f.id} value={f.id}>{f.short_title || f.title}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <button 
            onClick={fetchDashboard} 
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Обновить
          </button>
        </div>
      </div>

      {/* STATS ROW (StatCards как в твоем примере) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Всего пользователей" 
          value={stats.users_db + stats.users_ldap} 
          icon={Users} 
          colorClass="bg-slate-100 text-slate-600" 
          description="Общая база сотрудников" 
        />
        <StatCard 
          label="Синхронизация LDAP" 
          value={stats.ldap ? 'Активна' : 'Отключена'} 
          icon={CheckCircle2} 
          colorClass="bg-emerald-100 text-emerald-600" 
          description="Статус AD соединения" 
        />
        <StatCard 
          label="Системный аудит" 
          value={stats.api_logs_total?.toLocaleString()} 
          icon={Database} 
          colorClass="bg-blue-100 text-blue-600" 
          description="Записей в логах" 
        />
    
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
        {/* DONUT CHART */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      {/* Заголовок */}
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ClipboardCheck size={14} className="text-blue-500" /> Статус индивидуальных планов
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 italic">Годовой цикл отчетности</p>
      </div>
      
      {/* Центрированный график */}
      <div className="h-[220px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={planData}
              innerRadius={65}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {planData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Индикатор % внутри круга */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-900 tracking-tighter">
            {completionRate}%
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Готово</span>
        </div>
      </div>

      {/* Список статусов (Легенда) */}
      <div className="space-y-2 mt-6">
         {planData.map((item, i) => (
           <div key={i} className="flex justify-between items-center px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 transition-hover hover:bg-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{item.value} шт.</span>
           </div>
         ))}
      </div>

      {/* Подробное описание статусов для пользователя */}
      <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
        <div className="flex gap-3">
          <CheckCircle size={16} className="text-emerald-500 shrink-0" />
          <p className="text-[11px] text-slate-600 leading-snug">
            <span className="font-bold block text-slate-800 uppercase text-[9px] mb-0.5">Утверждено:</span>
            Планы, прошедшие полную проверку и подписанные руководством.
          </p>
        </div>

        <div className="flex gap-3">
          <Timer size={16} className="text-amber-500 shrink-0" />
          <p className="text-[11px] text-slate-600 leading-snug">
            <span className="font-bold block text-slate-800 uppercase text-[9px] mb-0.5">На согласовании:</span>
            Планы в процессе корректировки. Требуют внимания до закрытия отчетного периода.
          </p>
        </div>

        <div className="flex gap-3">
          <Info size={16} className="text-red-500 shrink-0" />
          <p className="text-[11px] text-slate-600 leading-snug">
            <span className="font-bold block text-slate-800 uppercase text-[9px] mb-0.5">Критично:</span>
            Сотрудники еще не приступали к заполнению. Высокий риск срыва годового графика.
          </p>
        </div>
      </div>
    </div>

        <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" /> Хронология активности
          </h3>
          <p className="text-sm font-bold text-slate-900">Динамика подачи заявок на проверку (14 дней)</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase border border-emerald-100 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Active Monitoring
        </div>
      </div>

      {/* Контейнер графика */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.timeline}>
            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />

          <Area 
            type="monotone" 
            dataKey="received" // Общий поток
            stroke="#2563eb" 
            fill="url(#colorBlue)" 
            name="Поступило заявок"
          />
          <Area 
            type="monotone" 
            dataKey="processed" // Отработанные
            stroke="#10b981" 
            fill="none" // Чтобы не перекрывать основной график
            strokeDasharray="5 5" // Сделаем пунктиром для отличия
            name="Отработано"
          />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Аналитический блок под графиком */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-50 pt-6">
        <div className="flex gap-4">
          <div className="p-3 bg-blue-50 rounded-xl h-fit">
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase mb-1">Пики активности</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              График фиксирует моменты массовой сдачи планов на проверку. Резкие скачки обычно сигнализируют о приближении внутренних дедлайнов.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="p-3 bg-amber-50 rounded-xl h-fit">
            <Zap size={20} className="text-amber-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase mb-1">Нагрузка на проверяющих</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Позволяет прогнозировать нагрузку на администрацию. Чем выше область графика, тем больше заявок поступило в систему для верификации.
            </p>
          </div>
        </div>
      </div>
    </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

    <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
            <Activity size={14} className="text-blue-500" /> Исполнительская дисциплина
          </h3>
          <p className="text-sm text-slate-500">Контроль соблюдения дедлайнов по факультетам</p>
        </div>
      </div>

      {/* График */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={stats.faculty_analysis} 
            layout="vertical"
            margin={{ left: 0, right: 20 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 11, fontWeight: 700, fill: '#64748b'}} 
              width={100} 
            />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 600 }}
            />
            {/* Зеленые: Отработано в срок */}
            <Bar 
              name="Отработано (в срок)" 
              dataKey="approved" 
              stackId="a" 
              fill="#10b981" 
              barSize={14} 
            />
            {/* Желтые: В процессе */}
            <Bar 
              name="В работе" 
              dataKey="pending" 
              stackId="a" 
              fill="#f59e0b" 
              barSize={14} 
            />
            {/* Красные: Просрочено */}
            <Bar 
              name="Просрочено / Не сдано" 
              dataKey="rejected" 
              stackId="a" 
              fill="#ef4444" 
              radius={[0, 4, 4, 0]} 
              barSize={14} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Подробное описание логики дедлайнов */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
        <div className="flex gap-3">
          <div className="mt-1">
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">Исполнено в срок</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Заявки, по которым работа завершена полностью. Факультет своевременно предоставил данные до наступления дедлайна.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="mt-1">
            <AlertCircle size={18} className="text-red-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">Нарушение дедлайна</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Критическая зона: время на выполнение истекло, но заявки не закрыты или отчеты не были загружены в систему.
            </p>
          </div>
        </div>
      </div>
    </div>

        {/* SYSTEM AUDIT & LOGS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden group shadow-xl">
             <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6">User Directory Details</p>
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h4 className="text-4xl font-bold tracking-tighter">{(stats.users_db + stats.users_ldap).toLocaleString()}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total System Users</p>
                  </div>
                  <div className="flex -space-x-3">
                    <div className="border-b flex items-center justify-center text-[10px] font-bold">
                      <Link to={'/admin/users'}>Смотреть подробно</Link>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">LDAP Sync Users</span>
                    <span className="text-sm font-bold text-blue-400">{stats.users_ldap}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Local DB Users</span>
                    <span className="text-sm font-bold text-white">{stats.users_db}</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                  <Terminal size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Всего событий (логов)</p>
                  <p className="text-md font-bold text-slate-900">{stats.api_logs_total} запросов</p>
               </div>
             </div>
             <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
          </div>
        </div>

      </div>
    </main>
  );
};

export default AdminDashboard;