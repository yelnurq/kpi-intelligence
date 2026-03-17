import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Users, Award, AlertCircle, LayoutDashboard, 
  Calendar, ArrowUpRight, ChevronRight, UserCheck 
} from 'lucide-react';

const AnalyticsPage = () => {
  // 1. Распределение по категориям (Donut Chart)
  const categoryData = [
    { name: 'Наука', value: 40, color: '#3b82f6' },
    { name: 'Учебная работа', value: 30, color: '#10b981' },
    { name: 'Воспитательная', value: 15, color: '#f59e0b' },
    { name: 'Повышение квалификации', value: 15, color: '#8b5cf6' },
  ];

  // 2. Сравнение План/Факт (Bar Chart)
  const performanceData = [
    { name: 'Статьи', plan: 50, fact: 42 },
    { name: 'Метод. пособия', plan: 45, fact: 20 },
    { name: 'Открытые уроки', plan: 60, fact: 55 },
    { name: 'Конференции', plan: 30, fact: 10 },
    { name: 'Сертификаты', plan: 40, fact: 38 },
  ];

  // 3. Динамика выполнения KPI по месяцам (Area Chart)
  const monthlyProgress = [
    { month: 'Сент', points: 120 },
    { month: 'Окт', points: 210 },
    { month: 'Нояб', points: 190 },
    { month: 'Дек', points: 450 }, // Закрытие семестра
    { month: 'Янв', points: 300 },
    { month: 'Фев', points: 410 },
    { month: 'Март', points: 580 },
  ];

  // 4. Топ преподавателей (Для админа/декана)
  const topPerformers = [
    { name: 'Ахметов А.Б.', score: 98, status: 'Выполнено' },
    { name: 'Зейнолла Е. Б.', score: 95, status: 'Выполнено' },
    { name: 'Иванова С.В.', score: 82, status: 'В процессе' },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Insights</h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <Calendar size={14} /> Отчетный период: 2025-2026 уч. год
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
          Скачать полный отчет <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<TrendingUp className="text-blue-600"/>} title="Ср. балл кафедры" value="442" delta="+12.5%" />
        <StatCard icon={<Users className="text-emerald-600"/>} title="Активность ППС" value="86%" delta="+4%" />
        <StatCard icon={<Award className="text-amber-600"/>} title="Подтверждено KPI" value="68%" delta="+22%" />
        <StatCard icon={<AlertCircle className="text-rose-600"/>} title="Риски дедлайнов" value="14" delta="-2" isNegative />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* График прогресса (Area Chart) - занимает 2 колонки */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Динамика набора баллов</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Текущий семестр</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProgress}>
                <defs>
                  <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorPoints)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Топ преподавателей */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">Лидеры рейтинга</h3>
          <div className="space-y-6">
            {topPerformers.map((user, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {user.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-blue-600">{user.score}%</p>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${user.score}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
            Смотреть весь список <ChevronRight size={14} />
          </button>
        </div>

        {/* План / Факт */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">Сравнение: План vs Факт</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="fact" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="plan" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Категории */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">Доли активности</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, delta, isNegative }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform cursor-pointer group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">{icon}</div>
      <div className={`flex items-center gap-1 text-xs font-black ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
        {delta} {isNegative ? '↓' : '↑'}
      </div>
    </div>
    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
    <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
  </div>
);

export default AnalyticsPage;