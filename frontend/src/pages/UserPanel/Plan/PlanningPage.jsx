import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, CheckCircle2, Globe, BookOpen, PenTool, 
  Trash2, Calendar, FileText, Info, Printer, 
  X, FileSpreadsheet, AlertTriangle, Clock, Check, XCircle, 
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConfirmModal = ({ isOpen, onClose, onConfirm, loading, selectedItems, onDeadlineChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-slate-900">Установка дедлайнов и отправка</h3>
          <p className="text-sm text-gray-500">Укажите планируемые даты завершения для каждого индикатора</p>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-slate-800 leading-tight">{item.title}</h4>
                  <span className="text-[10px] font-black text-blue-600 uppercase">{item.points} баллов</span>
                </div>
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Дата дедлайна</label>
                  <input
                    type="date"
                    required
                    value={item.deadline || ''}
                    onChange={(e) => onDeadlineChange(item.id, e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || selectedItems.some(i => !i.deadline)}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Подтвердить и отправить"}
          </button>
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
  const [deadlines, setDeadlines] = useState({}); // формат { "id_индикатора": "2026-05-20" }
  
  // Новое состояние для статуса подачи плана
  const [submission, setSubmission] = useState({ status: 'draft', comment: null });

  const categories = ['Все', 'учеб.работа', 'учебно-методическая работа', 'организационно-методическая работа',
    'научно-исследовательская работа', 'воспитательная работа' , 'профориентационная работа', 'повышение квалификации'
  ];
  const years = ['2025/2026', '2026/2027'];

  // Блокируем интерфейс, если план отправлен или утвержден
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

        // Загружаем индикаторы и текущий статус плана
        const [resIndicators, resStatus] = await Promise.all([
          fetch('http://localhost:8000/api/kpi-indicators', { headers }),
          fetch(`http://localhost:8000/api/get-plan-status?year=${selectedYear}`, { headers })
        ]);

        const dataIndicators = await resIndicators.json();
        const dataStatus = await resStatus.json();

        if (dataIndicators.status === 'success') setIndicators(dataIndicators.data);
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
  
const exportToExcel = async () => {
    if (selectedIds.length === 0) {
      alert("Выберите хотя бы один индикатор для экспорта");
      return;
    }

    setExporting(true);
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

// 2. Функция для изменения дедлайна (передаем в модалку)
const handleDeadlineChange = (id, date) => {
  setDeadlines(prev => ({
    ...prev,
    [id]: date
  }));
};

// 3. Подготовка данных для модалки (мерджим данные индикатора и дедлайн)
const selectedItemsWithDeadlines = useMemo(() => {
  return indicators
    .filter(item => selectedIds.includes(item.id))
    .map(item => ({
      ...item,
      deadline: deadlines[item.id] || ''
    }));
}, [indicators, selectedIds, deadlines]);
  const handleFinalSubmit = async () => {
  // Проверка: все ли дедлайны заполнены
  const payload = selectedItemsWithDeadlines.map(item => ({
    indicator_id: item.id,
    deadline: item.deadline
  }));

  if (payload.some(p => !p.deadline)) {
    alert("Пожалуйста, укажите дедлайны для всех индикаторов");
    return;
  }

  try {
    setSaving(true);
    const token = localStorage.getItem("token");
    
    const response = await fetch('http://localhost:8000/api/submit-plan', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: payload, // Отправляем массив объектов {id, deadline}
        academic_year: selectedYear
      })
    });

    if (response.ok) {
      setSubmission(prev => ({ ...prev, status: 'submitted' }));
      setIsModalOpen(false);
      alert("План успешно отправлен!");
    }
  } catch (error) {
    alert("Ошибка: " + error.message);
  } finally {
    setSaving(false);
  }
};

 const toggleIndicator = async (id) => {
    if (isReadOnly) return;

    // 1. Сначала обновляем UI (мгновенно)
    const newIds = selectedIds.includes(id)
        ? selectedIds.filter(i => i !== id)
        : [...selectedIds, id];
    
    setSelectedIds(newIds);

    // 2. Сразу шлем в базу
    try {
        const token = localStorage.getItem("token");
        await fetch('http://localhost:8000/api/save-kpi-plan', { // Твой новый метод
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                indicator_ids: newIds,
                academic_year: selectedYear
            })
        });
    } catch (error) {
        console.error("Ошибка сохранения плана:", error);
    }
};
  const removeIndicator = (id) => {
    if (isReadOnly) return;
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const selectedItems = useMemo(() => 
    indicators.filter(item => selectedIds.includes(item.id)), 
  [indicators, selectedIds]);

  const totalPoints = useMemo(() => 
    selectedItems.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0), 
  [selectedItems]);

  const filteredIndicators = useMemo(() => {
    return indicators.filter(item => {
      const matchesYear = !item.year || item.year === selectedYear;
      const matchesTab = activeTab === 'Все' || item.category === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesTab && matchesSearch;
    });
  }, [indicators, activeTab, searchQuery, selectedYear]);

  const renderIndicatorCard = (item) => {
    const isSelected = selectedIds.includes(item.id);
    const catLower = (item.category || "").toLowerCase();
    
    return (
      <div 
        key={item.id}
        onClick={() => toggleIndicator(item.id)}
        className={`flex items-center gap-6 p-5 bg-white border rounded-xl transition-all group ${
          isReadOnly ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
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
          <h4 className="font-bold text-slate-900 leading-tight">{item.title}</h4>
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
  selectedItems={selectedItemsWithDeadlines} // Передаем данные с дедлайнами
  onDeadlineChange={handleDeadlineChange}   // Передаем функцию изменения
/>
      {/* СТАТУС-БАР ПЛАНА */}
      <div className={`mb-8 p-4 rounded-2xl border flex items-center justify-between transition-all ${
        submission.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
        submission.status === 'submitted' ? 'bg-amber-50 border-amber-200 text-amber-800' :
        submission.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-gray-100 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${
            submission.status === 'approved' ? 'bg-emerald-500 text-white' :
            submission.status === 'submitted' ? 'bg-amber-500 text-white' : 
            submission.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {submission.status === 'approved' ? <CheckCircle2 size={24} /> : 
             submission.status === 'submitted' ? <Clock size={24} /> : 
             submission.status === 'rejected' ? <XCircle size={24} /> : <FileText size={24} />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Статус плана</p>
            <h3 className="font-black">
              {submission.status === 'approved' ? 'УТВЕРЖДЕН' : 
               submission.status === 'submitted' ? 'НА ПРОВЕРКЕ' : 
               submission.status === 'rejected' ? 'ОТКЛОНЕН' : 'ЧЕРНОВИК'}
            </h3>
          </div>
        </div>
        
        {submission.comment && (
          <div className="flex-grow mx-10 text-sm italic bg-white/50 p-2 rounded border border-red-100">
            Замечание: {submission.comment}
          </div>
        )}

        <div className="flex items-center gap-3">
          {!isReadOnly && (
            <button 
              onClick={() => setIsModalOpen(true)} 
              disabled={selectedIds.length === 0 || saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <FileText size={18} />
              Отправить декану
            </button>
          )}
         <button 
  onClick={exportToExcel}
  disabled={exporting || selectedIds.length === 0}
  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50"
>
  {exporting ? <Loader2 className="animate-spin" size={18} /> : <FileSpreadsheet size={18} />}
  Excel
</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Планирование KPI</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>Учебный год:</span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)} 
              disabled={isReadOnly}
              className="font-bold text-blue-600 bg-transparent border-none focus:ring-0 cursor-pointer p-0 disabled:opacity-50"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`lg:col-span-8 space-y-6 ${isReadOnly ? 'pointer-events-none' : ''}`}>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="custom-scrollbar flex bg-gray-100 p-1 rounded-xl w-full overflow-x-auto">
              <div className="flex flex-nowrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
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

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="py-20 text-center bg-white rounded-xl border border-dashed">Загрузка...</div>
            ) : (
              filteredIndicators.map(item => renderIndicatorCard(item))
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm sticky top-8 text-left">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-slate-900">Ваш выбор</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-3 border-b border-gray-50 pb-2">
                    <div className="flex flex-col max-w-[85%]">
                      <span className="text-sm font-medium text-slate-700">{item.title}</span>
                      <span className="text-[10px] text-blue-500 font-bold uppercase">{item.points} баллов</span>
                    </div>
                    {!isReadOnly && (
                      <button onClick={() => removeIndicator(item.id)} className="text-gray-300 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-500 uppercase">Итого:</span>
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