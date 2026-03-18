import React, { useState, useMemo, useEffect } from 'react';
import { Search, CheckCircle2, Globe, BookOpen, PenTool, Trash2, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KPIPrintReport from '../../../components/KPI/KPIPrintReport';

const PlanningPage = () => {
  const navigate = useNavigate();
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [showReport, setShowReport] = useState(false);
const [saving, setSaving] = useState(false);

  const categories = ['Все', 'Наука', 'Метод.раб', 'Общ.деят'];
  const years = ['2025-2026', '2026-2027'];



  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8000/api/kpi-indicators', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const result = await response.json();
        
        if (result.status === 'success') {
          setIndicators(result.data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке KPI:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, [navigate]);

const handleSave = async () => {
  if (selectedIds.length === 0) {
    alert("Выберите хотя бы один индикатор");
    return;
  }

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

    const result = await response.json();

    if (response.ok) {
      alert("План KPI успешно сохранен в базе!");
      setShowReport(true); // Открываем отчет только после успешного сохранения
    } else {
      throw new Error(result.message || "Ошибка при сохранении");
    }
  } catch (error) {
    console.error("Save error:", error);
    alert("Не удалось сохранить план: " + error.message);
  } finally {
    setSaving(false);
  }
};
  const toggleIndicator = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredIndicators = useMemo(() => {
    return indicators.filter(item => {
      // Если год в базе не указан, разрешаем отображение, иначе проверяем на строгое соответствие
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="font-bold text-slate-400 uppercase tracking-widest text-sm">Загрузка KPI...</div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
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
        <button 
          onClick={handleSave} 
          disabled={saving || selectedIds.length === 0}
          className={`${
            saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:cursor-not-allowed`}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FileText size={18} />
          )}
          {saving ? 'Сохранение...' : 'Сохранить и создать отчет'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Левая колонка */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex-1 md:flex-none ${
                    activeTab === cat ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Найти индикатор..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredIndicators.length > 0 ? (
              filteredIndicators.map(item => {
                const isSelected = selectedIds.includes(item.id);
                const catLower = (item.category || "").toLowerCase();

                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleIndicator(item.id)}
                    className={`flex items-center gap-6 p-5 bg-white border rounded-xl transition-all cursor-pointer group ${
                      isSelected ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'
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
                        {item.difficulty && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase">
                            {item.difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="text-lg font-bold text-slate-900 whitespace-nowrap">
                        {item.points} <span className="text-xs text-gray-400 font-normal">баллов</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-transparent'
                      }`}>
                        <CheckCircle2 size={14} />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Индикаторы не найдены</p>
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка: Итоги */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm sticky top-8">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-slate-900">Ваш выбор</h3>
              <p className="text-xs text-gray-500 mt-1">Итоговый план на год</p>
            </div>
            
            <div className="p-6 space-y-4">
              {selectedIds.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4 italic">Ничего не выбрано</p>
              ) : (
                selectedItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center group animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex flex-col max-w-[80%]">
                      <span className="text-sm font-medium text-slate-700 truncate">{item.title}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-blue-500 font-bold">{item.points} баллов</span>
                        <span className="text-[10px] text-gray-400 italic">{item.year || selectedYear}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleIndicator(item.id); }}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Итого:</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-slate-900">{totalPoints}</span>
                    <span className="text-sm text-gray-400 font-bold ml-1">/ 600</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${totalPoints >= 450 ? 'bg-green-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min((totalPoints / 600) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-gray-400 text-center">Минимум для подтверждения: 450 баллов</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReport && (
        <KPIPrintReport 
          selectedItems={selectedItems} 
          totalPoints={totalPoints} 
          selectedYear={selectedYear}
          onClose={() => setShowReport(false)} 
        />
      )}
    </main>
  );
};

export default PlanningPage;