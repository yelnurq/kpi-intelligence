import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Target, Zap, TrendingUp, ChevronRight,CheckCircle, 
  Clock, Lightbulb, Calendar, FilePlus2,
  ArrowUpRight, LayoutDashboard, MoreHorizontal,
  Award, Sparkles, ArrowRight
} from 'lucide-react';

// --- Данные с градиентными привязками ---
const planVsFactData = [
  { name: 'Наука', plan: 300, fact: 150, gap: 150 },
  { name: 'Метод.раб', plan: 200, fact: 180, gap: 20 },
  { name: 'Общ.деят', plan: 100, fact: 20, gap: 80 },
  { name: 'Восп.раб', plan: 150, fact: 130, gap: 20 },
];

const progressData = [
  { name: 'Выполнено', value: 350 },
  { name: 'В процессе', value: 120 },
  { name: 'Осталось', value: 130 },
];

const COLORS = ['#2563eb', '#60a5fa', '#f1f5f9']; 

// --- Вспомогательный компонент для карточек KPI ---
const StatCard = ({ icon: Icon, label, value, trend, colorClass, subtitle, description }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500 ${colorClass}`}>
        <Icon size={22} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full uppercase tracking-wider">
          <TrendingUp size={12} /> {trend}%
        </div>
      )}
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
        <span className="text-xs text-slate-400 font-bold uppercase">{subtitle || 'баллов'}</span>
      </div>
      {description && <p className="text-[11px] text-gray-400 mt-2 font-medium leading-relaxed">{description}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2025-2026');

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">       
     {/* HEADER SECTION ДЛЯ DASHBOARD */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
  <div className="space-y-1">
  
    <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">
      Твой прогресс на сегодня
    </h1>
    <p className="text-sm text-gray-500 font-medium max-w-md">
      Аналитика активности, прогноз выполнения плана и «умные» рекомендации системы.
    </p>
  </div>
  
  <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
    <div className="text-right px-3">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Текущий сезон</p>
      <p className="text-xs font-black text-slate-900 mt-1">2025-2026</p>
    </div>
    <div className="w-[1px] h-8 bg-gray-100" />
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
      <FilePlus2 size={16} /> Создать отчет
    </button>
  </div>
</div>
     
      {/* 2. ГРИД КАРТОЧЕК KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Zap} label="Мой Текущий KPI" value="350" trend="12" colorClass="bg-blue-600 text-white" description="На 42 балла больше, чем в прошлом месяце" />
        <StatCard icon={Target} label="Целевой План" value="600" colorClass="bg-slate-100 text-slate-600" subtitle="/ 600" description="Минимальный порог для категории А" />
        <StatCard icon={TrendingUp} label="Прогноз" value="480" trend="5" colorClass="bg-indigo-100 text-indigo-600" description="Ожидаемый результат к концу мая" />
        <StatCard icon={Award} label="Рейтинг" value="#4" subtitle="место" colorClass="bg-amber-100 text-amber-600" description="Среди 120 сотрудников кафедры" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. ГЛАВНЫЙ ГРАФИК */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-black text-slate-900 text-lg tracking-tight uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-6 bg-blue-600 rounded-full" /> Распределение баллов
              </h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Сравнение плановых и фактических показателей</p>
            </div>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
               <button className="px-3 py-1.5 text-[10px] font-black bg-white shadow-sm rounded-lg text-slate-900 uppercase">План/Факт</button>
               <button className="px-3 py-1.5 text-[10px] font-black text-gray-400 rounded-lg uppercase hover:text-slate-600 transition-colors">Динамика</button>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planVsFactData} barGap={12}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 12}} 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px'}}
                />
                <Bar dataKey="plan" fill="#f1f5f9" radius={[12, 12, 12, 12]} name="План" barSize={40} />
                <Bar dataKey="fact" fill="url(#barGradient)" radius={[12, 12, 12, 12]} name="Факт" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. SIDEBAR - DEADLINES & RECOMMENDATIONS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black mb-8 flex items-center gap-2 text-gray-400 uppercase tracking-[0.2em]">
              <Clock size={16} className="text-blue-600" /> Ближайшие сроки
            </h3>
            
            <div className="space-y-6">
              {[
                { title: 'Завершение планирования', time: 'Осталось 3 дня', color: 'bg-blue-600', progress: 90, status: 'Критично' },
                { title: 'Отчеты за 1-й квартал', time: 'Дедлайн через 12 дней', color: 'bg-orange-500', progress: 40, status: 'В работе' },
                { title: 'Публикации Scopus', time: 'До 15 мая 2026', color: 'bg-slate-200', progress: 10, status: 'Запланировано' }
              ].map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-none group-hover:text-blue-600 transition-colors">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">{item.time}</p>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase">{item.status}</span>
                  </div>
                  <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
                    <div className={`${item.color} h-full transition-all duration-1000 shadow-[0_0_12px_rgba(37,99,235,0.2)]`} style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 group flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
              Весь календарь <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Lightbulb size={60} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">AI Советник</p>
            <p className="text-sm font-bold mt-4 leading-relaxed">
              Ваша активность в категории <span className="underline decoration-blue-300 underline-offset-4">"Наука"</span> ниже ожидаемой на 40%. 
            </p>
            <p className="text-xs text-blue-100/70 mt-3 font-medium">Загрузите сертификат с конференции в Астане, чтобы закрыть план.</p>
            <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-sm">
              Подробнее
            </button>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM SECTION - PROGRESS & RECENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center mb-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={progressData} innerRadius={75} outerRadius={90} paddingAngle={10} dataKey="value" stroke="none" cornerRadius={10}>
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">58%</span>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Готовность</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full border-t border-gray-50 pt-6">
             <div className="text-center">
                <p className="text-sm font-black text-slate-900 leading-none">350</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Факт</p>
             </div>
             <div className="text-center border-l border-gray-100">
                <p className="text-sm font-black text-slate-900 leading-none">250</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Остаток</p>
             </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Последние подтверждения</h3>
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-all"><MoreHorizontal size={20} className="text-gray-400" /></button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Публикация Scopus Q2', status: 'Одобрено', date: 'Вчера, 14:20', points: '+100', cat: 'Наука' },
              { title: 'Курс повышения квалификации', status: 'На проверке', date: '12 марта', points: '+30', cat: 'Метод.раб' }
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-5 border border-gray-50 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer group hover:border-blue-100">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${task.status === 'Одобрено' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-blue-600/60 uppercase">{task.cat}</span>
                      <div className="w-1 h-1 rounded-full bg-gray-200" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{task.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 italic tracking-tighter">{task.points}</span>
                    <p className="text-[9px] font-black text-slate-300 uppercase leading-none">Баллов</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
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