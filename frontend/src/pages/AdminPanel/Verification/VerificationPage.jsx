import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle, XCircle, Clock, Search, 
  User, FileText, ArrowRight, Shield, 
  Download, Loader2, X, ChevronRight,
  Filter, CheckCircle2, Inbox, Activity, AlertCircle,ArrowUpRight
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

const VerificationAudit = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
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
        fetchRequests(); 
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

  if (loading && groupedData.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Синхронизация данных...</span>
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 text-left">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                <Shield size={14} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Admin Audit Mode</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Верификация KPI</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Панель проверки и подтверждения достижений</p>
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
        <StatCard 
          label="Всего заявок" 
          value={stats.total} 
          icon={Inbox} 
          colorClass="bg-slate-100 text-slate-600" 
          description="Общий объем данных"
        />
        <StatCard 
          label="Ожидают" 
          value={stats.pending} 
          icon={Clock} 
          colorClass="bg-amber-100 text-amber-600" 
          description="Требуют внимания"
          isPrimary={activeTab === 'pending'}
        />
        <StatCard 
          label="Одобрено" 
          value={stats.approved} 
          icon={CheckCircle2} 
          colorClass="bg-emerald-100 text-emerald-600" 
          description="Успешно проверено"
        />
        <StatCard 
          label="Отклонено" 
          value={stats.rejected} 
          icon={AlertCircle} 
          colorClass="bg-red-100 text-red-600" 
          description="Не прошли аудит"
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative group flex-1 min-w-[240px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider appearance-none focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
          >
            <option value="all">Все факультеты</option>
            {facultiesList.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>

        <div className="relative group flex-1 min-w-[240px]">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider appearance-none focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
          >
            <option value="all">Все преподаватели</option>
            {teachersList.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {groupedData.length > 0 ? groupedData.map((group) => {
            const items = group?.items || []; 
            const filteredItems = items.filter(item => {
              const statusMatch = activeTab === 'pending' ? item.status === 'pending' : item.status !== 'pending';
              const teacherMatch = selectedTeacher === 'all' || item.user_name === selectedTeacher;
              return statusMatch && teacherMatch;
            });

            if (filteredItems.length === 0) return null;

            return (
              <section key={group.faculty} className="space-y-4 text-left">
                <div className="flex items-center gap-4">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {group.faculty}
                  </h2>
                  <div className="h-px w-full bg-slate-200"></div>
                  <span className="text-[10px] font-bold text-slate-400">{filteredItems.length}</span>
                </div>

                <div className="space-y-4">
                  {filteredItems.map((req) => (
                    <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group relative overflow-hidden">
                      <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                            <User size={24} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-sm">{req.user_name}</h3>
                              <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">
                                {req.category}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-slate-700 leading-snug">{req.title}</p>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                <Clock size={12}/> {req.date}
                              </span>
                              <div className="flex gap-2">
                                {(req.files || []).map((file, idx) => (
                                  <a 
                                    key={idx} href={file.url} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 rounded border border-slate-200 text-[9px] font-bold hover:bg-blue-600 hover:text-white transition-all uppercase"
                                  >
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
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">баллов</p>
                          </div>
                          
                          {req.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => { setSelectedRequest(req); setShowCommentModal(true); }}
                                className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                              >
                                <XCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(req.id, 'approved')}
                                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                              >
                                <CheckCircle size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className={`text-[9px] font-bold uppercase px-3 py-1 rounded border ${
                              req.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
                            }`}>
                              {req.status === 'approved' ? 'Принято' : 'Отклонено'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section> 
            );
          }) : (
            <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
               <Search size={40} className="text-slate-200 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-slate-900">Очередь пуста</h3>
               <p className="text-slate-400 text-sm">Все заявки обработаны</p>
            </div>
          )}
        </div>

        {/* SIDEBAR STATS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl sticky top-10 text-left overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6">Эффективность</h4>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Прогресс аудита</span>
                    <span className="text-lg font-bold text-white">
                      {stats.total > 0 ? Math.round(((stats.total - stats.pending) / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-1000" 
                      style={{ width: `${stats.total > 0 ? ((stats.total - stats.pending) / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Одобрено</p>
                        <p className="text-xl font-bold text-emerald-400">{stats.approved}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Отклонено</p>
                        <p className="text-xl font-bold text-red-400">{stats.rejected}</p>
                    </div>
                </div>

                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  Скачать полный отчет <ArrowRight size={14}/>
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showCommentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden text-left">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Причина отказа</h3>
                <button onClick={() => setShowCommentModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
                <p className="text-xs font-bold text-slate-700">{selectedRequest?.user_name}</p>
                <p className="text-[10px] text-slate-400 mt-1 italic">{selectedRequest?.title}</p>
              </div>

              <textarea 
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all resize-none"
                placeholder="Укажите, что нужно исправить..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button 
                  onClick={() => setShowCommentModal(false)} 
                  className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected', rejectionReason)}
                  disabled={!rejectionReason.trim()}
                  className="py-3 bg-red-500 disabled:bg-slate-100 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default VerificationAudit;