import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Download, Eye, X,
  FileCode, CheckCircle2, 
  LayoutGrid, List, Trash2,
  ChevronLeft, ChevronRight, HardDrive, 
  CheckSquare, Square, AlertCircle,
  User, Calendar, Loader2
} from 'lucide-react';

const API_URL = "http://localhost:8000/api";

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
      <div key={i} className="bg-white rounded-[24px] border border-slate-100 p-5 h-[220px]">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-6" />
        <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-50 rounded w-1/2" />
        <div className="mt-auto pt-10 flex justify-between">
          <div className="w-20 h-6 bg-slate-50 rounded-lg" />
          <div className="w-8 h-8 bg-slate-50 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewAsset, setPreviewAsset] = useState(null);
  const itemsPerPage = 8;

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formattedData = response.data.map(item => ({
        id: item.id,
        name: item.file_name || "Без названия",
        rawType: item.file_type?.toLowerCase(),
        type: mapFileType(item.file_type),
        owner: item.activity?.user?.name || "Система",
        size: item.file_size ? `${(item.file_size / 1024 / 1024).toFixed(2)} MB` : "---",
        date: new Date(item.created_at).toLocaleDateString('ru-RU'),
        status: "verified",
        url: item.file_url ? item.file_url.replace('http://localhost/', 'http://localhost:8000/') : null,
      }));

      setAssets(formattedData);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      // Искусственная задержка в 400мс, чтобы скелетон не "моргнул" слишком быстро
      setTimeout(() => setLoading(false), 400);
    }
  }, []);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const mapFileType = (ext) => {
    const e = ext?.toLowerCase();
    if (['pdf', 'doc', 'docx', 'txt'].includes(e)) return 'article';
    if (['zip', 'rar', '7z', 'tar'].includes(e)) return 'archive';
    if (['jpg', 'png', 'svg'].includes(e)) return 'image';
    return 'patent';
  };

  const getFileIcon = (type, size = 20) => {
    switch(type) {
      case 'article': return <FileText className="text-blue-500" size={size} />;
      case 'archive': return <FileCode className="text-purple-500" size={size} />;
      case 'patent': return <CheckCircle2 className="text-amber-500" size={size} />;
      default: return <FileText className="text-slate-400" size={size} />;
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Удалить ${selectedIds.length} файл(ов)?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/assets/${selectedIds.join(',')}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssets(prev => prev.filter(a => !selectedIds.includes(a.id)));
      setSelectedIds([]);
    } catch (error) {
      alert("Ошибка при удалении");
    }
  };

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

  return (
    <main className="border rounded-lg mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter mb-0">Хранилище данных</h1>
          <p className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium mb-0">Просмотр и модерация объектов хранения</p>
        </div>
      </div>


      {/* SEARCH & FILTERS */}
      <div className="mt-0 sticky top-0 z-40 bg-[#f8fafc]/90 backdrop-blur-md py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Поиск по названию или автору..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm focus:ring-2 ring-blue-100 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-blue-600' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 text-blue-600' : 'text-slate-400'}`}><List size={20}/></button>
          </div>
        </div>

      </div>

      {/* CONTENT AREA */}
      <div className="relative mt-8 min-h-[400px]">
        {/* Индикатор частичного обновления */}
        {loading && assets.length > 0 && (
          <div className="absolute inset-0 z-10 bg-slate-50/40 backdrop-blur-[1px] flex justify-center pt-20">
            <div className="bg-white h-fit px-6 py-3 rounded-full shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in zoom-in duration-200">
              <Loader2 className="animate-spin text-blue-600" size={18} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Синхронизация...</span>
            </div>
          </div>
        )}

        {/* Логика отображения: Скелетон или Данные */}
        {loading && assets.length === 0 ? (
          <SkeletonGrid />
        ) : filteredAssets.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedAssets.map((asset) => (
                <motion.div 
                  layout key={asset.id} onClick={() => toggleSelect(asset.id)}
                  className={`bg-white rounded-[24px] border p-5 group transition-all relative cursor-pointer
                    ${selectedIds.includes(asset.id) ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 hover:border-blue-300 shadow-sm'}`}
                >
                  <div className="flex justify-between mb-6">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                      {getFileIcon(asset.type)}
                    </div>
                    <button onClick={(e) => toggleSelect(asset.id, e)} className={selectedIds.includes(asset.id) ? 'text-blue-600' : 'text-slate-200 hover:text-slate-300'}>
                      {selectedIds.includes(asset.id) ? <CheckSquare size={22}/> : <Square size={22}/>}
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate pr-6 mb-1">{asset.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{asset.size} • ID:{asset.id}</p>
                  
                  <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Владелец</span>
                      <span className="text-xs font-bold text-slate-700 truncate block max-w-[120px]">{asset.owner}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setPreviewAsset(asset); }} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={18}/></button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-5 w-12 text-center"><Square size={16} className="text-slate-300 mx-auto"/></th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Название файла</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Автор</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Дата</th>
                    <th className="px-6 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedAssets.map((asset) => (
                    <tr key={asset.id} onClick={() => toggleSelect(asset.id)} className={`cursor-pointer transition-colors ${selectedIds.includes(asset.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                      <td className="px-6 py-5 text-center">
                        {selectedIds.includes(asset.id) ? <CheckSquare size={20} className="text-blue-600 mx-auto"/> : <Square size={20} className="text-slate-300 mx-auto"/>}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {getFileIcon(asset.type, 18)}
                          <span className="font-bold text-slate-700 truncate max-w-[200px]">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-600 font-bold text-xs">{asset.owner}</td>
                      <td className="px-6 py-5 text-slate-400 font-bold text-[10px] uppercase text-center">{asset.date}</td>
                      <td className="px-6 py-5 text-right">
                        <button onClick={(e) => { e.stopPropagation(); setPreviewAsset(asset); }} className="p-2 text-slate-400 hover:text-blue-600"><Eye size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="bg-white rounded-[32px] border border-slate-200 border-dashed p-24 text-center">
             <Search size={40} className="text-slate-200 mx-auto mb-6" />
             <h3 className="text-xl font-bold text-slate-900">Файлы не найдены</h3>
             <p className="text-sm text-slate-400 mt-2">Попробуйте изменить поисковый запрос или фильтры</p>
          </div>
        )}
      </div>

      {/* FLOATING ACTION BAR */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, x: '-50%', opacity: 0 }} animate={{ y: 0, x: '-50%', opacity: 1 }} exit={{ y: 100, x: '-50%', opacity: 0 }}
            className="fixed bottom-10 left-1/2 z-50 bg-slate-900 text-white px-8 py-5 rounded-[24px] shadow-2xl flex items-center gap-8 border border-slate-700 min-w-[400px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">{selectedIds.length}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Объектов выбрано</span>
            </div>
            <div className="flex gap-6 border-l border-slate-700 pl-8">
              <button onClick={handleDeleteSelected} className="flex items-center gap-2 hover:text-rose-400 transition-colors text-[10px] font-black uppercase tracking-widest"><Trash2 size={16}/> Удалить из базы</button>
            </div>
            <button onClick={() => setSelectedIds([])} className="ml-auto p-1.5 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"><X size={18}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK PREVIEW MODAL */}
      <AnimatePresence>
        {previewAsset && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewAsset(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden relative z-10 p-10 text-left" >
                <div className="flex justify-between items-start mb-8">
                  <div className="p-5 bg-blue-50 rounded-[24px] text-blue-600 shadow-sm">{getFileIcon(previewAsset.type, 32)}</div>
                  <button onClick={() => setPreviewAsset(null)} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={24}/></button>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight pr-6">{previewAsset.name}</h2>
                <div className="flex gap-2 mb-10">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Asset #{previewAsset.id}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">{previewAsset.rawType || 'binary'}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-10 p-6 bg-slate-50 rounded-3xl">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1"><User size={12}/> Владелец контента</p>
                    <p className="text-sm font-bold text-slate-800">{previewAsset.owner}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1"><Calendar size={12}/> Дата регистрации</p>
                    <p className="text-sm font-bold text-slate-800">{previewAsset.date}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a href={previewAsset.url} target="_blank" rel="noreferrer" className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                    <Download size={18}/> Просмотреть документ
                  </a>
                  <button onClick={() => setPreviewAsset(null)} className="w-full py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Закрыть окно</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAGINATION */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
        <div className="flex flex-col items-start">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Статистика выборки</p>
          <p className="text-xs font-bold text-slate-700 mt-1">Отображено {filteredAssets.length} объектов</p>
        </div>
        <div className="flex gap-3">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 border border-slate-200 rounded-2xl disabled:opacity-20 hover:bg-white hover:border-blue-500 transition-all shadow-sm"><ChevronLeft size={20}/></button>
          <div className="flex items-center px-6 bg-white border border-slate-200 rounded-2xl font-bold text-xs text-slate-600">
             {currentPage} / {totalPages || 1}
          </div>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 border border-slate-200 rounded-2xl disabled:opacity-20 hover:bg-white hover:border-blue-500 transition-all shadow-sm"><ChevronRight size={20}/></button>
        </div>
      </div>
    </main>
  );
};

export default AssetManagement;