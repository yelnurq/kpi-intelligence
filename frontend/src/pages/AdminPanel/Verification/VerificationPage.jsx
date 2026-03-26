import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle, XCircle, Clock, Search, 
  User, FileText, ArrowRight, Shield, 
  Download, Loader2, X, ChevronRight,
  Filter, CheckCircle2, Inbox, Activity, AlertCircle, ArrowUpRight, ShieldCheck
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, colorClass, description, isPrimary, unit = "записей" }) => (
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
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>

    <div className="flex items-center justify-between mt-2 text-left">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
        {description}
      </p>
      {trend && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
          <ArrowUpRight size={14} /> {trend}%
        </div>
      )}
    </div>
  </div>
);

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  
  const [groupedData, setGroupedData] = useState([]);
  const [facultiesList, setFacultiesList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE}/admin/kpi-activities`);
      if (selectedFaculty !== 'all') url.searchParams.append('faculty', selectedFaculty);

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const result = await res.json();
      
      if (result.status === 'success') {
        setGroupedData(result.data || []);
        setStats(result.stats || { total: 0, approved: 0, pending: 0, rejected: 0 });
        if (result.faculties) setFacultiesList(result.faculties);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFaculty, token, API_BASE]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);
  useEffect(() => { setSelectedTeacher('all'); }, [selectedFaculty]);

  const teachersList = useMemo(() => {
    const teachers = new Set();
    groupedData.forEach(group => {
      group.items.forEach(item => { if (item.user_name) teachers.add(item.user_name); });
    });
    return Array.from(teachers).sort();
  }, [groupedData]);

  const handleStatusUpdate = async (id, status, comment = null) => {
    setIsSubmitting(true);
    setProcessingId(id);
    try {
      const res = await fetch(`${API_BASE}/kpi-activities/${id}/status`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ status, comment })
      });

      if (res.ok) {
        setShowCommentModal(false);
        setRejectionReason('');
        await fetchRequests(); 
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    } finally {
      setIsSubmitting(false);
      setProcessingId(null);
    }
  };

  return (
    <main className="border rounded-lg mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 text-left">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Верификация KPI</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Система проверки и подтверждения достижений</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            В очереди ({stats.pending})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            История
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Всего активов" value={stats.total} icon={Inbox} colorClass="bg-slate-100 text-slate-600" description="Общий объем данных" />
        <StatCard label="Ожидают" value={stats.pending} icon={Clock} colorClass="bg-amber-100 text-amber-600" description="Требуют внимания" isPrimary={activeTab === 'pending'} />
        <StatCard label="Одобрено" value={stats.approved} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600" description="Успешно проверено" />
        <StatCard label="Отклонено" value={stats.rejected} icon={AlertCircle} colorClass="bg-red-100 text-red-600" description="Не прошли аудит" />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-1 min-w-[240px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider appearance-none focus:border-blue-500 outline-none shadow-sm cursor-pointer"
          >
            <option value="all">Все подразделения</option>
            {facultiesList.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>

        <div className="relative flex-1 min-w-[240px]">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider appearance-none focus:border-blue-500 outline-none shadow-sm cursor-pointer"
          >
            <option value="all">Все сотрудники</option>
            {teachersList.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {(() => {
            // Локальный лоадер вместо полноэкранного
            if (loading && groupedData.length === 0) {
              return (
                <div className="bg-white rounded-[32px] border border-slate-100 p-20 flex flex-col items-center justify-center shadow-sm">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Синхронизация репозитория...</span>
                </div>
              );
            }

            const visibleData = groupedData.map(group => ({
              ...group,
              items: (group.items || []).filter(item => {
                const statusMatch = activeTab === 'pending' ? item.status === 'pending' : item.status !== 'pending';
                const teacherMatch = selectedTeacher === 'all' || item.user_name === selectedTeacher;
                return statusMatch && teacherMatch;
              })
            })).filter(group => group.items.length > 0);

            if (visibleData.length > 0) {
              return visibleData.map((group) => (
                <section key={group.faculty} className="space-y-4 text-left">
                  <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      {group.faculty}
                    </h2>
                    <div className="h-px w-full bg-slate-200"></div>
                    <span className="text-[10px] font-bold text-slate-400">{group.items.length}</span>
                  </div>

                  <div className="space-y-4">
                    {group.items.map((req) => (
                      <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group relative overflow-hidden text-left">
                        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                              <User size={24} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 text-sm">{req.user_name}</h3>
                                <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">{req.category}</span>
                              </div>
                              <p className="text-sm font-bold text-slate-700 leading-snug">{req.title}</p>
                              
                              <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                  <Clock size={12}/> {req.date}
                                </span>
                                <div className="flex gap-2">
                                  {(req.files || []).map((file, idx) => (
                                    <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 rounded border border-slate-200 text-[9px] font-bold hover:bg-blue-600 hover:text-white transition-all uppercase">
                                      <Download size={10}/> Doc #{idx + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 min-w-[140px]">
                            <div className="text-right mb-3">
                              <span className="text-2xl font-bold text-slate-900 tracking-tighter">+{req.total_points}</span>
                              <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">индекс</p>
                            </div>
                            
                            {req.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button 
                                  disabled={isSubmitting}
                                  onClick={() => { setSelectedRequest(req); setShowCommentModal(true); }}
                                  className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                  <XCircle size={18} />
                                </button>
                                <button 
                                  disabled={isSubmitting}
                                  onClick={() => handleStatusUpdate(req.id, 'approved')}
                                  className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center min-w-[40px]"
                                >
                                  {isSubmitting && processingId === req.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                </button>
                              </div>
                            ) : (
                              <div className={`text-[9px] font-bold uppercase px-3 py-1 rounded border ${req.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                                {req.status === 'approved' ? 'Принято' : 'Отклонено'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section> 
              ));
            }

            return (
              <div className="bg-white rounded-[32px] border border-slate-200 border-dashed p-16 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 blur-3xl transition-colors group-hover:bg-blue-50/50"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-500">
                    <Inbox size={32} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">
                      {groupedData.length === 0 ? "Очередь пуста" : "Ничего не найдено"}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium max-w-[280px] mx-auto leading-relaxed">
                      {groupedData.length === 0 
                        ? "Все активы на текущий момент обработаны." 
                        : "Попробуйте изменить параметры фильтрации."}
                    </p>
                  </div>
                  {(selectedFaculty !== 'all' || selectedTeacher !== 'all') && (
                    <div className="mt-10 flex justify-center gap-3">
                      <button 
                        onClick={() => { setSelectedFaculty('all'); setSelectedTeacher('all'); }}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
                      >
                        Сбросить фильтры
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)] sticky top-10 text-left overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl transition-colors group-hover:bg-blue-100/50"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Состояние хранилища</h4>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Обработка данных</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        {stats.total > 0 ? Math.round(((stats.total - stats.pending) / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="text-right"><span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-tighter">Live</span></div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-[1px]">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-600 to-indigo-500" style={{ width: `${stats.total > 0 ? ((stats.total - stats.pending) / stats.total) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
      
        </div>
      </div>

      {/* MODAL */}
      {showCommentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden text-left border border-slate-200">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Действие требуется</p>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">Причина отказа</h3>
                </div>
                <button 
                  onClick={() => { setShowCommentModal(false); setRejectionReason(''); }} 
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20}/>
                </button>
              </div>

              {selectedRequest && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-1.5 bg-white rounded-md shadow-sm text-slate-400">
                      <User size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
                      {selectedRequest.user_name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed pl-8 line-clamp-1 italic">
                    «{selectedRequest.title}»
                  </p>
                </div>
              )}

              <div className="mb-6">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Быстрые шаблоны</p>
                  <div className="flex flex-wrap gap-2">
                      {['Недостаточно документов', 'Неверная категория', 'Низкое качество файла', 'Дубликат записи'].map((template) => (
                          <button
                              key={template}
                              onClick={() => setRejectionReason(template)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all uppercase tracking-tight ${rejectionReason === template ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
                          >
                              {template}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ваш комментарий</label>
                  <span className={`text-[9px] font-bold uppercase ${rejectionReason.length > 0 ? 'text-blue-500' : 'text-slate-300'}`}>
                      {rejectionReason.length} символов
                  </span>
                </div>
                <textarea 
                  autoFocus
                  className="w-full h-28 p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all resize-none placeholder:text-slate-300"
                  placeholder="Опишите детально, почему запись отклонена..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button 
                  onClick={() => { setShowCommentModal(false); setRejectionReason(''); }} 
                  disabled={isSubmitting}
                  className="py-4 bg-white border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected', rejectionReason)}
                  disabled={!rejectionReason.trim() || isSubmitting}
                  className={`py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg ${!rejectionReason.trim() || isSubmitting ? 'bg-slate-100 text-slate-400 shadow-none' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin text-white" /> : <>Подтвердить <ArrowRight size={14} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StaffManagement;