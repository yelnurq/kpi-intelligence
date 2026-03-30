import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings2, Plus, Edit3, Trash2, School, Target, 
  Briefcase, GraduationCap, Loader2, Library, ChevronDown, X
} from 'lucide-react';

const TaxonomySettings = () => {
  const [activeSection, setActiveSection] = useState('kpi');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [data, setData] = useState({
    faculties: [],
    departments: [], 
    positions: [],
    degrees: [],
    kpi_metrics: {} 
  });

  const initialFormState = {
    name: '',
    category: 'учеб.работа',
    short_name: '',
    short_title: '',
    dean: '',
    leader: '',
    faculty_id: '',
    points: 10,
    min_kpi_target: 0
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:8000/api/admin/helpers/options', {
          headers: { Authorization : `Bearer ${token}` }
      }); 
      
      setData({
        kpi_metrics: response.data.kpi_metrics || {},
        faculties: response.data.faculties || [],
        positions: response.data.positions || [],
        degrees: response.data.degrees || [],
        departments: response.data.departments || []
      });
    } catch (error) {
      console.error("Ошибка загрузки справочников", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData(initialFormState);
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    
    // Динамически заполняем форму данными из item
    // Используем spread, чтобы сохранить все поля, приходящие с бэкенда
    setFormData({
      ...initialFormState, // Сбрасываем к дефолтам
      ...item,             // Накладываем данные из БД
      name: item.name || item.title || '', // Обработка разных именований в БД
      faculty_id: item.faculty_id || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editId 
        ? `http://localhost:8000/api/admin/helpers/options/${editId}` 
        : 'http://localhost:8000/api/admin/helpers/options';
      
      const method = editId ? 'put' : 'post';

      await axios[method](url, {
        type: activeSection,
        ...formData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      closeModal();
      fetchOptions();
    } catch (error) {
      alert("Ошибка при сохранении: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту запись?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/admin/helpers/options/${id}?type=${activeSection}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOptions();
    } catch (error) {
      alert("Ошибка при удалении: " + (error.response?.data?.message || error.message));
    }
  };

  const getTotalKpiCount = () => {
    return Object.values(data.kpi_metrics).reduce((acc, curr) => acc + curr.length, 0);
  };

  return (
    <main className="border rounded-lg mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left relative">
      
      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">{editId ? 'Редактировать' : 'Добавить'}: {activeSection}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Наименование</label>
                <input 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              {activeSection === 'kpi' && (
                <>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Категория</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      {['учеб.работа', 'учебно-методическая работа', 'организационно-методическая работа', 'научно-исследовательская работа', 'воспитательная работа', 'повышение квалификации'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Баллы</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" 
                      value={formData.points} onChange={e => setFormData({...formData, points: e.target.value})} />
                  </div>
                </>
              )}

              {activeSection === 'faculties' && (
                <>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Короткий заголовок</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" 
                      value={formData.short_title} onChange={e => setFormData({...formData, short_title: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Аббревиатура</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" 
                      value={formData.short_name} onChange={e => setFormData({...formData, short_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Декан</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" 
                      value={formData.dean} onChange={e => setFormData({...formData, dean: e.target.value})} />
                  </div>
                </>
              )}

              {activeSection === 'departments' && (
                <>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Факультет</label>
                    <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                      value={formData.faculty_id} onChange={e => setFormData({...formData, faculty_id: e.target.value})}>
                      <option value="">Выберите факультет...</option>
                      {data.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Аббревиатура</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" 
                      value={formData.short_name} onChange={e => setFormData({...formData, short_name: e.target.value})} 
                      placeholder="Напр: ИТ"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Заведующий</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" 
                      value={formData.leader} onChange={e => setFormData({...formData, leader: e.target.value})} />
                  </div>
                </>
              )}

              {activeSection === 'positions' && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Целевой KPI</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" 
                    value={formData.min_kpi_target} onChange={e => setFormData({...formData, min_kpi_target: e.target.value})} />
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 text-white py-3 mt-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                {editId ? 'Сохранить изменения' : 'Создать запись'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Настройки системы</h1>
          <p className="flex items-center gap-2 mt-2 text-sm text-gray-500">Управление структурой университета</p>
        </div>

        <div className="flex flex-wrap bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'kpi', label: 'KPI Индикаторы', icon: Target },
            { id: 'faculties', label: 'Факультеты', icon: School },
            { id: 'departments', label: 'Кафедры', icon: Library },
            { id: 'degrees', label: 'Степени', icon: GraduationCap },
            { id: 'positions', label: 'Должности', icon: Briefcase },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeSection === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Редактирование: {activeSection === 'kpi' ? 'Категории KPI' : activeSection}
            </h2>
            <button 
              onClick={() => { setEditId(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
            >
              <Plus size={14} /> Добавить запись
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left relative min-h-[400px]">
            {loading ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Загрузка данных...</span>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">#</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Наименование</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeSection === 'kpi' ? (
                    Object.keys(data.kpi_metrics).map((category) => (
                      <React.Fragment key={category}>
                        <tr className="bg-slate-50/80">
                          <td colSpan="3" className="px-6 py-2 border-y border-slate-100">
                            <div className="flex items-center gap-2">
                              <ChevronDown size={12} className="text-blue-600" />
                              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{category}</span>
                            </div>
                          </td>
                        </tr>
                        {data.kpi_metrics[category].map((item, index) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 group">
                            <td className="px-6 py-4 text-xs font-bold text-slate-400">{index + 1}</td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-slate-900">{item.name}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditClick(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={14}/></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={14}/></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    data[activeSection]?.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 group">
                        <td className="px-6 py-4 text-xs font-bold text-slate-400">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-900">{item.name}</span>
                            {item.short_name && <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider ml-2 bg-slate-100 px-1 rounded">{item.short_name}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={14}/></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* SIDEBAR STATS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-slate-900 rounded-[24px] shadow-xl shadow-slate-200">
              <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50">Статистика БД</h4>
              <div className="space-y-3">
                 <StatItem label="Индикаторов KPI" value={loading ? "..." : getTotalKpiCount()} />
                 <StatItem label="Факультетов" value={loading ? "..." : data.faculties.length} />
                 <StatItem label="Кафедр" value={loading ? "..." : data.departments.length} />
                 <StatItem label="Степеней" value={loading ? "..." : data.degrees.length} />
                 <StatItem label="Должностей" value={loading ? "..." : data.positions.length} />
              </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const StatItem = ({ label, value }) => (
    <div className="flex justify-between items-end border-b border-white/10 pb-2">
        <span className="text-[10px] text-white/70 uppercase">{label}</span>
        <span className="text-xl font-black text-white">{value}</span>
    </div>
);

export default TaxonomySettings;