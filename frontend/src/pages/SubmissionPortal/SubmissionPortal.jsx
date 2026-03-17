import React, { useState, useCallback } from 'react';
import { 
  FileUp, X, CheckCircle2, Info, ChevronDown, 
  PlusCircle, FileText, Loader2, Calendar as CalendarIcon, 
  Link as LinkIcon, AlertCircle, ArrowLeft, ShieldCheck,
  Zap, Eye, Trash2, Clock
} from 'lucide-react';

const SubmissionPortal = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | uploading | success
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    date: '',
    link: '',
    priority: false
  });

  // Расчет общего веса файлов (для UI индикатора)
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const sizeLimit = 25 * 1024 * 1024; // 25MB лимит
  const sizePercentage = Math.min((totalSize / sizeLimit) * 100, 100);

  const handleFileAction = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(f => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < newFiles.length) {
      alert("Некоторые файлы слишком большие (макс. 10МБ)");
    }
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('uploading');
    setTimeout(() => setStatus('success'), 2200);
  };

  // Динамические подсказки в зависимости от типа
  const getHelperText = () => {
    switch(formData.type) {
      case 'science': return "Прикрепите PDF статьи и скриншот из базы Scopus/WoS";
      case 'method': return "Необходима копия приказа или титульный лист пособия";
      case 'social': return "Фотоотчет или ссылка на публикацию в соцсетях";
      default: return "Загрузите документы, подтверждающие ваше участие";
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-1 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[40px] shadow-2xl">
        <div className="bg-white rounded-[38px] p-12 text-center space-y-8">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
             <div className="relative w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
               <CheckCircle2 size={48} strokeWidth={2.5} />
             </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Документы приняты</h2>
            <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              ID заявки: <span className="text-blue-600 font-mono">#KPI-2026-0842</span>. 
              Вы получите уведомление, когда модератор проверит данные.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setStatus('idle')} className="p-4 rounded-2xl bg-gray-50 text-slate-600 font-bold text-sm hover:bg-gray-100 transition-all">В архив заявок</button>
            <button onClick={() => setStatus('idle')} className="p-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:shadow-lg transition-all">Новая запись</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">       
      {/* TOP HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
         
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Верификация достижений и расчет KPI {new Date().getFullYear()} года</h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex -space-x-2">
             {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
           </div>
           <div className="pr-4 py-1 border-r border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Очередь</p>
             <p className="text-xs font-bold text-slate-700 leading-none">12 заявок</p>
           </div>
           <div className="pl-2">
             <Clock size={18} className="text-amber-500" />
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT: FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            {/* Form Steps Info */}
            <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-4 flex justify-between items-center">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Основная информация
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Шаг 1 из 2</span>
            </div>

            <div className="p-8 space-y-8">
              {/* Category Select */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Тип активности</label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:border-blue-500/20 focus:bg-white transition-all appearance-none outline-none cursor-pointer"
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="">Выбрать...</option>
                      <option value="science">Научная работа</option>
                      <option value="method">Методическое пособие</option>
                      <option value="social">Волонтерство / Соц. работа</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="group space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Дата реализации</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="date" className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-5 py-4 text-sm font-bold outline-none focus:border-blue-500/20 focus:bg-white transition-all" />
                  </div>
                </div>
              </div>

              {/* Title & Priority */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Полное наименование</label>
                  <input 
                    required
                    placeholder="Например: Разработка модуля авторизации на Laravel..." 
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 text-sm font-medium outline-none focus:border-blue-500/20 focus:bg-white transition-all shadow-sm"
                  />
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 transition-all hover:bg-amber-50">
                   <input 
                    type="checkbox" 
                    id="priority"
                    className="w-5 h-5 rounded-lg border-amber-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                   />
                   <label htmlFor="priority" className="text-xs font-bold text-amber-700 cursor-pointer">
                     Заявка требует срочного рассмотрения (Дедлайн KPI)
                   </label>
                </div>
              </div>

              {/* Enhanced File Dropzone */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Подтверждающие файлы</label>
                  <span className={`text-[10px] font-bold ${sizePercentage > 80 ? 'text-red-500' : 'text-slate-400'}`}>
                    { (totalSize / (1024*1024)).toFixed(1) } MB / 25 MB
                  </span>
                </div>
                
                <div 
                  onDragOver={(e) => {e.preventDefault(); setDragActive(true)}}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {e.preventDefault(); setDragActive(false); handleFileAction(e.dataTransfer.files)}}
                  className={`
                    relative border-3 border-dashed rounded-[32px] p-10 transition-all duration-300
                    ${dragActive ? 'border-blue-500 bg-blue-50/50 scale-[0.98]' : 'border-slate-100 bg-slate-50/30 hover:border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-600 group">
                      <FileUp size={32} className="group-hover:translate-y-[-2px] transition-transform" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-black text-slate-900 text-sm">Перетащите файлы или <span className="text-blue-600 cursor-pointer hover:underline">обзор</span></h4>
                      <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{getHelperText()}</p>
                    </div>
                  </div>
                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileAction(e.target.files)} />
                </div>

                {/* Animated Progress Bar for Storage */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${sizePercentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                    style={{width: `${sizePercentage}%`}}
                  />
                </div>

                {/* File Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <FileText size={18} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-black text-slate-700 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{(file.size/1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={status === 'uploading'}
            className="w-full bg-slate-900 hover:bg-black text-white p-6 rounded-[30px] font-black text-sm transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 group disabled:bg-slate-400"
          >
            {status === 'uploading' ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                ОТПРАВИТЬ НА ВЕРИФИКАЦИЮ
                <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* RIGHT: SIDEBAR */}
        <div className="lg:col-span-5 space-y-8">
          {/* SECURITY CARD */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <ShieldCheck size={120} />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-widest">Безопасность</h3>
                </div>
                <p className="text-blue-100 text-xs leading-relaxed font-medium">
                  Все загружаемые документы проходят автоматическую проверку на вирусы и хранятся в зашифрованном виде. Доступ к оригиналам есть только у аттестационной комиссии.
                </p>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-200 uppercase">Статус системы</span>
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase bg-green-400/20 text-green-300 px-3 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Защищено
                  </span>
                </div>
             </div>
          </div>

          {/* DYNAMIC HELP BOX */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">База знаний</h3>
             <div className="space-y-2">
                {[
                  { q: "Требования к формату", a: "PDF, JPG не более 10МБ" },
                  { q: "Сроки модерации", a: "Стандартно: 3-5 дней" },
                  { q: "Как оспорить отказ?", a: "Через раздел 'Апелляция'" }
                ].map((item, i) => (
                  <details key={i} className="group border-b border-slate-50 last:border-0 pb-2">
                    <summary className="list-none flex justify-between items-center py-3 cursor-pointer group-hover:text-blue-600 transition-colors">
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">{item.q}</span>
                      <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-slate-300" />
                    </summary>
                    <p className="text-[11px] text-slate-500 font-medium pb-3 px-1 leading-relaxed">{item.a}</p>
                  </details>
                ))}
             </div>
          </div>

          {/* LIVE PREVIEW CARD */}
          <div className="bg-slate-50 rounded-[40px] p-8 border border-dashed border-slate-200">
             <div className="flex items-center gap-3 mb-6">
                <Eye size={18} className="text-slate-400" />
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Предпросмотр записи</h3>
             </div>
             <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded-full w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded-full w-1/2 animate-pulse" />
                <div className="flex gap-2 pt-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse" />
                   <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse" />
                </div>
             </div>
             <p className="text-[10px] text-slate-400 font-bold mt-8 text-center uppercase tracking-tighter">
               Заполните форму, чтобы увидеть результат
             </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmissionPortal;