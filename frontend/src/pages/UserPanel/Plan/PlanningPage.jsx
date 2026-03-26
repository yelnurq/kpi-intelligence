import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, CheckCircle2, Globe, BookOpen, PenTool, 
  Trash2, Calendar, FileText, Info, Printer, 
  X, FileSpreadsheet, AlertTriangle, Clock, Check, XCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Компонент модального окна подтверждения
const ConfirmModal = ({ isOpen, onClose, onConfirm, loading, totalPoints }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Отправить на утверждение?</h3>
          <p className="text-gray-500 mb-6 leading-relaxed text-sm">
            Вы уверены, что хотите зафиксировать план на <span className="font-bold text-slate-800">{totalPoints} баллов</span>? 
            После отправки вы не сможете вносить изменения до проверки деканом.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Подтверждаю"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanningPage = () => {
  const navigate = useNavigate();
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025/2026');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояние статуса (из новой таблицы kpi_plan_submissions)
  const [submission, setSubmission] = useState({ status: 'draft', comment: null });

  const categories = ['Все', 'учеб.работа', 'учебно-методическая работа', 'организационно-методическая работа',
    'научно-исследовательская работа', 'воспитательная работа' , 'профориентационная работа', 'повышение квалификации'
  ];
  const years = ['2025/2026', '2026/2027'];

  // Блокировка редактирования
  const isReadOnly = submission.status === 'submitted' || submission.status === 'approved';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) { navigate('/login'); return; }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        // Загрузка индикаторов и статуса плана одним эффектом
        const [resIndicators, resStatus] = await Promise.all([
          fetch('http://localhost:8000/api/kpi-indicators', { headers }),
          fetch(`http://localhost:8000/api/get-plan-status?year=${selectedYear}`, { headers })
        ]);

        const dataInd = await resIndicators.json();
        const dataStatus = await resStatus.json();

        if (dataInd.status === 'success') setIndicators(dataInd.data);
        if (dataStatus.status === 'success') {
          setSelectedIds(dataStatus.selected_ids || []);
          setSubmission({
            status: dataStatus.plan_status || 'draft',
            comment: dataStatus.comment
          });
        }

      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, selectedYear]);

  // Финальная отправка декану
  const handleFinalSubmit = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch('http://localhost:8000/api/submit-plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          indicator_ids: selectedIds,
          academic_year: selectedYear
        })
      });

      if (response.ok) {
        setSubmission(prev => ({ ...prev, status: 'submitted' }));
        setIsModalOpen(false);
        alert("План отправлен на проверку декану!");
      }
    } catch (error) {
      alert("Ошибка отправки: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem("token");
      const indicatorIds = selectedItems.map(item => item.id);

      const response = await fetch("http://localhost:8000/api/export", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        body: JSON.stringify({
          indicator_ids: indicatorIds,
          year: selectedYear
        })
      });

      if (!response.ok) throw new Error("Ошибка сервера");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Individual_Plan_${selectedYear.replace('/', '_')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Export failed:", err);
      alert("Не удалось подготовить файл.");
    } finally {
      setExporting(false);
    }
  };

  const toggleIndicator = (id) => {
    if (isReadOnly) return; // Запрет клика, если на проверке
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const removeIndicator = (id) => {
    if (isReadOnly) return;
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const filteredIndicators = useMemo(() => {
    return indicators.filter(item => {
      const matchesYear = !item.year || item.year === selectedYear;
      const matchesTab = activeTab === 'Все' || item.category === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesTab && matchesSearch;
    });
  }, [indicators, activeTab, searchQuery, selectedYear]);

  const selectedItems = useMemo(() => 
    indicators.filter(item => selectedIds.includes(item.id)), 
  [indicators, selectedIds]);

  const totalPoints = useMemo(() => 
    selectedItems.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0), 
  [selectedItems]);

  const renderIndicatorCard = (item) => {
    const isSelected = selectedIds.includes(item.id);
    const catLower = (item.category || "").toLowerCase();
    
    return (
      <div 
        key={item.id}
        onClick={() => toggleIndicator(item.id)}
        className={`flex items-center gap-6 p-5 bg-white border rounded-xl transition-all group ${
          isReadOnly ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${
          isSelected ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
        }`}>
          {catLower.includes('наук') ? <Globe size={20} /> : 
           catLower.includes('метод') ? <BookOpen size={20} /> : 
           <PenTool size={20} />}
        </div>
        <div className="flex-grow text-left">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-bold text-slate-900 leading-tight">{item.title}</h4>
          </div>
          <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <div className="text-lg font-bold text-slate-900">
            {item.points} <span className="block text-xs text-gray-400 font-normal">баллов</span>
          </div>
          <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
            isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-transparent'
          }`}>
            <CheckCircle2 size={14} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans"> 
      
      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleFinalSubmit} 
        loading={saving}
        totalPoints={totalPoints}
      />

      {/* Верхний статус-бар */}
      <div className={`mb-8 p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
        submission.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
        submission.status === 'submitted' ? 'bg-blue-50 border-blue-100 text-blue-800' :
        submission.status === 'rejected' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-white border-gray-100 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${
            submission.status === 'approved' ? 'bg-emerald-500 text-white' :
            submission.status === 'submitted' ? 'bg-blue-500 text-white' : 
            submission.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {submission.status === 'approved' ? <Check size={24} /> : 
             submission.status === 'submitted' ? <Clock size={24} /> : 
             submission.status === 'rejected' ? <XCircle size={24} /> : <FileText size={24} />}
          </div>
          <div className="text-left">
            <h2 className="font-black text-lg uppercase tracking-tight">
              {submission.status === 'approved' ? 'План утвержден' : 
               submission.status === 'submitted' ? 'На проверке' : 
               submission.status === 'rejected' ? 'Нужны правки' : 'Черновик плана'}
            </h2>
            <p className="text-sm opacity-70">
              {isReadOnly ? 'Просмотр доступен, редактирование заблокировано.' : 'Сформируйте список и отправьте декану.'}
            </p>
            {submission.comment && (
              <div className="mt-2 text-sm font-bold bg-white/50 p-2 rounded-lg border border-current italic">
                Замечание: {submission.comment}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Кнопка экспорта доступна всегда */}
          <button 
            onClick={handleExport}
            disabled={selectedIds.length === 0 || exporting}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50
              ${exporting ? 'bg-emerald-100 text-emerald-400' : 'bg-white text-emerald-700 border border-emerald-100 hover:bg-emerald-600 hover:text-white'}`}
          >
            {exporting ? <div className="w-5 h-5 border-2 border-emerald-400 border-t-emerald-700 rounded-full animate-spin" /> : <FileSpreadsheet size={18} />}
            <span>Экспорт</span>
          </button>

          {/* Кнопка сохранения/отправки доступна только если не на проверке */}
          {!isReadOnly && (
            <button 
              onClick={() => setIsModalOpen(true)} 
              disabled={saving || exporting || selectedIds.length === 0}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50 transition-all"
            >
              <FileText size={18} />
              <span>Отправить декану</span>
            </button>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isReadOnly ? 'opacity-75 select-none' : ''}`}>
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="custom-scrollbar flex bg-gray-100 p-1 rounded-xl w-full overflow-x-auto">
              <div className="flex flex-nowrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    disabled={loading}
                    onClick={() => setActiveTab(cat)}
                    className={`px-5 py-2.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap flex-shrink-0 ${
                      activeTab === cat 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 gap-4 transition-all duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Загрузка данных...</p>
              </div>
            ) : activeTab === 'Все' ? (
              Object.entries(
                filteredIndicators.reduce((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                  return acc;
                }, {})
              ).map(([category, items]) => (
                <div key={category} className="space-y-4 mb-6">
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-grow bg-gray-200"></div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{category}</span>
                    <div className="h-px flex-grow bg-gray-200"></div>
                  </div>
                  {items.map(item => renderIndicatorCard(item))}
                </div>
              ))
            ) : (
              filteredIndicators.map(item => renderIndicatorCard(item))
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm sticky top-8 text-left">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-slate-900">Выбранные индикаторы</h3>
            </div>
            <div className="p-6 space-y-4">
              {selectedItems.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4 italic">Ничего не выбрано</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-3 group border-b border-gray-50 pb-2">
                      <div className="flex flex-col max-w-[85%]">
                        <span className="text-sm font-medium text-slate-700 leading-tight">{item.title}</span>
                        <span className="text-[10px] text-blue-500 font-bold mt-1 uppercase">{item.points} баллов</span>
                      </div>
                      {!isReadOnly && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeIndicator(item.id); }}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Итого:</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-slate-900">{totalPoints}</span>
                    <span className="text-sm text-gray-400 font-bold ml-1">/ 600</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlanningPage;