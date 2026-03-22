import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Search,
  FileSpreadsheet,
  ChevronRight,
  Info,
  Loader2,
  Trophy,
  Target 
} from 'lucide-react';

// Скелетон для топовых карточек
const TopCardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <div className="h-2 w-24 bg-slate-100 rounded" />
        <div className="h-5 w-32 bg-slate-100 rounded" />
      </div>
      <div className="w-8 h-8 bg-slate-50 rounded-full" />
    </div>
    <div className="flex justify-between items-end">
      <div className="space-y-3">
        <div className="h-8 w-16 bg-slate-100 rounded" />
        <div className="h-2 w-20 bg-slate-100 rounded" />
      </div>
      <div className="h-3 w-10 bg-slate-50 rounded" />
    </div>
  </div>
);

const FacultyRanking = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalFund, setTotalFund] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/faculty-ranking', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await response.json();
        setFaculties(result.data.faculties);
        setTotalFund(result.data.total_fund);
        setLastUpdated(result.data.last_updated);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const filteredFaculties = faculties.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.short.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans"> 
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-left">Рейтинг эффективности факультетов</h1>
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium text-left">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-xs uppercase tracking-wider text-slate-400">Обновлено:</span>
              <span className="font-bold text-blue-700 text-xs">{loading ? '...' : lastUpdated}</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="italic text-slate-400">Сезон: 2025/2026</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs transition-all tracking-wider uppercase border bg-white text-slate-700 border-slate-200 shadow-sm hover:bg-slate-50">
            <FileSpreadsheet size={16} />
            <span>Экспорт XLSX</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-xs transition-all tracking-wider uppercase bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
            <BarChart3 size={16} />
            <span>Методология KPI</span>
          </button>
        </div>
      </div>

      {/* TOP ANALYTICS */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <TopCardSkeleton />
            <TopCardSkeleton />
            <TopCardSkeleton />
          </>
        ) : (
          faculties.slice(0, 3).map((f, i) => (
            <div key={f.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${i === 0 ? 'bg-blue-600' : 'bg-slate-200'}`} />
              <div className="flex justify-between items-start mb-4 text-left">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {i === 0 ? 'Текущий лидер' : `${i + 1} место в рейтинге`}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{f.short}</h3>
                </div>
                {i === 0 && <Trophy className="text-blue-600" size={24} />}
              </div>
              <div className="flex items-end justify-between">
                <div className="space-y-4 text-left">
                  <p className="text-2xl font-bold text-slate-900 tracking-tighter leading-none">{f.score.toLocaleString()}</p>
                  <div className="flex items-center gap-1.5">
                     <Target size={12} className="text-blue-500" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Средний: {f.students > 0 ? (f.score / f.students).toFixed(1) : '0.0'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold ${f.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {f.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {f.change}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MAIN DATA TABLE */}
      <div className="mt-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight">Сводная ведомость подразделений</h3>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по названию..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-400 transition-all text-left"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                <th className="px-6 py-4 font-bold">#</th>
                <th className="px-6 py-4 font-bold">Факультет</th>
                <th className="px-6 py-4 font-bold text-center">Актив / Штат</th>
                <th className="px-6 py-4 font-bold text-center text-blue-600 bg-blue-50/30">Средний KPI</th>
                <th className="px-6 py-4 font-bold">Эффективность</th>
                <th className="px-6 py-4 font-bold text-right">Баллы KPI</th>
                <th className="px-6 py-4 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-blue-500" size={32} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Синхронизация данных...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredFaculties.length > 0 ? (
                filteredFaculties.map((f, i) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-300 group-hover:text-blue-600 text-left block">
                        {i + 1 < 10 ? `0${i + 1}` : i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 leading-tight">{f.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{f.short}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-900">{f.active_staff ?? 0}</span>
                          <span className="text-[10px] text-slate-300 font-bold">/</span>
                          <span className="text-[10px] font-bold text-slate-400">{f.total_staff ?? 0}</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                          {f.total_staff > 0 ? Math.round((f.active_staff / f.total_staff) * 100) : 0}% участие
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50/10">
                      <span className="text-sm font-bold text-blue-700 tracking-tighter">
                        {f.students > 0 ? (f.score / f.students).toFixed(1) : '0.0'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 w-40">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${i === 0 ? 'bg-blue-600' : 'bg-slate-400'}`}
                            style={{ width: `${f.efficiency}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{f.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-slate-900">{f.score.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors rounded-lg hover:bg-white border border-transparent hover:border-slate-200">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-400 text-xs font-bold uppercase">Результаты не найдены</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER NOTIFICATION */}
      <div className="mt-5 bg-blue-50/50 p-6 rounded-xl border border-blue-100/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-4 text-left">
          <div className="p-2 bg-white rounded-lg border border-blue-100 shrink-0 self-start">
             <Info size={18} className="text-blue-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-blue-900 leading-none">Средневзвешенный показатель</p>
            <p className="text-[11px] text-blue-700 leading-relaxed max-w-2xl">
              <span className="font-bold uppercase tracking-tighter text-[10px] mr-1">Инфо:</span> 
              Средний KPI рассчитывается как отношение накопленных баллов к числу активных сотрудников. Это минимизирует влияние размера факультета на позицию в рейтинге.
            </p>
          </div>
        </div>
        <button className="whitespace-nowrap px-6 py-2.5 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-100 transition-all">
          Методика расчета
        </button>
      </div>

    </main>
  );
};

export default FacultyRanking;