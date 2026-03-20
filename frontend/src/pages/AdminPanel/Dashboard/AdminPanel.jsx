import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, ShieldCheck, AlertCircle, Layers, 
  ArrowUpRight, Download, Search, Filter, Clock, ArrowRight,
  CheckCircle, XCircle, GraduationCap, TrendingUp, 
  Star, Target, Zap, ChevronRight, Award
} from 'lucide-react';

// --- РАСШИРЕННЫЕ ФЕЙКОВЫЕ ДАННЫЕ ---

// Эффективность факультетов
const facultyPerformance = [
  { name: 'ИТ и Инжиниринг', points: 4500, users: 45, avg: 100, color: '#2563eb' },
  { name: 'Экономика', points: 3200, users: 38, avg: 84, color: '#7c3aed' },
  { name: 'Гуманитарный', points: 2800, users: 50, avg: 56, color: '#db2777' },
  { name: 'Медицина', points: 4100, users: 30, avg: 136, color: '#059669' },
  { name: 'Дизайн', points: 1900, users: 20, avg: 95, color: '#ea580c' },
];

// Статус заявок
const submissionStatus = [
  { name: 'Одобрено', value: 65, color: '#10b981' },
  { name: 'На проверке', value: 20, color: '#2563eb' },
  { name: 'Просрочено', value: 15, color: '#ef4444' },
];

// Динамика набора баллов по месяцам (учебный год)
const monthlyTrend = [
  { month: 'Сент', points: 1200 }, { month: 'Окт', points: 2100 },
  { month: 'Нояб', points: 1800 }, { month: 'Дек', points: 4200 },
  { month: 'Янв', points: 1500 }, { month: 'Фев', points: 2800 },
  { month: 'Март', points: 3400 },
];

// Топ сотрудников
const topPerformers = [
  { name: 'Ахметов Алмаз', faculty: 'ИТ', points: 840, avatar: 'А', color: 'bg-blue-500' },
  { name: 'Иванова Елена', faculty: 'Медицина', points: 790, avatar: 'И', color: 'bg-emerald-500' },
  { name: 'Смит Джон', faculty: 'Экономика', points: 720, avatar: 'С', color: 'bg-purple-500' },
];

const AdminStatCard = ({ icon: Icon, label, value, trend, colorClass, subtitle }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <Icon size={22} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-full uppercase ${trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
          <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
        <span className="text-[10px] text-slate-400 font-bold uppercase">{subtitle}</span>
      </div>
    </div>
  </div>
);

const AdminPanel = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Intelligence v2.0</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Университетский Дашборд</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              placeholder="Поиск по базе..." 
              className="pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold uppercase tracking-wider focus:ring-4 ring-blue-50 focus:outline-none w-64 shadow-sm transition-all"
            />
          </div>
          <button className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-slate-200 hover:bg-blue-600 active:scale-95 transition-all">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* 2. TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard icon={Users} label="Всего в штате" value="184" trend={12} colorClass="bg-slate-900 text-white" subtitle="человек" />
        <AdminStatCard icon={ShieldCheck} label="На модерации" value="42" colorClass="bg-blue-600 text-white" subtitle="заявок" />
        <AdminStatCard icon={Target} label="Средний KPI" value="92.4" trend={-3} colorClass="bg-emerald-500 text-white" subtitle="балла" />
        <AdminStatCard icon={Zap} label="Активность" value="88%" colorClass="bg-amber-400 text-slate-900" subtitle="высокая" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3. ДИНАМИКА НАБОРА БАЛЛОВ (LINE CHART) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-black text-slate-900 text-lg tracking-tight uppercase tracking-widest flex items-center gap-3">
                <TrendingUp size={20} className="text-blue-600" /> Активность публикаций
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Динамика набора баллов за семестр</p>
            </div>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-full uppercase">2025-2026 Уч. год</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="points" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorPoints)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. TOP PERFORMERS LIST */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <Award size={16} className="text-amber-500" /> Лидеры рейтинга
          </h3>
          <div className="space-y-6">
            {topPerformers.map((person, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${person.color} rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
                    {person.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{person.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{person.faculty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-blue-600">{person.points}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Баллов</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 border-2 border-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all">
            Весь рейтинг
          </button>
        </div>

        {/* 5. FACULTY BAR CHART */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Эффективность по подразделениям</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facultyPerformance}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 9, fontWeight: 700}} />
                        <YAxis axisLine={false} tickLine={false} hide />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '15px', border: 'none'}} />
                        <Bar dataKey="points" radius={[10, 10, 10, 10]} barSize={40}>
                            {facultyPerformance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* 6. PIE CHART STATUS */}
        <div className="lg:col-span-5 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
            <div className="relative h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={submissionStatus} innerRadius={60} outerRadius={85} paddingAngle={10} dataKey="value" stroke="none" cornerRadius={12}>
                            {submissionStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">65%</span>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-6">
                {submissionStatus.map((s) => (
                    <div key={s.name} className="text-center p-3 rounded-2xl bg-slate-50">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{s.name}</p>
                        <p className="text-xs font-black text-slate-900">{s.value}%</p>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* 7. MODERATION QUEUE */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase tracking-widest">
              <Clock size={20} className="text-blue-600" /> Очередь проверки
            </h3>
          </div>
          <button className="group flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
            Архив заявок <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Сотрудник</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Категория деятельности</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Баллы</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Модерация</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'Ахметов А.', role: 'Профессор', cat: 'Публикация Scopus Q1', points: '+250', time: '12 мин. назад', color: 'bg-blue-50' },
                { name: 'Макарова И.', role: 'Старший преп.', cat: 'Разработка учебного пособия', points: '+120', time: '1 час назад', color: 'bg-purple-50' },
                { name: 'Беков М.', role: 'Доцент', cat: 'Научное руководство PhD', points: '+180', time: '3 часа назад', color: 'bg-emerald-50' }
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${row.color} flex items-center justify-center font-black text-slate-600 text-[10px]`}>
                        {row.name.split(' ')[0][0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{row.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{row.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-[11px] font-bold text-slate-600">{row.cat}</p>
                    <p className="text-[9px] text-blue-500 font-black mt-1 uppercase tracking-tighter italic">{row.time}</p>
                  </td>
                  <td className="py-5 text-center">
                    <span className="text-xs font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl">{row.points}</span>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm">
                        <CheckCircle size={18} />
                      </button>
                      <button className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm">
                        <XCircle size={18} />
                      </button>
                    </div>
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

export default AdminPanel;