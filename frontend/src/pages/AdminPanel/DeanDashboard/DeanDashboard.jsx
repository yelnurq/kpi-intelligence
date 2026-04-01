  import React, { useEffect, useState, useCallback, useMemo } from 'react';
  import { 
    Users, CheckCircle2, Clock, AlertCircle, 
    ExternalLink, Check, X, MessageSquare, 
    Filter, ChevronRight, Inbox, Loader2, 
    ArrowUpRight, User, ShieldCheck, ChevronLeft
  } from 'lucide-react';

  // Компонент карточки статистики
  const StatCard = ({ icon: Icon, label, value, trend, colorClass, description, isPrimary, unit = "планов" }) => (
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
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">{description}</p>
        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight size={14} /> {trend}%
          </div>
        )}
      </div>
    </div>
  );

  const DeanDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('submitted');
    const [selectedDept, setSelectedDept] = useState('all');
    
    // Состояния для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ last_page: 1, total: 0 });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [comment, setComment] = useState('');
    const [globalStats, setGlobalStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const API_BASE = 'http://localhost:8000/api';
    const ACADEMIC_YEAR = '2025/2026';

    // Загрузка списка с учетом пагинации и фильтров
    const fetchSubmissions = useCallback(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({
          year: ACADEMIC_YEAR,
          page: currentPage,
          status: activeTab,
          department_id: selectedDept
        });

        const res = await fetch(`${API_BASE}/dean/submissions?${params.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.status === 'success') {
          setSubmissions(result.data);
          setPagination(result.meta);
          if (result.stats) setGlobalStats(result.stats); // Сохраняем статистику всей БД
      }
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    }, [currentPage, activeTab, selectedDept]);

    useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

    // Сброс страницы при смене фильтров
    useEffect(() => { setCurrentPage(1); }, [activeTab, selectedDept]);

    useEffect(() => {
      if (isModalOpen) {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }, [isModalOpen]);

    const handleOpenDetails = async (row) => {
      setSelectedPlan(row);
      setIsModalOpen(true);
      setLoadingDetails(true);
      setComment(row.comment || '');

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/dean/user-plan/${row.user_id}?year=${ACADEMIC_YEAR}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setSelectedPlan(prev => ({ ...prev, indicators: data.indicators || [] }));
      } catch (error) {
        console.error("Ошибка загрузки индикаторов:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
  const getPaginationRange = (current, last) => {
    const delta = 2; // Сколько страниц показывать по бокам от текущей
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };
    const handleUpdateStatus = async (newStatus) => {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/dean/update-status`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: selectedPlan.user_id,
            status: newStatus,
            comment: comment,
            academic_year: ACADEMIC_YEAR
          })
        });

        if (response.ok) {
          setIsModalOpen(false);
          setComment('');
          await fetchSubmissions();
        }
      } catch (error) {
        alert("Ошибка при обновлении статуса");
      } finally {
        setIsSubmitting(false);
      }
    };
  const stats = useMemo(() => globalStats, [globalStats]);


    const departments = useMemo(() => 
      ['all', ...new Set(submissions.map(s => s.department))].sort(), 
    [submissions]);

    return (
      <main className="mx-auto px-4 md:px-10 py-10 bg-[#f8fafc] min-h-screen font-sans border rounded-lg">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 text-left">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Статус подготовки планов</h1>
            <p className="flex items-center gap-2 mt-2 text-sm text-gray-500">Утверждение индивидуальных планов KPI • {ACADEMIC_YEAR}</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {['submitted', 'approved', 'all'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'submitted' ? `На проверку (${stats.pending})` : tab === 'approved' ? 'Утвержденные' : 'Все'}
              </button>
            ))}
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Всего планов" value={stats.total} icon={Inbox} colorClass="bg-slate-100 text-slate-600" description="Общий поток документов" />
          <StatCard label="Ожидают" value={stats.pending} icon={Clock} colorClass="bg-amber-100 text-amber-600" description="Требуют вашей подписи" isPrimary={activeTab === 'submitted'} />
          <StatCard label="Утверждено" value={stats.approved} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600" description="Согласованные планы" />
          <StatCard label="Отклонено" value={stats.rejected} icon={AlertCircle} colorClass="bg-red-100 text-red-600" description="Возвращены на доработку" />
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative flex-1 min-w-[300px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider appearance-none focus:border-blue-500 outline-none shadow-sm cursor-pointer"
            >
              <option value="all">Все кафедры факультета</option>
              {departments.filter(d => d !== 'all').map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="bg-white rounded-[32px] border border-slate-100 p-20 flex flex-col items-center justify-center shadow-sm">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Загрузка данных...</span>
              </div>
            ) : submissions.length > 0 ? (
              <>
                {submissions.map((row) => (
                  <div key={row.user_id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group text-left">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                          <User size={24} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{row.name}</h3>
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${row.status === 'submitted' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                              {row.status === 'submitted' ? 'Ожидает' : 'Обработан'}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-500">{row.faculty}</p>
                          <p className="text-xs font-medium text-slate-500">{row.department}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                              <Clock size={12}/> {row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '—'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 min-w-[140px]">
                        <div className="text-right mb-3">
                          <span className="text-2xl font-bold text-slate-900 tracking-tighter">{row.total_points || 0}</span>
                          <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">баллов в плане</p>
                        </div>
                        
                        <button 
                          onClick={() => handleOpenDetails(row)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-all shadow-md active:scale-95"
                        >
                          Ревизия <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* PAGINATION UI */}
  {pagination.last_page > 1 && (
    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
      <button 
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(prev => prev - 1)}
        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronLeft size={16} className="text-slate-600" />
      </button>

      <div className="flex items-center gap-1.5">
        {getPaginationRange(currentPage, pagination.last_page).map((page, i) => (
          <React.Fragment key={i}>
            {page === '...' ? (
              <span className="px-2 text-slate-400 font-bold">...</span>
            ) : (
              <button
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-[11px] font-bold transition-all ${
                  currentPage === page 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-600/20' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button 
        disabled={currentPage === pagination.last_page}
        onClick={() => setCurrentPage(prev => prev + 1)}
        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronRight size={16} className="text-slate-600" />
      </button>
    </div>
  )}
              </>
            ) : (
              <div className="bg-white rounded-[32px] border border-slate-200 border-dashed p-16 text-center">
                <Inbox size={32} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Пусто</h3>
                <p className="text-sm text-slate-400 mt-2">Планов в этой категории пока нет</p>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm sticky top-10 text-left">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="text-blue-600" size={18} />
                <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Прогресс факультета</h4>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Утверждено планов</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-[1px]">
                    <div className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-emerald-500 to-teal-400" 
                      style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL WINDOW */}
        {isModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative overflow-hidden text-left border border-slate-200 flex flex-col max-h-[90vh]">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
              
              <div className="p-8 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Проверка KPI плана</p>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{selectedPlan.name}</h3>
                    <p className="text-sm text-slate-500">{selectedPlan.department}</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                    <X size={20}/>
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto bg-slate-50/50 flex-1">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Выбранные индикаторы</p>
                    <div className="grid gap-2">
                      {loadingDetails ? (
                        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                          <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={24} />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Загрузка данных из БД...</p>
                        </div>
                      ) : (selectedPlan.indicators && selectedPlan.indicators.length > 0) ? (
                        selectedPlan.indicators.map((item, idx) => (
                          <div key={idx} className="group bg-white border border-slate-200 p-4 rounded-2xl flex justify-between items-center transition-all hover:border-blue-200 shadow-sm">
                            <div className="space-y-1 pr-4 text-left">
                              <div className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                <p className="text-xs font-bold text-slate-800 leading-tight">
                                  {item.title || item.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 ml-3.5">
                                <p className="text-[9px] text-slate-400 uppercase font-medium">
                                  {item.category || 'Показатель'}
                                </p>
                                {item.deadline && (
                                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase">
                                    <Clock size={10} /> До {new Date(item.deadline).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-lg font-black text-slate-900 tracking-tighter">{item.points}</span>
                              <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">баллов</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                          <p className="text-xs">Индикаторы не найдены</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Вердикт декана</p>
                    <div className="flex flex-wrap gap-2">
                      {['План согласован', 'Требуется корректировка баллов', 'Недостаточно обоснования'].map((t) => (
                        <button key={t} onClick={() => setComment(t)} 
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all uppercase ${comment === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full h-28 p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none shadow-inner"
                      placeholder="Напишите замечания..."
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={isSubmitting || !comment}
                    className="py-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <X size={14} /> Отклонить
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus('approved')}
                    disabled={isSubmitting}
                    className="py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><Check size={14} /> Утвердить план</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  };

  export default DeanDashboard;