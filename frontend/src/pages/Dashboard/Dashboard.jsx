import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Target, Zap, TrendingUp, ChevronRight, 
  Clock, Lightbulb, Calendar, FilePlus2,
  ArrowUpRight, LayoutDashboard, MoreHorizontal
} from 'lucide-react';

const planVsFactData = [
  { name: 'Наука', plan: 300, fact: 150 },
  { name: 'Метод.раб', plan: 200, fact: 180 },
  { name: 'Общ.деят', plan: 100, fact: 20 },
];

const progressData = [
  { name: 'Выполнено', value: 350 },
  { name: 'В процессе', value: 120 },
  { name: 'Осталось', value: 130 },
];

const COLORS = ['#2563eb', '#94a3b8', '#f1f5f9']; 

const StatCard = ({ icon: Icon, label, value, trend, colorClass, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase tracking-wider">
          <ArrowUpRight size={12} strokeWidth={3} /> {trend}%
        </div>
      )}
    </div>
    <div className="mt-5">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-3xl font-black text-slate-900">{value}</p>
        <span className="text-xs text-gray-400 font-bold uppercase">{subtitle || 'баллов'}</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2025-2026');

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Дашборд активности</h1>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-gray-100 border-none text-xs font-bold text-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 mt-1">Общая статистика выполнения ваших KPI показателей</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100">
          <FilePlus2 size={18} /> Создать отчет
        </button>
      </div>

      {/* 1. STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Zap} label="Мой Текущий KPI" value="350" trend="12" colorClass="bg-blue-50 text-blue-600" />
        <StatCard icon={Target} label="Целевой План" value="600" colorClass="bg-gray-50 text-gray-600" />
        <StatCard icon={TrendingUp} label="Прогноз выполнения" value="480" trend="5" colorClass="bg-indigo-50 text-indigo-600" />
        <StatCard icon={Calendar} label="Дней до дедлайна" value="45" subtitle="дней" colorClass="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. MAIN CHART */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <LayoutDashboard size={18} className="text-blue-600" /> Аналитика по категориям
            </h3>
            <button className="text-gray-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planVsFactData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8fafc', radius: 8}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="plan" fill="#f1f5f9" radius={[6, 6, 6, 6]} name="План" barSize={32} />
                <Bar dataKey="fact" fill="#2563eb" radius={[6, 6, 6, 6]} name="Факт" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. DEADLINES SIDEBAR (Был темным) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-gray-400 uppercase tracking-widest relative z-10">
              <Clock size={16} className="text-blue-600" /> Ближайшие сроки
            </h3>
            
            <div className="space-y-5 relative z-10">
              {[
                { title: 'Завершение планирования', time: 'Осталось 3 дня', color: 'bg-blue-500', progress: 90 },
                { title: 'Отчеты за 1-й квартал', time: 'Дедлайн через 12 дней', color: 'bg-orange-500', progress: 40 },
                { title: 'Публикации Scopus', time: 'До 15 мая 2026', color: 'bg-gray-200', progress: 10 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-none mb-1">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{item.time}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 bg-gray-50 hover:bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs transition-all border border-gray-100 uppercase tracking-widest">
              Весь календарь
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
            <div className="flex gap-3">
              <Lightbulb className="text-blue-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-blue-900 uppercase tracking-tight">Умная рекомендация</p>
                <p className="text-xs text-blue-700 mt-2 leading-relaxed font-medium">
                  Ваша активность в категории <span className="font-bold underline">"Наука"</span> ниже ожидаемой.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] self-start mb-4">Общий прогресс</h3>
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={progressData} innerRadius={65} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={6}>
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">58%</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Последние подтверждения</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">Смотреть все</button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Публикация Scopus Q2', status: 'Одобрено', date: 'Вчера, 14:20', points: '+100' },
              { title: 'Курс повышения квалификации', status: 'На проверке', date: '12 марта', points: '+30' }
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${task.status === 'Одобрено' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{task.title}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{task.date} • {task.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-900">{task.points}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;