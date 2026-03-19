import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, ShieldCheck, AlertCircle, Layers, 
  ArrowUpRight, Download, Search, Filter, Clock, ArrowRight,
  CheckCircle, XCircle, MoreVertical, Settings,
  GraduationCap, Briefcase, FileText, ChevronRight
} from 'lucide-react';

// --- ФЕЙКОВЫЕ ДАННЫЕ ДЛЯ АДМИНА ---
const facultyPerformance = [
  { name: 'ИТ и Инжиниринг', points: 4500, users: 45, avg: 100 },
  { name: 'Экономика', points: 3200, users: 38, avg: 84 },
  { name: 'Гуманитарный', points: 2800, users: 50, avg: 56 },
  { name: 'Медицина', points: 4100, users: 30, avg: 136 },
];

const submissionStatus = [
  { name: 'Одобрено', value: 65, color: '#10b981' },
  { name: 'На проверке', value: 20, color: '#2563eb' },
  { name: 'Просрочено', value: 15, color: '#ef4444' },
];

const AdminStatCard = ({ icon: Icon, label, value, trend, colorClass, subtitle }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <Icon size={22} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full uppercase ${trend > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</p>
        <span className="text-xs text-slate-400 font-semibold">{subtitle}</span>
      </div>
    </div>
  </div>
);

const AdminPanel = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Панель управления системой</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Администрирование KPI</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              placeholder="Поиск сотрудника..." 
              className="pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs focus:ring-2 ring-blue-50 focus:outline-none w-64 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all">
            <Filter size={18} />
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-all">
            <Download size={16} /> Экспорт всех данных
          </button>
        </div>
      </div>

      {/* 2. TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard icon={Users} label="Всего сотрудников" value="164" trend={4} colorClass="bg-blue-600 text-white" subtitle="активны" />
        <AdminStatCard icon={ShieldCheck} label="На модерации" value="28" colorClass="bg-orange-100 text-orange-600" subtitle="заявок" />
        <AdminStatCard icon={Layers} label="Средний балл вуза" value="84.2" trend={-2} colorClass="bg-emerald-100 text-emerald-600" subtitle="KPI" />
        <AdminStatCard icon={AlertCircle} label="Просрочено планов" value="12" colorClass="bg-red-100 text-red-600" subtitle="чел." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. PERFORMANCE CHART */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-bold text-slate-900 text-lg tracking-tight uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-6 bg-emerald-500 rounded-full" /> Эффективность факультетов
              </h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">Суммарные баллы по подразделениям</p>
            </div>
            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Детальный отчет</button>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyPerformance} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="points" fill="#2563eb" radius={[0, 10, 10, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. DONUT CHART - STATUS */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 w-full">Статус планов (2025/26)</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={submissionStatus} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={10}>
                  {submissionStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900">85%</span>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Сдано вовремя</p>
            </div>
          </div>
          <div className="w-full space-y-3 mt-6">
            {submissionStatus.map((status) => (
              <div key={status.name} className="flex justify-between items-center p-3 rounded-2xl border border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-xs font-bold text-slate-600">{status.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{status.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. MODERATION TABLE */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock size={20} className="text-blue-600" /> Очередь на модерацию
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ожидают подтверждения баллов</p>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">
            Смотреть все <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-50">
                <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Сотрудник</th>
                <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Тип работы</th>
                <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Баллы</th>
                <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'Др. Ахметов А.', role: 'Профессор', cat: 'Публикация Web of Science', points: '+150', date: '2 часа назад' },
                { name: 'Макарова И.', role: 'Старший преп.', cat: 'Участие в конференции', points: '+45', date: '5 часов назад' },
                { name: 'Иванов С.', role: 'Доцент', cat: 'Метод. пособие', points: '+80', date: 'Вчера' }
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {row.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{row.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{row.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-xs font-bold text-slate-600">{row.cat}</p>
                    <p className="text-[9px] text-blue-500 font-bold mt-1 uppercase tracking-tight">{row.date}</p>
                  </td>
                  <td className="py-5 text-center">
                    <span className="text-sm font-black text-slate-900 bg-blue-50 px-3 py-1 rounded-lg">{row.points}</span>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Одобрить">
                        <CheckCircle size={18} />
                      </button>
                      <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Отклонить">
                        <XCircle size={18} />
                      </button>
                      <button className="p-2 text-gray-300 hover:text-slate-900 rounded-lg transition-all">
                        <ChevronRight size={18} />
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