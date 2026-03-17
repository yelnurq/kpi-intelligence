import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  MoreVertical, 
  Download, 
  Eye,
  FileText,
  ChevronRight,
  ArrowUpDown,
  Calendar
} from 'lucide-react';

const ActivityArchive = () => {
  const [filter, setFilter] = useState('all'); // all, approved, pending, rejected

  const submissions = [
    {
      id: 'KPI-2026-0842',
      title: 'Разработка CRM-системы для регионального туризма',
      category: 'Проектная деятельность',
      date: '12.03.2026',
      points: '+150',
      status: 'pending',
      files: 2
    },
    {
      id: 'KPI-2026-0711',
      title: 'Публикация: Методы оптимизации React-приложений',
      category: 'Наука',
      date: '28.02.2026',
      points: '+200',
      status: 'approved',
      files: 1
    },
    {
      id: 'KPI-2026-0650',
      title: 'Сертификат WorldSkills Web Technologies 2024',
      category: 'Достижения',
      date: '15.01.2026',
      points: '+300',
      status: 'approved',
      files: 3
    },
    {
      id: 'KPI-2026-0502',
      title: 'Отчет по практике в IT-компании',
      category: 'Метод. работа',
      date: '20.12.2025',
      points: '0',
      status: 'rejected',
      reason: 'Недостаточно подтверждающих документов',
      files: 1
    }
  ];

  const statusMap = {
    approved: { 
      label: 'Одобрено', 
      color: 'bg-green-50 text-green-600 border-green-100',
      icon: <CheckCircle2 size={14} /> 
    },
    pending: { 
      label: 'На проверке', 
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      icon: <Clock size={14} /> 
    },
    rejected: { 
      label: 'Отклонено', 
      color: 'bg-red-50 text-red-600 border-red-100',
      icon: <AlertCircle size={14} /> 
    }
  };

  const filteredData = filter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filter);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">       
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Архив активностей</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">История ваших подач и статус начисления баллов KPI</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {['all', 'approved', 'pending', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`
                px-4 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all
                ${filter === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-gray-400 hover:text-slate-600'}
              `}
            >
              {tab === 'all' ? 'Все' : statusMap[tab].label}
            </button>
          ))}
        </div>
      </div>

      {/* STATS SUMMARY (Mini) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Всего подано', val: '24', color: 'text-slate-900' },
          { label: 'Подтверждено', val: '18', color: 'text-green-600' },
          { label: 'В ожидании', val: '4', color: 'text-amber-500' },
          { label: 'Отклонено', val: '2', color: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* SEARCH & ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Поиск по названию или ID..."
            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-gray-100 px-6 py-4 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
          <Calendar size={18} />
          Период
        </button>
      </div>

      {/* TABLE / LIST */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">ID / Название</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Категория</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Статус</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Баллы</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono font-bold text-blue-500">{item.id}</span>
                      <span className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Calendar size={10} /> {item.date}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <FileText size={10} /> {item.files} файла
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-slate-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-tight ${statusMap[item.status].color}`}>
                      {statusMap[item.status].icon}
                      {statusMap[item.status].label}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`text-sm font-black ${item.status === 'approved' ? 'text-green-600' : 'text-slate-300'}`}>
                      {item.points}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 text-gray-400 hover:text-blue-600 transition-all shadow-sm">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 text-gray-400 hover:text-slate-900 transition-all shadow-sm">
                        <Download size={16} />
                      </button>
                      <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 text-gray-400 hover:text-slate-900 transition-all shadow-sm">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400">Показано 1-4 из 24 заявок</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs font-black text-gray-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Назад</button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-slate-900 shadow-sm hover:border-blue-500 transition-all uppercase tracking-widest">Вперед</button>
          </div>
        </div>
      </div>

      {/* REJECTION ALERT (Example) */}
      {submissions.some(s => s.status === 'rejected') && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-[28px] flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl text-red-500 shadow-sm flex-shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-red-900">Заявка требует внимания</h4>
            <p className="text-xs text-red-700/80 font-medium mt-1 leading-relaxed">
              Ваша заявка <span className="font-bold underline">#KPI-2026-0502</span> была отклонена. 
              Причина: "Недостаточно подтверждающих документов". Пожалуйста, загрузите скан приказа.
            </p>
            <button className="mt-3 text-xs font-black text-red-900 uppercase tracking-widest hover:underline flex items-center gap-2">
              Исправить сейчас <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ActivityArchive;