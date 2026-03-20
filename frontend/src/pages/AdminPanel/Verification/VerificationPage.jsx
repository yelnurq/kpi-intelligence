import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, XCircle, Clock, Search, 
  User, FileText, ArrowRight, Shield, 
  Download, History, Loader2, X, ChevronRight,
  Filter, LayoutGrid
} from 'lucide-react';

const VerificationAudit = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' или 'history'
  const [loading, setLoading] = useState(true);
  const [groupedData, setGroupedData] = useState([]);
  const [facultiesList, setFacultiesList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  
  // Модалка для отказа
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  // Загрузка данных с учетом фильтрации
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE}/admin/kpi-activities`);
      if (selectedFaculty !== 'all') {
        url.searchParams.append('faculty', selectedFaculty);
      }

      const res = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json' 
        }
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

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Смена статуса (Одобрение / Отказ)
  const handleStatusUpdate = async (id, status, comment = null) => {
    try {
      const res = await fetch(`${API_BASE}/kpi-activities/${id}/status`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ status, comment }) // Используем comment
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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Загрузка очереди...</span>
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-blue-600" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Система верификации KPI</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Аудит активностей</h1>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            В очереди ({stats.pending})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            История действий
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={16} />
          <select 
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-wider appearance-none focus:outline-none focus:ring-4 ring-blue-50 transition-all cursor-pointer shadow-sm min-w-[240px]"
          >
            <option value="all">Все факультеты</option>
            {facultiesList.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-8 space-y-12">
          {groupedData.length > 0 ? groupedData.map((group) => {
            const items = group?.items || []; 
            const filteredItems = items.filter(item => 
              activeTab === 'pending' ? item.status === 'pending' : item.status !== 'pending'
            );

            if (filteredItems.length === 0) return null;

            return (
              <section key={group.faculty} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                    {group.faculty}
                  </h2>
                  <div className="h-px w-full bg-slate-200"></div>
                  <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {filteredItems.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {filteredItems.map((req) => (
                    <div key={req.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:border-blue-300 transition-all group relative overflow-hidden">
                      <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                        <div className="flex gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <User size={28} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900">{req.user_name}</h3>
                              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">
                                {req.category}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-blue-600 leading-tight">{req.title}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                <Clock size={12}/> {req.date}
                              </span>
                              <div className="flex gap-2">
                                {(req.files || []).map((file, idx) => (
                                  <a 
                                    key={idx} href={file.url} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all uppercase"
                                  >
                                    <Download size={10}/> Doc #{idx + 1}
                                  </a>
                                ))}
                              </div>
                            </div>

                            {/* Вывод причины отказа в Истории */}
                            {activeTab === 'history' && req.status === 'rejected' && req.comment && (
                              <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-[9px] font-black text-red-400 uppercase mb-1">Причина отклонения:</p>
                                <p className="text-xs text-red-700 font-medium">{req.comment}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-50 pt-4 md:pt-0 md:pl-8">
                          <div className="text-right mb-3">
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">+{req.total_points}</span>
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none tracking-widest">баллов</p>
                          </div>
                          
                          {req.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => { setSelectedRequest(req); setShowCommentModal(true); }}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Отклонить"
                              >
                                <XCircle size={20} />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(req.id, 'approved')}
                                className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                title="Одобрить"
                              >
                                <CheckCircle size={20} />
                              </button>
                            </div>
                          ) : (
                            <div className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-lg border ${
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
            <div className="bg-white rounded-[40px] p-20 text-center border border-slate-200">
               <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Search size={40} />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Заявок не найдено</h3>
               <p className="text-slate-400 text-sm mt-2">Попробуйте изменить параметры фильтрации</p>
            </div>
          )}
        </div>

        {/* ПРАВАЯ КОЛОНКА: СТАТИСТИКА */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl sticky top-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8">Статистика по выборке</h4>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Всего</p>
                  <p className="text-2xl font-black">{stats.total}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-bold text-green-400 uppercase">Одобрено</p>
                  <p className="text-2xl font-black">{stats.approved}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Процент одобрения</span>
                  <span className="text-xs font-bold text-blue-400">
                    {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" 
                    style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <button className="w-full py-4 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group flex items-center justify-center gap-2">
                Экспорт данных <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: ПРИЧИНА ОТКАЗА */}
      {showCommentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Отказ в баллах</h3>
                <button onClick={() => setShowCommentModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Объект отказа:</p>
                <p className="text-sm font-bold text-slate-700 truncate">{selectedRequest?.user_name} — {selectedRequest?.title}</p>
              </div>

              <textarea 
                className="w-full h-40 p-5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-medium focus:ring-2 ring-blue-100 focus:outline-none resize-none transition-all placeholder:text-slate-300"
                placeholder="Укажите причину для преподавателя..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button 
                  onClick={() => setShowCommentModal(false)} 
                  className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected', rejectionReason)}
                  disabled={!rejectionReason.trim()}
                  className="py-4 bg-red-500 disabled:bg-slate-200 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
                >
                  Отклонить
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