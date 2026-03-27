import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, Filter, Calendar, CheckCircle2, 
  Clock, AlertTriangle, X, MessageCircle, ChevronRight, 
  Send, CheckSquare, Square, Users, LayoutDashboard,
  ArrowRight, Loader2, Bell, FileSpreadsheet, Download,
  ExternalLink, MoreHorizontal, Phone, Mail
} from 'lucide-react';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

const StatCard = ({ icon: Icon, label, value, colorClass, description, isPrimary, unit = "задач" }) => (
  <div className={`bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 ${isPrimary ? 'ring-1 ring-blue-600/10' : ''}`}>
    <div className={`absolute top-0 left-0 w-1.5 h-full ${isPrimary ? 'bg-blue-600' : 'bg-slate-200'}`} />
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      <div className={`p-3 rounded-2xl ${colorClass} shadow-inner`}>
        <Icon size={20} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-left">{description}</p>
  </div>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ---

const StaffDeadlineMonitor = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sortBy, setSortBy] = useState('overdue'); // 'overdue', 'progress', 'name'

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  // Имитация загрузки данных (замени на свой fetch)
  const fetchData = useCallback(async () => {
    setLoading(true);
    // Для демонстрации используем расширенные данные
    setTimeout(() => {
      const data = [
        { id: 1, name: "Ахметов Бахытжан", faculty: "ФИТ", department: "ВТ и ПО", phone: "77071234567", email: "akhmetov@univ.kz", overdue: 2, progress: 45, indicators: [{id: 10, title: "Публикация Scopus (Q1/Q2)", status: 'overdue', date: '2026-03-15'}] },
        { id: 2, name: "Иванова Елена", faculty: "Экономика", department: "Финансы", phone: "77019876543", email: "ivanova@univ.kz", overdue: 0, progress: 85, indicators: [{id: 11, title: "Методическое пособие", status: 'pending', date: '2026-04-01'}] },
        { id: 3, name: "Сериков Арман", faculty: "ФИТ", department: "Кибербезопасность", phone: "77775554433", email: "serikov@univ.kz", overdue: 5, progress: 12, indicators: [{id: 12, title: "Силлабус по ИБ", status: 'overdue', date: '2026-02-28'}, {id: 13, title: "НИР", status: 'overdue', date: '2026-03-01'}] },
        { id: 4, name: "Смагулов Канат", faculty: "Юриспруденция", department: "Гражданское право", phone: "7051112233", email: "smagulov@univ.kz", overdue: 1, progress: 60, indicators: [{id: 14, title: "Статья в ККСОН", status: 'overdue', date: '2026-03-10'}] },
      ];
      setEmployees(data);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Логика фильтрации и сортировки
  const filteredAndSorted = useMemo(() => {
    let result = employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFaculty = selectedFaculty === 'all' || emp.faculty === selectedFaculty;
      return matchesSearch && matchesFaculty;
    });

    return result.sort((a, b) => {
      if (sortBy === 'overdue') return b.overdue - a.overdue;
      if (sortBy === 'progress') return a.progress - b.progress;
      return a.name.localeCompare(b.name);
    });
  }, [employees, searchTerm, selectedFaculty, sortBy]);

  const stats = useMemo(() => ({
    totalOverdue: filteredAndSorted.reduce((acc, curr) => acc + curr.overdue, 0),
    avgProgress: Math.round(filteredAndSorted.reduce((acc, curr) => acc + curr.progress, 0) / (filteredAndSorted.length || 1)),
    criticalUsers: filteredAndSorted.filter(u => u.overdue > 0).length
  }), [filteredAndSorted]);

  // МАССОВАЯ РАССЫЛКА (Green API)
  const handleBulkNotify = async () => {
    if (selectedIds.length === 0) return;
    setIsSending(true);
    
    try {
      // Имитация запроса к твоему Green API контроллеру
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Успешно! Отправлено уведомлений: ${selectedIds.length}`);
      setSelectedIds([]);
    } catch (e) {
      alert("Ошибка при отправке сообщений");
    } finally {
      setIsSending(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <main className="border rounded-lg mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg text-white">
                <LayoutDashboard size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">KPI Мониторинг</h1>
          </div>
          <p className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            Автоматизированная система контроля дедлайнов и уведомлений
          </p>
        </div>

        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-slate-50">
                <Download size={16} /> Excel
            </button>
            <button 
                onClick={handleBulkNotify}
                disabled={selectedIds.length === 0 || isSending}
                className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebd5b] text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 disabled:opacity-30 disabled:grayscale active:scale-95"
            >
                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {isSending ? 'Отправка...' : `Напомнить (${selectedIds.length})`}
            </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Критические дедлайны" value={stats.totalOverdue} icon={AlertTriangle} colorClass="bg-red-50 text-red-600" description="Общее число просрочек" isPrimary={true} />
        <StatCard label="Средний прогресс" value={stats.avgProgress} icon={CheckCircle2} colorClass="bg-blue-50 text-blue-600" description="За текущий квартал" unit="%" />
        <StatCard label="В зоне риска" value={stats.criticalUsers} icon={Bell} colorClass="bg-amber-50 text-amber-600" description="Нуждаются в уведомлении" unit="чел." />
      </div>

      {/* FILTERS & SORT */}
      <div className="bg-white p-4 rounded-[28px] border border-slate-200 shadow-sm mb-8 flex flex-wrap items-center gap-4">
        <div className="relative group flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Поиск сотрудника или почты..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-[20px] text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
            <select 
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="pl-6 pr-10 py-4 bg-slate-50 border-none rounded-[20px] text-[11px] font-black uppercase tracking-wider appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
                <option value="all">Все факультеты</option>
                <option value="ФИТ">ФИТ</option>
                <option value="Экономика">Экономика</option>
                <option value="Юриспруденция">Юриспруденция</option>
            </select>
            
            <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-6 pr-10 py-4 bg-slate-50 border-none rounded-[20px] text-[11px] font-black uppercase tracking-wider appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
                <option value="overdue">Сначала должники</option>
                <option value="progress">По прогрессу</option>
                <option value="name">По алфавиту</option>
            </select>
        </div>
      </div>

      {/* CONTENT: SMART LIST */}
      <div className="relative space-y-4">
        {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Синхронизация данных...</p>
            </div>
        ) : filteredAndSorted.length > 0 ? (
          filteredAndSorted.map((user) => (
            <div key={user.id} className={`bg-white p-6 rounded-[32px] border transition-all group hover:border-blue-200 ${user.overdue > 0 ? 'border-red-100 shadow-sm shadow-red-50/50' : 'border-slate-100 shadow-sm'}`}>
              <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                
                {/* User Info Section */}
                <div className="flex items-center gap-6 w-full lg:w-auto text-left">
                  <button 
                    onClick={() => toggleSelect(user.id)} 
                    className={`transition-all transform hover:scale-110 ${selectedIds.includes(user.id) ? 'text-blue-600' : 'text-slate-200'}`}
                  >
                      {selectedIds.includes(user.id) ? <CheckSquare size={24} fill="currentColor" /> : <Square size={24} />}
                  </button>
                  
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center font-black text-xl shrink-0 transition-transform group-hover:rotate-3 ${user.overdue > 3 ? 'bg-red-600 text-white' : user.overdue > 0 ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'}`}>
                      {user.name.charAt(0)}
                    </div>
                    {user.overdue > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black">
                            {user.overdue}
                        </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors">{user.name}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[10px] font-black uppercase mt-1 tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500"/> {user.department}</span>
                      <span className="flex items-center gap-1.5"><Mail size={12} /> {user.email}</span>
                    </div>
                  </div>
                </div>

                {/* KPI Progress & Actions */}
                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-12 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="w-56 space-y-2.5">
                      <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-tighter">
                          <span className="text-slate-400">Текущий прогресс</span>
                          <span className={`text-sm ${user.progress < 40 ? 'text-red-500' : 'text-emerald-500'}`}>{user.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                          <div 
                              className={`h-full rounded-full transition-all duration-1000 shadow-sm ${user.progress < 40 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${user.progress}%` }} 
                          />
                      </div>
                  </div>

                  <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                    <a href={`tel:${user.phone}`} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Позвонить">
                        <Phone size={18} />
                    </a>
                    <button 
                      onClick={() => setSelectedEmployee(user)}
                      className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-[18px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                    >
                      Детали <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-200 p-20 text-center animate-in fade-in zoom-in">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Users size={40} />
             </div>
             <h3 className="text-xl font-black text-slate-900">Никто не найден</h3>
             <p className="text-sm text-slate-400 mt-2 font-medium">Попробуйте изменить параметры поиска или фильтр по факультету</p>
          </div>
        )}
      </div>

      {/* DETAILED MODAL */}
{selectedEmployee && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative overflow-hidden text-left border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
      
      {/* Акцентная полоса слева (красная, если есть просрочки) */}
      <div className={`absolute top-0 left-0 w-2 h-full ${selectedEmployee.overdue > 0 ? 'bg-red-600' : 'bg-blue-600'}`} />
      
      {/* HEADER */}
      <div className="p-8 border-b border-slate-100 bg-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md tracking-widest ${
                selectedEmployee.overdue > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {selectedEmployee.overdue > 0 ? 'Внимание: Просрочка' : 'В процессе'}
              </span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                {selectedEmployee.faculty}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
              {selectedEmployee.name}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {selectedEmployee.department}
            </p>
          </div>
          <button 
            onClick={() => setSelectedEmployee(null)} 
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>
      </div>

{/* CONTENT */}
<div className="p-8 overflow-y-auto bg-slate-50/50 flex-1 custom-scrollbar">
  <div className="space-y-6">
    
    <div className="flex justify-between items-end">
      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
        Критические просрочки
      </p>
      <p className="text-[10px] font-bold text-slate-400 uppercase">
        Найдено: {selectedEmployee.indicators?.filter(ind => ind.status === 'overdue').length || 0}
      </p>
    </div>

    <div className="grid gap-3">
      {selectedEmployee.indicators?.filter(ind => ind.status === 'overdue').length > 0 ? (
        selectedEmployee.indicators
          .filter(ind => ind.status === 'overdue') // Фильтруем только просроченные
          .map((ind) => (
            <div 
              key={ind.id} 
              className="group bg-white border border-red-100 p-5 rounded-2xl flex justify-between items-center transition-all hover:border-red-300 shadow-sm shadow-red-50"
            >
              <div className="space-y-2 pr-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    {ind.title}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-5">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1.5 uppercase tracking-tighter text-red-600 bg-red-50">
                    <Clock size={12} /> Дедлайн был: {ind.date}
                  </span>
                  <span className="text-[9px] text-red-400 font-black uppercase tracking-widest">
                    Просрочено
                  </span>
                </div>
              </div>
              
              <div className="shrink-0">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-500">
                  <AlertTriangle size={18} />
                </div>
              </div>
            </div>
          ))
      ) : (
        /* Состояние, если просрочек нет */
        <div className="bg-white border border-slate-200 p-10 rounded-3xl text-center border-dashed">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-sm font-bold text-slate-900">Просрочек не обнаружено</p>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Все индикаторы в норме</p>
        </div>
      )}
    </div>

    {/* Инфо-блок контактов остается без изменений */}
    <div className="grid grid-cols-2 gap-4 pt-2">
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Phone size={14} />
        </div>
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Телефон</p>
          <p className="text-xs font-bold text-slate-700">{selectedEmployee.phone}</p>
        </div>
      </div>
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
          <Mail size={14} />
        </div>
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Email</p>
          <p className="text-xs font-bold text-slate-700">{selectedEmployee.email}</p>
        </div>
      </div>
    </div>

  </div>
</div>
      {/* FOOTER ACTIONS */}
      <div className="p-8 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="flex gap-4">
          <button 
            className="flex-1 py-4 bg-[#25D366] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#1ebd5b] hover:shadow-xl hover:shadow-emerald-100 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <MessageCircle size={18} fill="currentColor" />
            WhatsApp Напоминание
          </button>
          
          <button 
            title="Открыть профиль"
            className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
          >
            <ExternalLink size={20} />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest mt-6">
          Последнее уведомление: {selectedEmployee.lastNotified || 'Никогда'}
        </p>
      </div>
    </div>
  </div>
)}

      {/* FOOTER */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span>Система активна • Green API подключен</span>
          </div>
          <span>Kpi Intelligence v2.5 • {new Date().getFullYear()}</span>
      </div>
    </main>
  );
};

export default StaffDeadlineMonitor;