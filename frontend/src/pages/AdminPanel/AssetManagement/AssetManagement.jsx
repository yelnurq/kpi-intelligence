import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Download, Eye, X,
  FileCode, MoreVertical, CheckCircle2, 
  Plus, LayoutGrid, List, Trash2,
  ChevronLeft, ChevronRight, HardDrive, 
  CheckSquare, Square, Share2, AlertCircle,
  ExternalLink, User, Calendar, Loader2
} from 'lucide-react';

const API_URL = "http://localhost:8000/api";

const AssetManagement = () => {
  // Состояния данных
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния интерфейса
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewAsset, setPreviewAsset] = useState(null);
  const itemsPerPage = 8;

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Преобразование данных БД в формат фронтенда
      const formattedData = response.data.map(item => ({
        id: item.id,
        name: item.file_name || "Без названия",
        rawType: item.file_type?.toLowerCase(),
        type: mapFileType(item.file_type),
        owner: item.activity?.user?.name || "Система",
        size: item.file_size ? `${(item.file_size / 1024 / 1024).toFixed(2)} MB` : "---",
        date: new Date(item.created_at).toLocaleDateString('ru-RU'),
        status: "verified", // Можно добавить логику проверки
        kpi_link: `KPI-${item.kpi_activity_id}`,
        url: item.file_url ? item.file_url.replace('http://localhost/', 'http://localhost:8000/') : null,
      }));

      setAssets(formattedData);
    } catch (error) {
      console.error("Ошибка загрузки активов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Хелпер: маппинг иконок по расширению
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

  // 2. Массовое удаление
  const handleDeleteSelected = async () => {
    if (!window.confirm(`Вы уверены, что хотите удалить ${selectedIds.length} файл(ов)?`)) return;
    
    try {
      const token = localStorage.getItem("token");
      // Отправляем ID через запятую или массивом
      await axios.delete(`${API_URL}/assets/${selectedIds.join(',')}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssets(prev => prev.filter(a => !selectedIds.includes(a.id)));
      setSelectedIds([]);
    } catch (error) {
      alert("Ошибка при удалении файлов");
    }
  };

  // 3. Фильтрация и поиск
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

  const toggleSelect = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (loading && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Загрузка хранилища...</p>
      </div>
    );
  }

  return (
    <main className="mx-auto px-6 py-8 bg-[#f8fafc] min-h-screen font-sans text-left border rounded-2xl shadow-2xl relative overflow-hidden">
      
      {/* СТАТИСТИКА */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><HardDrive size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Всего файлов</p>
            <p className="text-sm font-bold text-slate-900">{assets.length} объектов</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Верифицировано</p>
            <p className="text-sm font-bold text-slate-900">{assets.length} подписей</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><AlertCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Статус системы</p>
            <p className="text-sm font-bold text-slate-900">Активно</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, x: '-50%', opacity: 0 }} animate={{ y: 0, x: '-50%', opacity: 1 }} exit={{ y: 100, x: '-50%', opacity: 0 }}
            className="fixed bottom-8 left-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Выбрано: {selectedIds.length}</span>
            <div className="flex gap-4 border-l border-slate-700 pl-6">
              <button onClick={handleDeleteSelected} className="flex items-center gap-2 hover:text-rose-400 transition-colors text-[10px] font-bold uppercase"><Trash2 size={16}/> Удалить</button>
            </div>
            <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-slate-800 rounded-full"><X size={16}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ПОИСК И ФИЛЬТРЫ */}
      <div className="sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-md py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Поиск по названию или автору..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:ring-2 ring-blue-100 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-blue-600 shadow-inner' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 text-blue-600 shadow-inner' : 'text-slate-400'}`}><List size={20}/></button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
           {['all', 'article', 'archive', 'patent'].map((f) => (
              <button 
                key={f} onClick={() => {setActiveFilter(f); setCurrentPage(1);}}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all 
                  ${activeFilter === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
              >
                {f === 'all' ? 'Все' : f === 'article' ? 'Документы' : f === 'archive' ? 'Архивы' : 'Прочее'}
              </button>
            ))}
        </div>
      </div>

      {/* КОНТЕНТ */}
      <div className="mt-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedAssets.map((asset) => (
              <motion.div 
                layout key={asset.id} onClick={() => toggleSelect(asset.id)}
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
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{asset.size} • ID:{asset.id}</p>
                
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Автор</span>
                    <span className="text-xs font-bold text-slate-700">{asset.owner}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setPreviewAsset(asset); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={16}/></button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-12 text-center"><Square size={16} className="text-slate-300 mx-auto"/></th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Название файла</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Автор</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Дата</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedAssets.map((asset) => (
                  <tr key={asset.id} onClick={() => toggleSelect(asset.id)} className={`cursor-pointer transition-colors ${selectedIds.includes(asset.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4 text-center">
                      {selectedIds.includes(asset.id) ? <CheckSquare size={18} className="text-blue-600 mx-auto"/> : <Square size={18} className="text-slate-300 mx-auto"/>}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      {getFileIcon(asset.type, 18)}
                      <span className="font-bold text-slate-700">{asset.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{asset.owner}</td>
                    <td className="px-6 py-4 text-slate-400 font-bold text-[10px] uppercase">{asset.date}</td>
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

      {/* QUICK PREVIEW MODAL */}
      <AnimatePresence>
        {previewAsset && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewAsset(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden relative z-10 p-8" >
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">{getFileIcon(previewAsset.type, 32)}</div>
                  <button onClick={() => setPreviewAsset(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24}/></button>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{previewAsset.name}</h2>
                <div className="flex gap-2 mb-8">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">{previewAsset.id}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase">{previewAsset.rawType || 'file'}</span>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><User size={12}/> Владелец</p>
                    <p className="text-sm font-bold text-slate-800">{previewAsset.owner}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12}/> Дата</p>
                    <p className="text-sm font-bold text-slate-800">{previewAsset.date}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href={previewAsset.url} target="_blank" rel="noreferrer" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                    <Download size={18}/> Открыть / Скачать
                  </a>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ПАГИНАЦИЯ */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Всего {filteredAssets.length} объектов</p>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border rounded-xl disabled:opacity-20 hover:bg-slate-50 transition-colors"><ChevronLeft size={20}/></button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border rounded-xl disabled:opacity-20 hover:bg-slate-50 transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>
    </main>
  );
};

export default AssetManagement;