import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Download, Eye, X,
  FileCode, MoreVertical, CheckCircle2, 
  Tag, Plus, LayoutGrid, List, Trash2,
  ChevronLeft, ChevronRight, HardDrive, 
  CheckSquare, Square, Share2, AlertCircle,
  ExternalLink, User, Calendar, Info
} from 'lucide-react';

const AssetManagement = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewAsset, setPreviewAsset] = useState(null); // Для модалки
  const itemsPerPage = 8;

  const [assets, setAssets] = useState(Array.from({ length: 35 }).map((_, i) => ({
    id: `AST-${900 - i}`,
    name: i % 3 === 0 ? "Research_Paper_2026.pdf" : i % 2 === 0 ? "Innovation_Patent.pdf" : "Source_Code_Backup.zip",
    type: i % 3 === 0 ? "article" : i % 2 === 0 ? "patent" : "archive",
    owner: i % 4 === 0 ? "Елнур Зеинолла" : "Айгерим Смаилова",
    size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
    date: `${23 - (i % 5)}.03.2026`,
    status: i % 7 === 0 ? "warning" : "verified",
    kpi_link: `KPI-${400 - i}`,
    isNew: i < 3
  })));

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesFilter = activeFilter === 'all' || asset.type === activeFilter;
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            asset.owner.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [assets, activeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Удалить выбранные объекты (${selectedIds.length})?`)) {
      setAssets(prev => prev.filter(a => !selectedIds.includes(a.id)));
      setSelectedIds([]);
    }
  };

  const getFileIcon = (type, size = 20) => {
    switch(type) {
      case 'article': return <FileText className="text-blue-500" size={size} />;
      case 'patent': return <CheckCircle2 className="text-amber-500" size={size} />;
      case 'archive': return <FileCode className="text-purple-500" size={size} />;
      default: return <FileText className="text-slate-400" size={size} />;
    }
  };

  return (
    <main className="mx-auto px-6 py-8 bg-[#f8fafc] min-h-screen font-sans text-left border rounded-2xl shadow-2xl relative">
      
      {/* 1. ВЕРХНЯЯ СТАТИСТИКА */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Хранилище', val: '1.2 GB / 10 GB', icon: HardDrive, color: 'blue', progress: 25 },
          { label: 'Верифицировано', val: assets.filter(a => a.status === 'verified').length, icon: CheckCircle2, color: 'emerald' },
          { label: 'Внимание', val: assets.filter(a => a.status === 'warning').length, icon: AlertCircle, color: 'amber' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center`}>
              <stat.icon size={24}/>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-sm font-bold text-slate-900">{stat.val}</p>
              {stat.progress && (
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${stat.progress}%` }}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. ПАНЕЛЬ МАССОВЫХ ДЕЙСТВИЙ (Animated) */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: 100, x: '-50%', opacity: 0 }}
            className="fixed bottom-8 left-1/2 z-50"
          >
            <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700">
              <span className="text-xs font-bold uppercase tracking-widest">Выбрано: {selectedIds.length}</span>
              <div className="flex gap-4 border-l border-slate-700 pl-6">
                <button className="flex items-center gap-2 hover:text-blue-400 transition-colors text-[10px] font-bold uppercase"><Download size={16}/> Скачать</button>
                <button onClick={handleDeleteSelected} className="flex items-center gap-2 hover:text-rose-400 transition-colors text-[10px] font-bold uppercase"><Trash2 size={16}/> Удалить</button>
              </div>
              <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-slate-800 rounded-full"><X size={16}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. ПОИСК И ФИЛЬТРЫ */}
      <div className="sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-md py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Поиск по названию или автору..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:ring-2 ring-blue-50 outline-none"
            />
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-slate-100 text-blue-600' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-slate-100 text-blue-600' : 'text-slate-400'}`}><List size={20}/></button>
          </div>
        </div>
      </div>

      {/* 4. СЕТКА / ТАБЛИЦА */}
      <div className="mt-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedAssets.map((asset) => (
              <motion.div 
                layout
                key={asset.id} 
                onClick={() => toggleSelect(asset.id)}
                className={`bg-white rounded-[24px] border p-5 group transition-all relative cursor-pointer
                  ${selectedIds.includes(asset.id) ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
              >
                <div className="flex justify-between mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                    {getFileIcon(asset.type)}
                  </div>
                  <button onClick={(e) => toggleSelect(asset.id, e)} className={selectedIds.includes(asset.id) ? 'text-blue-600' : 'text-slate-300'}>
                    {selectedIds.includes(asset.id) ? <CheckSquare size={20}/> : <Square size={20}/>}
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 text-sm truncate pr-6">{asset.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{asset.size} • {asset.id}</p>
                
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Владелец</span>
                    <span className="text-xs font-bold text-slate-700">{asset.owner}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPreviewAsset(asset); }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  ><Eye size={16}/></button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-12"></th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Файл</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Автор</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAssets.map((asset) => (
                  <tr key={asset.id} onClick={() => toggleSelect(asset.id)} className={`cursor-pointer ${selectedIds.includes(asset.id) ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      {selectedIds.includes(asset.id) ? <CheckSquare size={18} className="text-blue-600"/> : <Square size={18} className="text-slate-300"/>}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      {getFileIcon(asset.type, 18)}
                      <div>
                        <p className="text-sm font-bold text-slate-700">{asset.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{asset.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{asset.owner}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setPreviewAsset(asset); }} className="p-2 text-slate-400 hover:text-blue-600"><Eye size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. QUICK PREVIEW MODAL */}
      <AnimatePresence>
        {previewAsset && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewAsset(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                    {getFileIcon(previewAsset.type, 32)}
                  </div>
                  <button onClick={() => setPreviewAsset(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24}/></button>
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 mb-2">{previewAsset.name}</h2>
                <div className="flex gap-2 mb-8">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">{previewAsset.id}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase">{previewAsset.type}</span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><User size={12}/> Владелец</p>
                    <p className="text-sm font-bold text-slate-800">{previewAsset.owner}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12}/> Дата загрузки</p>
                    <p className="text-sm font-bold text-slate-800">{previewAsset.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><HardDrive size={12}/> Размер файла</p>
                    <p className="text-sm font-bold text-slate-800">{previewAsset.size}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Tag size={12}/> Связанный KPI</p>
                    <p className="text-sm font-bold text-blue-600 underline cursor-pointer">{previewAsset.kpi_link}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                    <Download size={18}/> Скачать файл
                  </button>
                  <button className="w-14 h-14 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50">
                    <ExternalLink size={20}/>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. ПАГИНАЦИЯ */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Стр. {currentPage} из {totalPages}</p>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border rounded-xl disabled:opacity-20 hover:bg-slate-50"><ChevronLeft/></button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border rounded-xl disabled:opacity-20 hover:bg-slate-50"><ChevronRight/></button>
        </div>
      </div>
    </main>
  );
};

export default AssetManagement;