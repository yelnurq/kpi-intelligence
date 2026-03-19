import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { 
  Target, Zap, TrendingUp, ChevronRight, CheckCircle, 
  Clock, Lightbulb, FilePlus2, Award, ArrowRight,
  User, GraduationCap, Briefcase, MapPin, ShieldCheck
} from 'lucide-react';

// --- ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (ФЕЙК) ---
const userData = {
  name: "Искаков Арман Серикович",
  role: "Ассоциированный профессор",
  faculty: "Информационных технологий",
  department: "Компьютерная инженерия",
  location: "Корпус А, каб. 402",
  id: "ID-99420",
  experience: "12 лет стажа",
  status: "Active Professional"
};

const planVsFactData = [
  { name: 'Наука', plan: 300, fact: 150 },
  { name: 'Метод.раб', plan: 200, fact: 180 },
  { name: 'Общ.деят', plan: 100, fact: 20 },
  { name: 'Восп.раб', plan: 150, fact: 130 },
];

const progressData = [
  { name: 'Выполнено', value: 350 },
  { name: 'В процессе', value: 120 },
  { name: 'Осталось', value: 130 },
];

const COLORS = ['#2563eb', '#60a5fa', '#f1f5f9']; 

const StatCard = ({ icon: Icon, label, value, trend, colorClass, subtitle, description }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500 ${colorClass}`}>
        <Icon size={22} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full uppercase tracking-wider">
          <TrendingUp size={12} /> {trend}%
        </div>
      )}
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</p>
        <span className="text-xs text-slate-400 font-semibold uppercase">{subtitle || 'баллов'}</span>
      </div>
      {description && <p className="text-[11px] text-gray-400 mt-2 font-medium leading-relaxed">{description}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8"> 
      
      {/* 1. ПЕРСОНАЛЬНЫЙ HEADER С ИНФОРМАЦИЕЙ О СОТРУДНИКЕ */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
             <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform duration-500">
               <User size={40} />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-sm" title="Верифицированный профиль">
               <ShieldCheck size={14} />
             </div>
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
              {userData.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 items-center">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg">
                <Briefcase size={12} /> {userData.role}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <GraduationCap size={14} /> {userData.faculty}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <MapPin size={12} /> {userData.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0">
          <div className="flex-grow text-right pr-4 border-r border-gray-100">
             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">ID сотрудника</p>
             <p className="text-xs font-black text-slate-900 mt-1">{userData.id}</p>
          </div>
          <button className="flex-grow lg:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group">
            <FilePlus2 size={16} /> <span className="hidden sm:inline">Создать отчет</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Декоративный элемент фона */}
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. ГРИД КАРТОЧЕК KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Zap} label="Мой Текущий KPI" value="350" trend="12" colorClass="bg-blue-600 text-white" description="На 42 балла больше, чем в прошлом месяце" />
        <StatCard icon={Target} label="Целевой План" value="600" colorClass="bg-slate-50 text-slate-600" subtitle="/ 600" description="Минимальный порог для категории А" />
        <StatCard icon={TrendingUp} label="Прогноз" value="480" trend="5" colorClass="bg-indigo-50 text-indigo-600" description="Ожидаемый результат к концу мая" />
        <StatCard icon={Award} label="Рейтинг" value="#4" subtitle="место" colorClass="bg-amber-50 text-amber-600" description="Среди 120 сотрудников кафедры" />
      </div>

      {/* 3. ГЛАВНЫЙ ГРАФИК И САЙДБАР */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg tracking-tight uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-6 bg-blue-600 rounded-full" /> Распределение баллов
              </h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Сравнение плановых и фактических показателей</p>
            </div>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
               <button className="px-3 py-1.5 text-[10px] font-bold bg-white shadow-sm rounded-lg text-slate-900 uppercase">План/Факт</button>
               <button className="px-3 py-1.5 text-[10px] font-bold text-gray-400 rounded-lg uppercase hover:text-slate-600 transition-colors">Динамика</button>
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

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-bold mb-8 flex items-center gap-2 text-gray-400 uppercase tracking-[0.2em]">
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
                      <p className="text-xs font-bold text-slate-800 leading-none group-hover:text-blue-600 transition-colors">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">{item.time}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{item.status}</span>
                  </div>
                  <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
                    <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 group flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
              Весь календарь <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Lightbulb size={60} /></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">AI Советник</p>
            <p className="text-sm font-bold mt-4 leading-relaxed italic">
              «Арман, ваша активность в "Науке" на 40% ниже ожидаемой. Загрузите сертификат с конференции, чтобы закрыть план.»
            </p>
            <button className="mt-6 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border border-white/10">
              Смотреть советы
            </button>
          </div>
        </div>
      </div>
      
      {/* 4. НИЖНЯЯ СЕКЦИЯ - ПОСЛЕДНЯЯ АКТИВНОСТЬ */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><CheckCircle size={20} /></div>
             <h3 className="text-lg font-bold text-slate-900 tracking-tight">История последних подтверждений</h3>
          </div>
          <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Смотреть все</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Статья Scopus Q2 (Deep Learning)', status: 'Одобрено', date: 'Вчера, 14:20', points: '+100', cat: 'Наука' },
            { title: 'Методическое пособие (ИТ)', status: 'На проверке', date: '12 марта', points: '+30', cat: 'Метод.раб' }
          ].map((task, i) => (
            <div key={i} className="flex items-center justify-between p-6 border border-gray-50 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer group hover:border-blue-100">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${task.status === 'Одобрено' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-600'}`}>
                  {task.status === 'Одобрено' ? <CheckCircle size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{task.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{task.cat}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{task.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black italic tracking-tighter ${task.status === 'Одобрено' ? 'text-emerald-500' : 'text-slate-400'}`}>{task.points}</span>
                <p className="text-[9px] font-bold text-slate-300 uppercase leading-none">Баллов</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
};

export default Dashboard;