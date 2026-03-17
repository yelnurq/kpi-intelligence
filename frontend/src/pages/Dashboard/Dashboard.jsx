import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Target, Zap, Award, BookOpen, AlertCircle, 
  TrendingUp, ArrowUpRight, CheckCircle2, Clock,
  Lightbulb, Calendar, ChevronRight
} from 'lucide-react';

// --- ДАННЫЕ ДЛЯ ГРАФИКОВ ---
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
const COLORS = ['#2563eb', '#93c5fd', '#f1f5f9']; 

// --- КОМПОНЕНТ КАРТОЧКИ ---
const StatCard = ({ icon: Icon, label, value, trend, colorClass }) => (
  <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14} /> {trend}%
        </span>
      )}
    </div>
    <div className="mt-5">
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-3xl font-black text-slate-900">{value}</p>
        <span className="text-slate-400 font-medium tracking-tight">баллов</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* 1. ВЕРХНИЙ РЯД: СТАТИСТИКА */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Zap} label="Мой KPI" value="350" trend="12" colorClass="bg-blue-50 text-blue-600" />
        <StatCard icon={Target} label="План" value="600" colorClass="bg-indigo-50 text-indigo-600" />
        <StatCard icon={TrendingUp} label="Прогноз" value="480" trend="5" colorClass="bg-purple-50 text-purple-600" />
        <StatCard icon={Calendar} label="До конца сезона" value="45" unit="дн." colorClass="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. ГРАФИК: АНАЛИТИКА (8 КОЛОНОК) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Аналитика выполнения</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planVsFactData} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc', radius: 10}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="plan" fill="#f1f5f9" radius={[10, 10, 10, 10]} name="План" barSize={40} />
                <Bar dataKey="fact" fill="#2563eb" radius={[10, 10, 10, 10]} name="Факт" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. ДЕДЛАЙНЫ (4 КОЛОНКИ) - ПУНКТ 4 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden h-full">
             {/* Декоративный круг на фоне */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
            
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
              <Clock size={20} className="text-blue-400" /> Ближайшие сроки
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="text-sm font-bold">Завершение планирования</p>
                <p className="text-xs text-slate-400 mt-1">Осталось 3 дня (до 20 марта)</p>
                <div className="w-full bg-slate-800 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[90%]"></div>
                </div>
              </div>
              
              <div className="border-l-2 border-amber-500 pl-4 py-1">
                <p className="text-sm font-bold text-slate-200">Подача отчетов за 1-й кв.</p>
                <p className="text-xs text-slate-400 mt-1">Дедлайн через 12 дней</p>
              </div>

              <div className="border-l-2 border-slate-700 pl-4 py-1">
                <p className="text-sm font-bold text-slate-400">Публикация статей Scopus</p>
                <p className="text-xs text-slate-500 mt-1">До 15 мая 2026</p>
              </div>
            </div>

            <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl font-bold text-sm transition-colors">
              Добавить в календарь
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 4. УМНЫЕ РЕКОМЕНДАЦИИ (4 КОЛОНКИ) - ПУНКТ 1 */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={24} /> Советы по KPI
          </h3>
          <div className="space-y-4">
            <div className="group p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                <p className="font-bold text-blue-900 text-sm">Опубликуйте статью</p>
                <ChevronRight size={16} className="text-blue-400" />
              </div>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                В вашем плане "Наука" выполнена на 50%. Публикация в журнале КОКСНВО принесет вам 50 баллов.
              </p>
            </div>

            <div className="group p-4 rounded-2xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                <p className="font-bold text-purple-900 text-sm">Повышение квалификации</p>
                <ChevronRight size={16} className="text-purple-400" />
              </div>
              <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                Курс "React для продвинутых" закроет вашу методическую цель на этот год.
              </p>
            </div>
          </div>
        </div>

        {/* 5. КРУГОВОЙ ПРОГРЕСС (4 КОЛОНКИ) */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-bold text-slate-900 self-start mb-6">Общий прогресс</h3>
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie data={progressData} innerRadius={75} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={10}>
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-4xl font-black text-slate-900">58%</span>
            </div>
          </div>
        </div>

        {/* 6. БЫСТРЫЕ ДЕЙСТВИЯ (4 КОЛОНКИ) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[32px] shadow-lg text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 text-white">У вас есть достижения?</h3>
            <p className="text-blue-100 text-sm opacity-80">Загрузите подтверждение прямо сейчас, чтобы получить баллы.</p>
          </div>
          <button className="bg-white text-blue-700 w-full py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            + ПОДАТЬ ЗАЯВКУ
          </button>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;