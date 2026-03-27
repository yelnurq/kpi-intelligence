import React, { useState } from 'react';
import { 
  Users, Clock, AlertCircle, Search, Filter, 
  ChevronRight, Calendar, ArrowUpRight, Mail, 
  CheckCircle2, XCircle
} from 'lucide-react';

// --- ФЕЙКОВЫЕ ДАННЫЕ СОТРУДНИКОВ ---
const MOCK_EMPLOYEES = [
  {
    id: 1,
    name: "Ахметов Бахытжан",
    position: "Ассоциированный профессор",
    total_indicators: 12,
    completed_indicators: 8,
    overdue_count: 1,
    next_deadline: "2026-04-10",
    progress: 65,
    status: "at_risk"
  },
  {
    id: 2,
    name: "Иванова Елена",
    position: "Старший преподаватель",
    total_indicators: 10,
    completed_indicators: 9,
    overdue_count: 0,
    next_deadline: "2026-03-30",
    progress: 90,
    status: "on_track"
  },
  {
    id: 3,
    name: "Сериков Арман",
    position: "Доктор PhD",
    total_indicators: 15,
    completed_indicators: 4,
    overdue_count: 3,
    next_deadline: "2026-03-25",
    progress: 26,
    status: "overdue"
  },
  {
    id: 4,
    name: "Смагулова Динара",
    position: "Преподаватель",
    total_indicators: 8,
    completed_indicators: 8,
    overdue_count: 0,
    next_deadline: "2026-05-15",
    progress: 100,
    status: "completed"
  }
];

const DeadlineBadge = ({ date, status }) => {
  const isOverdue = status === 'overdue';
  const isAtRisk = status === 'at_risk';

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider
      ${isOverdue ? 'bg-red-50 text-red-600 border-red-100' : 
        isAtRisk ? 'bg-amber-50 text-amber-600 border-amber-100' : 
        'bg-slate-50 text-slate-500 border-slate-100'}`}>
      <Calendar size={12} />
      {new Date(date).toLocaleDateString('ru-RU')}
    </div>
  );
};

const StaffDeadlineMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
        <div className="text-left space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Мониторинг дедлайнов</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Детальный контроль выполнения показателей по сотрудникам</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-3">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Всего просрочено</p>
                    <p className="text-lg font-black text-red-600 leading-none mt-1">4</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Средний прогресс</p>
                    <p className="text-lg font-black text-blue-600 leading-none mt-1">70%</p>
                </div>
            </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 mb-6">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Поиск сотрудника..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={16} /> Фильтры
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                <th className="px-6 py-5 font-bold text-left">Сотрудник</th>
                <th className="px-6 py-5 font-bold text-center">Прогресс</th>
                <th className="px-6 py-5 font-bold text-center">Выполнено</th>
                <th className="px-6 py-5 font-bold text-center">Просрочено</th>
                <th className="px-6 py-5 font-bold text-center">Ближайший дедлайн</th>
                <th className="px-6 py-5 font-bold text-right">Связь</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_EMPLOYEES.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px] border border-slate-200 uppercase">
                        {emp.name.split(' ').slice(0,2).map(n => n[0]).join('')}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">{emp.position}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1.5 w-24 mx-auto">
                      <span className="text-[10px] font-black text-slate-700">{emp.progress}%</span>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${emp.progress >= 100 ? 'bg-emerald-500' : emp.status === 'overdue' ? 'bg-red-500' : 'bg-blue-600'}`}
                          style={{ width: `${emp.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span className="text-xs font-black text-slate-700">{emp.completed_indicators}</span>
                      <span className="text-[10px] font-bold text-slate-300">/</span>
                      <span className="text-[10px] font-bold text-slate-400">{emp.total_indicators}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    {emp.overdue_count > 0 ? (
                      <div className="inline-flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 text-red-600">
                        <XCircle size={12} />
                        <span className="text-xs font-black">{emp.overdue_count}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">—</span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center">
                      <DeadlineBadge date={emp.next_deadline} status={emp.status} />
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end">
                        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                            <Mail size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center px-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Система мониторинга KPI v1.0</p>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold uppercase text-slate-500 tracking-tight">Завершено</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[9px] font-bold uppercase text-slate-500 tracking-tight">Просрочено</span>
            </div>
        </div>
      </div>
    </main>
  );
};

export default StaffDeadlineMonitor;