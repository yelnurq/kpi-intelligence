import React, { useState } from 'react';
import { 
  Activity, Search, Filter, Clock, User, 
  ShieldCheck, AlertCircle, FileText, Download,
  ExternalLink, Trash2, Calendar
} from 'lucide-react';

const AuditLog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Фейковые данные логов
  const [logs] = useState([
    { 
      id: "LOG-8842", 
      user: "Админ Александр", 
      role: "admin",
      action: "Одобрение KPI", 
      target: "Заявка #442 (Статья Scopus)", 
      timestamp: "20.03.2026 14:20",
      status: "success",
      ip: "192.168.1.45"
    },
    { 
      id: "LOG-8841", 
      user: "Система", 
      role: "system",
      action: "Ошибка интеграции", 
      target: "WhatsApp Gateway API", 
      timestamp: "20.03.2026 13:05",
      status: "failed",
      ip: "internal"
    },
    { 
      id: "LOG-8840", 
      user: "Елнур Зеинолла", 
      role: "developer",
      action: "Изменение веса KPI", 
      target: "Справочник: Публикации (50 -> 60)", 
      timestamp: "20.03.2026 12:45",
      status: "warning",
      ip: "95.161.22.10"
    },
    { 
      id: "LOG-8839", 
      user: "Модератор Диана", 
      role: "teacher",
      action: "Отклонение KPI", 
      target: "Заявка #438 (Участие в конф.)", 
      timestamp: "20.03.2026 11:30",
      status: "success",
      ip: "178.88.201.12"
    }
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'failed': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <main className="border rounded-lg mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-100">
                <Activity size={20}/>
             </div>
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Журнал аудита</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">История всех критических действий и системных событий</p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          <Download size={14} /> Экспорт логов (.CSV)
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-[2] min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Поиск по событию, пользователю или ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider focus:border-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <button className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
             <Filter size={18}/>
          </button>
          <button className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
             <Calendar size={18}/>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Событие</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Инициатор</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Дата и Время</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {log.action}
                      <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-500 cursor-pointer"/>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight italic">
                       {log.target}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      {log.role === 'system' ? <Activity size={14}/> : <User size={14}/>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{log.user}</span>
                      <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">IP: {log.ip}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={14} className="text-slate-300"/>
                    <span className="text-xs font-medium">{log.timestamp}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(log.status)}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-8 p-6 bg-blue-900 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 text-center md:text-left">
           <h4 className="text-sm font-bold mb-1">Хранение данных</h4>
           <p className="text-[11px] text-white/60 font-medium">Согласно политике безопасности, логи хранятся в течение 12 месяцев и не подлежат ручному удалению.</p>
        </div>
        <div className="flex gap-4 relative z-10">
           <div className="text-center">
              <p className="text-[20px] font-black">12.4k</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">Событий/мес</p>
           </div>
           <div className="w-px h-10 bg-white/20"></div>
           <div className="text-center">
              <p className="text-[20px] font-black">0</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">Нарушений</p>
           </div>
        </div>
      </div>
    </main>
  );
};

export default AuditLog;