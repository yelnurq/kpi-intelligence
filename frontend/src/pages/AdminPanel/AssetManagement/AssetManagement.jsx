import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, Download, Eye, 
  FileCode, MoreVertical, CheckCircle2, 
  Tag, Plus, LayoutGrid, List, Trash2,
  ChevronLeft, ChevronRight, HardDrive, 
  CheckSquare, Square, Share2, AlertCircle
} from 'lucide-react';

const AssetManagement = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]); // Для массовых действий
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Данные (имитация расширенной БД)
  const [assets] = useState(Array.from({ length: 35 }).map((_, i) => ({
    id: `AST-${900 - i}`,
    name: i % 3 === 0 ? "Research_Paper_2026.pdf" : i % 2 === 0 ? "Innovation_Patent.pdf" : "Source_Code_Backup.zip",
    type: i % 3 === 0 ? "article" : i % 2 === 0 ? "patent" : "archive",
    owner: i % 4 === 0 ? "Елнур Зеинолла" : "Айгерим Смаилова",
    size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
    date: `${23 - (i % 5)}.03.2026`,
    status: i % 7 === 0 ? "warning" : "verified",
    kpi_link: `KPI-${400 - i}`,
    isNew: i < 3 // Помечаем первые 3 как новые
  })));

  // Фильтрация
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesFilter = activeFilter === 'all' || asset.type === activeFilter;
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            asset.owner.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [assets, activeFilter, searchQuery]);

  // Пагинация
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Обработка выбора
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedAssets.length) setSelectedIds([]);
    else setSelectedIds(paginatedAssets.map(a => a.id));
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'article': return <FileText className="text-blue-500" size={20} />;
      case 'patent': return <CheckCircle2 className="text-amber-500" size={20} />;
      case 'archive': return <FileCode className="text-purple-500" size={20} />;
      default: return <FileText className="text-slate-400" size={20} />;
    }
  };

  return (
    <main className="mx-auto px-6 py-8 bg-[#f8fafc] min-h-screen font-sans text-left border rounded-2xl shadow-2xl overflow-hidden">
      
      {/* 1. ВЕРХНЯЯ ПАНЕЛЬ СТАТИСТИКИ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><HardDrive size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Хранилище</p>
            <p className="text-sm font-bold text-slate-900">1.2 GB / 10 GB</p>
            <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
               <div className="w-1/4 h-full bg-blue-500"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Верифицировано</p>
            <p className="text-sm font-bold text-slate-900">{assets.filter(a => a.status === 'verified').length} файлов</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><AlertCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Требуют внимания</p>
            <p className="text-sm font-bold text-slate-900">{assets.filter(a => a.status === 'warning').length} объекта</p>
          </div>
        </div>
      </div>

      {/* 2. ПАНЕЛЬ ДЕЙСТВИЙ (МАССОВЫЕ ОПЕРАЦИИ) */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all transform ${selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700">
          <span className="text-xs font-bold uppercase tracking-widest">Выбрано: {selectedIds.length}</span>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors text-[10px] font-bold uppercase"><Download size={16}/> Скачать</button>
            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors text-[10px] font-bold uppercase"><Share2 size={16}/> Поделиться</button>
            <button className="flex items-center gap-2 hover:text-rose-400 transition-colors text-[10px] font-bold uppercase"><Trash2 size={16}/> Удалить</button>
          </div>
        </div>
      </div>

      {/* 3. ПОИСК И ФИЛЬТРЫ */}
      <div className="sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-md py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Быстрый поиск (название, владелец, ID)..."
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:ring-2 ring-blue-50 outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl border ${viewMode === 'grid' ? 'bg-white shadow-sm border-blue-200 text-blue-600' : 'bg-transparent border-transparent text-slate-400'}`}><LayoutGrid size={20}/></button>
            <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl border ${viewMode === 'list' ? 'bg-white shadow-sm border-blue-200 text-blue-600' : 'bg-transparent border-transparent text-slate-400'}`}><List size={20}/></button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
           {['all', 'article', 'patent', 'archive'].map((f) => (
              <button 
                key={f}
                onClick={() => {setActiveFilter(f); setCurrentPage(1);}}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all 
                  ${activeFilter === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
              >
                {f === 'all' ? 'Все файлы' : f === 'article' ? 'Статьи' : f === 'patent' ? 'Патенты' : 'Архивы'}
              </button>
            ))}
        </div>
      </div>

      {/* 4. ОСНОВНОЙ КОНТЕНТ */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {paginatedAssets.map((asset) => (
            <div 
              key={asset.id} 
              onClick={() => toggleSelect(asset.id)}
              className={`bg-white rounded-[24px] border p-5 group transition-all relative cursor-pointer
                ${selectedIds.includes(asset.id) ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 hover:border-blue-300 hover:shadow-xl'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors relative">
                  {getFileIcon(asset.type)}
                  {asset.isNew && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white animate-pulse"></span>}
                </div>
                <button 
                  onClick={(e) => {e.stopPropagation(); toggleSelect(asset.id);}}
                  className={`p-1 rounded-md transition-colors ${selectedIds.includes(asset.id) ? 'text-blue-600' : 'text-slate-300'}`}
                >
                  {selectedIds.includes(asset.id) ? <CheckSquare size={20}/> : <Square size={20}/>}
                </button>
              </div>
              <h3 className="font-bold text-slate-900 text-sm truncate mb-1 pr-4">{asset.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 tracking-tight">{asset.size} • {asset.id}</p>
              
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Владелец</span>
                  <span className="text-xs font-bold text-slate-700">{asset.owner}</span>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Eye size={16}/></button>
                </div>
              </div>

              {/* KPI Tag */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                 <div className="bg-slate-900 text-white px-2 py-1 rounded text-[8px] font-bold">{asset.kpi_link}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-blue-600">
                    {selectedIds.length === paginatedAssets.length ? <CheckSquare size={18}/> : <Square size={18}/>}
                  </button>
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Название</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Владелец</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedAssets.map((asset) => (
                <tr 
                  key={asset.id} 
                  onClick={() => toggleSelect(asset.id)}
                  className={`cursor-pointer transition-colors ${selectedIds.includes(asset.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-6 py-4 text-center">
                    {selectedIds.includes(asset.id) ? <CheckSquare size={18} className="text-blue-600 inline"/> : <Square size={18} className="text-slate-300 inline"/>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(asset.type)}
                      <div>
                        <p className="text-sm font-bold text-slate-700 leading-none">{asset.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{asset.id} • {asset.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{asset.owner}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Загружено: {asset.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600"><MoreVertical size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. ПАГИНАЦИЯ */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Показано {paginatedAssets.length} из {filteredAssets.length} объектов</p>
        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-all"
          ><ChevronLeft size={24}/></button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-all"
          ><ChevronRight size={24}/></button>
        </div>
      </div>
    </main>
  );
};

export default AssetManagement;