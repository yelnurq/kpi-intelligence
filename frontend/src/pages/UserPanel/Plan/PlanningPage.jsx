import React, { useState, useMemo, useEffect } from 'react';
import { Search, CheckCircle2, Globe, BookOpen, PenTool, Trash2, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KPIPrintReport from '../../../components/KPI/KPIPrintReport';

import { Info, Printer, X, FileSpreadsheet } from 'lucide-react';


const PlanningPage = () => {
  const navigate = useNavigate();
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025/2026');
  const [showReport, setShowReport] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false); 
  const categories = ['Все', 'учеб.работа', 'учебно-методическая работа', 'организационно-методическая работа',
    'научно-исследовательская работа', 'воспитательная работа' , 'профориентационная работа', 'повышение квалификации'
  ];
  const years = ['2025/2026', '2026/2027'];

  
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

        // 1. Загружаем все индикаторы
        const resIndicators = await fetch('http://localhost:8000/api/kpi-indicators', { headers });
        if (resIndicators.status === 401) { navigate('/login'); return; }
        const dataIndicators = await resIndicators.json();

        // 2. Загружаем сохраненный план для текущего года
        const resPlan = await fetch(`http://localhost:8000/api/get-user-plan-ids?year=${selectedYear}`, { headers });
        const dataPlan = await resPlan.json();

        if (dataIndicators.status === 'success') setIndicators(dataIndicators.data);
        if (dataPlan.status === 'success') setSelectedIds(dataPlan.data);

      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, selectedYear]); // Перезагружаем при смене года

  const handleSave = async () => {
    // Сохранение (теперь можно сохранять даже пустой список, если всё удалили)
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch('http://localhost:8000/api/save-kpi-plan', {
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
        alert("План успешно обновлен!");
        if (selectedIds.length > 0) setShowReport(true);
      }
    } catch (error) {
      alert("Ошибка сохранения: " + error.message);
    } finally {
      setSaving(false);
    }
  };
  const handleExport = async () => {
    try {
      setExporting(true); // Включаем лоадер
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
      setExporting(false); // Выключаем лоадер
    }
  };
  const toggleIndicator = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Удаление теперь просто вызывает toggle (дизайн кнопки Trash в правой колонке уже настроен на это)
  const removeIndicator = (id) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

const renderIndicatorCard = (item) => {
  const isSelected = selectedIds.includes(item.id);
  const catLower = (item.category || "").toLowerCase();
  
  return (
    <div 
      key={item.id}
      onClick={() => toggleIndicator(item.id)}
      className={`flex items-center gap-6 p-5 bg-white border rounded-xl transition-all cursor-pointer group ${
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
      <div className="flex-grow">
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

 
return (
  <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
    {/* Header остается без изменений */}
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Планирование KPI</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Calendar size={14} />
          <span>Учебный год:</span>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)} 
            className="font-bold text-blue-600 bg-transparent border-none focus:ring-0 cursor-pointer p-0"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      
      {/* Кнопки экспорта и сохранения */}
      <div className="flex items-center gap-3">
        <button 
          onClick={handleExport}
          disabled={selectedIds.length === 0 || exporting}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg active:scale-95 disabled:opacity-50
            ${exporting ? 'bg-emerald-100 text-emerald-400' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'}`}
        >
          {exporting ? <div className="w-5 h-5 border-2 border-emerald-400 border-t-emerald-700 rounded-full animate-spin" /> : <FileSpreadsheet size={18} />}
          <span>{exporting ? 'Подготовка...' : 'Скачать отчет'}</span>
        </button>

        <button 
          onClick={handleSave} 
          disabled={saving || exporting}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg active:scale-95
            ${saving ? 'bg-blue-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileText size={18} />}
          <span>{saving ? 'Сохранение...' : 'Обновить и сохранить'}</span>
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Левая колонка с индикаторами */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          {/* Tabs & Search... */}
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

        {/* СЕКЦИЯ КОНТЕНТА С ЛОКАЛЬНОЙ ЗАГРУЗКОЙ */}
        <div className={`grid grid-cols-1 gap-4 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {loading ? (
            // Локальный индикатор загрузки вместо пустого экрана
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-gray-500 font-medium">Загрузка индикаторов...</p>
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

      {/* Правая колонка "Ваш выбор" (Sidebar) */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm sticky top-8">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-slate-900">Ваш выбор</h3>
          </div>
          <div className="p-6 space-y-4">
            {/* Здесь загрузку можно не показывать, так как selectedItems зависят от локального стейта */}
            {selectedItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4 italic">Ничего не выбрано</p>
            ) : (
              selectedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex flex-col max-w-[80%]">
                    <span className="text-sm font-medium text-slate-700 truncate">{item.title}</span>
                    <span className="text-[10px] text-blue-500 font-bold">{item.points} баллов</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeIndicator(item.id); }}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold text-gray-500">Итого:</span>
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