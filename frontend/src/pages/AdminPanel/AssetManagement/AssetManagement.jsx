import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Download, Eye, 
  FileCode, FileArchive, HardDrive, MoreVertical, 
  ExternalLink, CheckCircle2, AlertCircle, Trash2, 
  Clock, Tag
} from 'lucide-react';
import { Plus } from 'lucide-react';

const AssetManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фейковые данные активов (документов)
  const [assets] = useState([
    { 
      id: "AST-902", 
      name: "Scopus_Article_Final.pdf", 
      type: "article", 
      owner: "Елнур Зеинолла", 
      size: "2.4 MB", 
      date: "18.03.2026",
      status: "verified",
      kpi_link: "KPI-442"
    },
    { 
      id: "AST-899", 
      name: "Patent_Smart_City_Kz.jpg", 
      type: "patent", 
      owner: "Иван Иванов", 
      size: "5.1 MB", 
      date: "15.03.2026",
      status: "pending",
      kpi_link: "KPI-410"
    },
    { 
      id: "AST-850", 
      name: "WorldSkills_Certificate.pdf", 
      type: "certificate", 
      owner: "Сара Смирнова", 
      size: "1.1 MB", 
      date: "10.03.2026",
      status: "verified",
      kpi_link: "KPI-390"
    },
    { 
      id: "AST-812", 
      name: "Project_Source_Code.zip", 
      type: "archive", 
      owner: "Елнур Зеинолла", 
      size: "45.8 MB", 
      date: "05.03.2026",
      status: "warning",
      kpi_link: "KPI-205"
    }
  ]);

  const getFileIcon = (type) => {
    switch(type) {
      case 'article': return <FileText className="text-blue-500" size={20} />;
      case 'patent': return <CheckCircle2 className="text-amber-500" size={20} />;
      case 'archive': return <FileCode className="text-purple-500" size={20} />;
      default: return <FileText className="text-slate-400" size={20} />;
    }
  };

  return (
    <main className="border rounded-lg mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Репозиторий активов</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Централизованное хранилище документов и доказательной базы Uni-Assets</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                <HardDrive size={16} className="text-blue-600"/>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider underline decoration-blue-200 underline-offset-4">Использовано: 1.2 GB / 10 GB</span>
            </div>
        </div>
      </div>

      {/* QUICK STATS & FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="lg:col-span-3 flex flex-wrap items-center gap-3">
           <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Поиск файла по названию или владельцу..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider focus:ring-2 ring-blue-50 outline-none transition-all"
              />
           </div>
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {['all', 'article', 'patent', 'certificate'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {f === 'all' ? 'Все' : f === 'article' ? 'Статьи' : f === 'patent' ? 'Патенты' : 'Сертификаты'}
                </button>
              ))}
           </div>
        </div>
        <button className="bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
           <Download size={14}/> Скачать всё (ZIP)
        </button>
      </div>

      {/* ASSETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white rounded-[24px] border border-slate-200 p-5 group hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 relative">
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                {getFileIcon(asset.type)}
              </div>
              <button className="text-slate-300 hover:text-slate-600 p-1"><MoreVertical size={18}/></button>
            </div>

            <div className="space-y-1 mb-6">
              <h3 className="font-bold text-slate-900 text-sm truncate" title={asset.name}>{asset.name}</h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                <span>{asset.size}</span>
                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                <span>{asset.id}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Владелец</span>
                  <span className="text-xs font-bold text-slate-700">{asset.owner}</span>
               </div>
               <div className="flex gap-1">
                  <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Просмотр"><Eye size={16}/></button>
                  <button className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Скачать"><Download size={16}/></button>
               </div>
            </div>

            {/* Метка привязки к KPI */}
            <div className="absolute -top-2 -right-2 px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-1">
               <Tag size={10} className="text-blue-400"/> {asset.kpi_link}
            </div>
          </div>
        ))}

        {/* Плитка добавления нового актива (Placeholder) */}
        <div className="border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center p-8 hover:bg-slate-50 cursor-pointer transition-all group">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Plus size={24}/>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Загрузить новый</p>
        </div>
      </div>

      {/* FOOTER LEGEND */}
      <div className="mt-12 flex items-center gap-8 px-2">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Верифицировано</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ожидает проверки</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ошибка / Отказ</span>
         </div>
      </div>

    </main>
  );
};


export default AssetManagement;