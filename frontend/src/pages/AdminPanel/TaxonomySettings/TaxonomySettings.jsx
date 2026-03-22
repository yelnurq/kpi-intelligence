import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings2, Plus, Edit3, Trash2, Layers, School, Target, 
  Award, Briefcase, GraduationCap, Loader2, Library 
} from 'lucide-react';

const TaxonomySettings = () => {
  const [activeSection, setActiveSection] = useState('kpi');
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState({
    faculties: [],
    departments: [], 
    positions: [],
    degrees: [],
    kpi_metrics: [] 
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8000/api/admin/helpers/options', {
            headers: { Authorization : `Bearer ${token}` }
        }); 
        
        setData(prev => ({
          ...prev,
          kpi_metrics: response.data.kpi_metrics || [],
          faculties: response.data.faculties || [],
          positions: response.data.positions || [],
          degrees: response.data.degrees || [],
          departments: response.data.departments || [] // Загружаем кафедры
        }));
      } catch (error) {
        console.error("Ошибка загрузки справочников", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="border rounded-lg mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Настройки системы</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Управление справочниками и структурой университета</p>
        </div>

        {/* Навигация с добавленной кнопкой "Кафедры" */}
        <div className="flex flex-wrap bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'kpi', label: 'KPI', icon: Target },
            { id: 'faculties', label: 'Факультеты', icon: School },
            { id: 'departments', label: 'Кафедры', icon: Library }, // Новая вкладка
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
              Редактирование: {activeSection === 'departments' ? 'Список кафедр' : activeSection}
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100">
              <Plus size={14} /> Добавить
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">#</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Наименование (Title)</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data[activeSection === 'kpi' ? 'kpi_metrics' : activeSection]?.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {activeSection === 'departments' && <Library size={14} className="text-slate-300"/>}
                        <span className="text-sm font-bold text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={14}/></button>
                        <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(data[activeSection === 'kpi' ? 'kpi_metrics' : activeSection]?.length === 0) && (
                <div className="py-20 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
                    Раздел {activeSection} пуст
                </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl transition-colors group-hover:bg-blue-100/50"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 text-blue-600">
                <Settings2 size={18} />
                <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Структура данных</h4>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Кафедры привязаны к факультетам. При удалении кафедры проверьте наличие связанных с ней сотрудников в системе KPI.
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-[24px] shadow-xl shadow-slate-200 text-left">
             <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50">Статистика БД</h4>
             <div className="space-y-3">
                <StatItem label="Факультетов" value={data.faculties.length} />
                <StatItem label="Кафедр" value={data.departments.length} />
                <StatItem label="Степеней" value={data.degrees.length} />
                <StatItem label="Должностей" value={data.positions.length} />
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const StatItem = ({ label, value }) => (
    <div className="flex justify-between items-end border-b border-white/10 pb-2 text-left">
        <span className="text-[10px] text-white/70 uppercase tracking-tighter">{label}</span>
        <span className="text-xl font-black text-white">{value}</span>
    </div>
);

export default TaxonomySettings;