import React, { useState } from 'react';
import { 
  Settings2, Plus, Edit3, Trash2, Layers, School, Target, 
  Award, Briefcase, GraduationCap, Info, ChevronRight 
} from 'lucide-react';

const TaxonomySettings = () => {
  // Расширяем состояния для новых разделов
  const [activeSection, setActiveSection] = useState('kpi'); 
  
  const [kpiMetrics] = useState([
    { id: 1, title: "Публикация в Scopus/WoS", points: 50, category: "Наука", unit: "за статью" },
    { id: 2, title: "Разработка ПО (Startup)", points: 40, category: "Инновации", unit: "за проект" },
  ]);

  const [faculties] = useState([
    { id: 1, name: "IT и Естественные науки", code: "FIT", deparments: 4 },
    { id: 2, name: "Экономика и Право", code: "FEP", deparments: 3 },
  ]);

  // НОВЫЕ ДАННЫЕ: Ученые степени
  const [degrees] = useState([
    { id: 1, name: "Доктор наук (Sc.D)", weight: 1.5, type: "Высшая" },
    { id: 2, name: "Кандидат наук (PhD)", weight: 1.2, type: "Средняя" },
    { id: 3, name: "Магистр", weight: 1.0, type: "Начальная" },
  ]);

  // НОВЫЕ ДАННЫЕ: Должности
  const [positions] = useState([
    { id: 1, name: "Профессор", salary_rate: "1.8", category: "ППС" },
    { id: 2, name: "Ассоциированный профессор", salary_rate: "1.5", category: "ППС" },
    { id: 3, name: "Старший преподаватель", salary_rate: "1.2", category: "ППС" },
  ]);

  return (
    <main className="border rounded-lg mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Настройки системы</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Управление справочниками, должностями и весами KPI</p>
        </div>

        {/* Навигация по разделам */}
        <div className="flex flex-wrap bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'kpi', label: 'KPI', icon: Target },
            { id: 'faculties', label: 'Факультеты', icon: School },
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
              {activeSection === 'kpi' && 'Редактор баллов KPI'}
              {activeSection === 'faculties' && 'Структура университета'}
              {activeSection === 'degrees' && 'Академические степени'}
              {activeSection === 'positions' && 'Штатное расписание'}
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100">
              <Plus size={14} /> Добавить
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Наименование</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Значение / Код</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                
                {/* Рендерим KPI */}
                {activeSection === 'kpi' && kpiMetrics.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-black text-sm">+{item.points}</span>
                    </td>
                    <td className="px-6 py-4 text-right"><ActionButtons /></td>
                  </tr>
                ))}

                {/* Рендерим СТЕПЕНИ */}
                {activeSection === 'degrees' && degrees.map((deg) => (
                  <tr key={deg.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Award size={16}/></div>
                        <span className="text-sm font-bold text-slate-900">{deg.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">Множитель: {deg.weight}x</span>
                    </td>
                    <td className="px-6 py-4 text-right"><ActionButtons /></td>
                  </tr>
                ))}

                {/* Рендерим ДОЛЖНОСТИ */}
                {activeSection === 'positions' && positions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Briefcase size={16}/></div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{pos.name}</span>
                          <span className="text-[9px] text-indigo-400 font-bold uppercase">{pos.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">Коэфф: {pos.salary_rate}</span>
                    </td>
                    <td className="px-6 py-4 text-right"><ActionButtons /></td>
                  </tr>
                ))}

                {/* Рендерим ФАКУЛЬТЕТЫ (как в прошлом примере) */}
                {activeSection === 'faculties' && faculties.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg"><School size={16}/></div>
                        <span className="text-sm font-bold text-slate-900">{fac.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-black text-slate-500 tracking-widest">{fac.code}</td>
                    <td className="px-6 py-4 text-right"><ActionButtons /></td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl transition-colors group-hover:bg-blue-100/50"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 text-blue-600">
                <Settings2 size={18} />
                <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Автоматизация</h4>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Эти справочники используются для автоматического формирования профиля сотрудника. 
                Например, балл KPI может умножаться на коэффициент ученой степени.
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-[24px] shadow-xl shadow-slate-200">
             <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50">Быстрый отчет</h4>
             <div className="space-y-3">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                   <span className="text-[10px] text-white/70 uppercase">Всего должностей</span>
                   <span className="text-xl font-black text-white">{positions.length}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                   <span className="text-[10px] text-white/70 uppercase">Средний балл KPI</span>
                   <span className="text-xl font-black text-blue-400">35.0</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Вспомогательный компонент для кнопок действий
const ActionButtons = () => (
  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={14}/></button>
    <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={14}/></button>
  </div>
);

export default TaxonomySettings;