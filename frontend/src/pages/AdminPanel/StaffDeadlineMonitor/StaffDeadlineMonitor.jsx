import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, Calendar, CheckCircle2, Clock, AlertTriangle, X, 
  MessageCircle, ChevronRight, ChevronLeft, Send, CheckSquare, Square, 
  Users, Loader2, Bell, Download, 
  Phone, Mail, ArrowUpRight, Filter, Activity
} from 'lucide-react';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

const StatCard = ({ icon: Icon, label, value, trend, colorClass, description, isPrimary, unit = "задач" }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-md ${isPrimary ? 'ring-1 ring-blue-600/10' : ''}`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${isPrimary ? 'bg-blue-600' : 'bg-slate-200'}`} />
    
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{value}</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass} shadow-sm`}>
        <Icon size={18} />
      </div>
    </div>

    <div className="flex items-center justify-between mt-2 text-left">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
        {description}
      </p>
      {trend && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
          <ArrowUpRight size={14} /> {trend}%
        </div>
      )}
    </div>
  </div>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ---

const StaffDeadlineMonitor = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ totalOverdue: 0, avgProgress: 0, criticalUsers: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sortBy, setSortBy] = useState('overdue');

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    last_page: 1,
    total: 0,
    per_page: 30
  });

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  // --- ЗАГРУЗКА ДАННЫХ ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        faculty: selectedFaculty,
        page: currentPage,
        sort_by: sortBy,
        search: searchTerm
      });

      const response = await fetch(`${API_BASE}/admin/staff/deadline-monitor?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        setEmployees(result.data || []);
        // Получаем статистику напрямую из ответа бэкенда
        if (result.stats) {
          setStats(result.stats);
        }
        if (result.meta) {
          setPaginationMeta({
            last_page: result.meta.last_page,
            total: result.meta.total,
            per_page: result.meta.per_page || 30
          });
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFaculty, currentPage, sortBy, searchTerm, token]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }, [currentPage]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFaculty, sortBy, searchTerm]);

  const handleNotify = async (ids) => {
    if (ids.length === 0) return;
    setIsSending(true);
    try {
      const response = await fetch(`${API_BASE}/staff/bulk-notify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_ids: ids })
      });

      if (response.ok) {
        alert(`Уведомления успешно отправлены (${ids.length})`);
        setSelectedIds([]);
      } else {
        alert("Ошибка при отправке");
      }
    } catch (e) {
      alert("Сетевая ошибка");
    } finally {
      setIsSending(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <main className="border rounded-lg mx-auto px-6 md:px-10 py-10 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">

 <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Контроль исполнения</h1>
          <p className="flex items-center gap-2 mt-2 text-sm text-gray-500">Аналитика соблюдения сроков и дедлайнов</p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-slate-50 shadow-sm">
                <Download size={16} /> Excel
            </button>
            <button 
                onClick={() => handleNotify(selectedIds)}
                disabled={selectedIds.length === 0 || isSending}
                className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebd5b] text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 disabled:opacity-30 disabled:grayscale active:scale-95"
            >
                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {isSending ? '...' : `Напомнить (${selectedIds.length})`}
            </button>
        </div>
      </div>

      {/* STATS FROM BACKEND */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          label="Критические дедлайны" 
          value={stats.totalOverdue} 
          icon={AlertTriangle} 
          colorClass="bg-red-50 text-red-600" 
          description="Всего просроченных планов" 
          isPrimary={true} 
        />
        <StatCard 
          label="Средний прогресс" 
          value={stats.avgProgress} 
          icon={CheckCircle2} 
          colorClass="bg-blue-50 text-blue-600" 
          description="Средний KPI по выборке" 
          unit="%" 
        />
        <StatCard 
          label="В зоне риска" 
          value={stats.criticalUsers} 
          icon={Bell} 
          colorClass="bg-amber-50 text-amber-600" 
          description="Сотрудники с задолженностью" 
          unit="чел." 
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Поиск по ФИО и Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none shadow-sm transition-all"
          />
        </div>

        <div className="relative min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider appearance-none focus:border-blue-500 outline-none shadow-sm cursor-pointer"
          >
            <option value="all">Все подразделения</option>
            <option value="ТФ">ТФ</option>
            <option value="ФЭиБ">ФЭиБ</option>
            <option value="ФИиИТ">ФИиИТ</option>
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>

        <div className="relative min-w-[200px]">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-6 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider appearance-none focus:border-blue-500 outline-none shadow-sm cursor-pointer text-center"
          >
            <option value="overdue">Сначала должники</option>
            <option value="progress">По прогрессу</option>
            <option value="name">По алфавиту</option>
          </select>
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="relative min-h-[400px] space-y-4">
        {loading && employees.length > 0 && (
          <div className="absolute inset-0 z-10 bg-slate-50/40 backdrop-blur-[1px] flex items-start justify-center pt-20">
            <div className="bg-white px-6 py-3 rounded-full shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in zoom-in duration-200">
              <Loader2 className="animate-spin text-blue-600" size={20} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Обновление...</span>
            </div>
          </div>
        )}

        {loading && employees.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Синхронизация...</p>
          </div>
        ) : employees.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {employees.map((user) => (
              <div 
                key={user.id} 
                className={`bg-white p-5 rounded-2xl border transition-all group hover:shadow-md ${
                  user.overdue > 0 ? 'border-red-100' : 'border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-left">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => toggleSelect(user.id)} 
                      className={`transition-all shrink-0 ${selectedIds.includes(user.id) ? 'text-blue-600' : 'text-slate-200 hover:text-slate-400'}`}
                    >
                      {selectedIds.includes(user.id) ? <CheckSquare size={22} fill="currentColor" /> : <Square size={22} />}
                    </button>

                    <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl transition-all ${
                        user.overdue > 3 ? 'bg-red-600 text-white' : 
                        user.overdue > 0 ? 'bg-amber-500 text-white' : 
                        'bg-slate-900 text-white'
                      }`}>
                        {user.name?.charAt(0)}
                      </div>
                      {user.overdue > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black">
                          {user.overdue}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors">
                        {user.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 text-slate-400 text-[11px] font-medium mt-1 uppercase tracking-tight">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500"/> {user.faculty}</span>
                        <span className="flex items-center gap-1.5"><Mail size={12} /> {user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="w-full md:w-48 space-y-2">
                      <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400 text-[9px]">Прогресс KPI</span>
                        <span className={user.progress < 40 ? 'text-red-500' : 'text-emerald-500'}>{user.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${user.progress < 40 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${user.progress}%` }} 
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-l border-slate-100 pl-6 ml-auto md:ml-0">
                      <a href={`tel:${user.phone}`} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Phone size={18} />
                      </a>
                      <button 
                        onClick={() => setSelectedEmployee(user)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 shadow-sm transition-all active:scale-95"
                      >
                        Детали <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-slate-200 border-dashed p-20 text-center">
            <Users size={32} className="text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900">Сотрудники не найдены</h3>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!loading && paginationMeta.last_page > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12 pb-10">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {[...Array(paginationMeta.last_page)].map((_, i) => {
              const pageNum = i + 1;
              if (pageNum === 1 || pageNum === paginationMeta.last_page || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-2xl text-[11px] font-black transition-all ${
                      currentPage === pageNum 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110' 
                      : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <span key={pageNum} className="text-slate-300 font-bold px-1">...</span>;
              return null;
            })}
          </div>

          <button 
            disabled={currentPage === paginationMeta.last_page}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* DETAILED MODAL */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className={`absolute top-0 left-0 w-2 h-full ${selectedEmployee.overdue > 0 ? 'bg-red-600' : 'bg-blue-600'}`} />
            
            <div className="p-8 border-b border-slate-100 bg-white">
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md ${selectedEmployee.overdue > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {selectedEmployee.overdue > 0 ? 'Внимание: Долги' : 'Стабильно'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{selectedEmployee.faculty}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedEmployee.name}</h3>
                </div>
                <button onClick={() => setSelectedEmployee(null)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto bg-slate-50/50 flex-1">
              <div className="space-y-6 text-left">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Просроченные индикаторы</p>
                <div className="grid gap-3">
                  {selectedEmployee.indicators?.filter(ind => ind.status === 'overdue').length > 0 ? (
                    selectedEmployee.indicators
                      .filter(ind => ind.status === 'overdue')
                      .sort((a, b) => new Date(a.date) - new Date(b.date)) 
                      .map((ind) => (
                        <div key={ind.id} className="bg-white border border-red-100 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                          <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-800 leading-tight">{ind.title}</p>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1.5 uppercase text-red-600 bg-red-50">
                              <Clock size={12} /> Дедлайн: {new Date(ind.date).toLocaleDateString()}
                            </span>
                          </div>
                          <AlertTriangle size={18} className="text-red-500" />
                        </div>
                      ))
                  ) : (
                    <div className="bg-white border border-slate-200 p-10 rounded-3xl text-center border-dashed">
                      <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-900">Просрочек нет</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
                    <Phone size={14} className="text-blue-500" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Телефон</p>
                      <p className="text-xs font-bold text-slate-700">{selectedEmployee.phone || '—'}</p>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
                    <Mail size={14} className="text-slate-500" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Email</p>
                      <p className="text-xs font-bold text-slate-700">{selectedEmployee.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border-t border-slate-100">
              <button 
                onClick={() => handleNotify([selectedEmployee.id])}
                disabled={isSending}
                className="w-full py-4 bg-[#25D366] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#1ebd5b] transition-all flex items-center justify-center gap-3"
              >
                {isSending ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} fill="currentColor" />}
                Отправить уведомление
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StaffDeadlineMonitor;