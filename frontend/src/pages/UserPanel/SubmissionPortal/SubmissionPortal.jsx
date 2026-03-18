import React, { useState, useEffect } from 'react';
import { 
  FileUp, X, CheckCircle2, Info, ChevronDown, 
  PlusCircle, FileText, Loader2, Calendar as CalendarIcon, 
  Link as LinkIcon, AlertCircle, ArrowLeft, ShieldCheck,
  Zap, Eye, Trash2, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmissionPortal = () => {
  const navigate = useNavigate();
  const [indicators, setIndicators] = useState([]); // Список индикаторов из БД
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | success
  const [loadingIndicators, setLoadingIndicators] = useState(true);

  const [formData, setFormData] = useState({
    indicator_id: '',
    title: '',
    description: '',
    date: '',
    quantity: 1, // По умолчанию 1 единица активности
  });

  // 1. Загрузка списка индикаторов при старте
  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:8000/api/kpi-indicators', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const result = await response.json();
        if (result.status === 'success') setIndicators(result.data);
      } catch (error) {
        console.error("Ошибка загрузки индикаторов:", error);
      } finally {
        setLoadingIndicators(false);
      }
    };
    fetchIndicators();
  }, []);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const sizeLimit = 25 * 1024 * 1024;
  const sizePercentage = Math.min((totalSize / sizeLimit) * 100, 100);

  const handleFileAction = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(f => f.size <= 10 * 1024 * 1024);
    setFiles(prev => [...prev, ...validFiles]);
  };

  // 2. Отправка формы на Laravel
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Загрузите подтверждающие документы");

    setStatus('uploading');
    const token = localStorage.getItem("token");
    const data = new FormData();

    // Добавляем текстовые поля
    data.append('indicator_id', formData.indicator_id);
    data.append('title', formData.title);
    data.append('quantity', formData.quantity);
    data.append('date', formData.date);

    // Добавляем файлы
    files.forEach(file => data.append('files[]', file));

    try {
      const response = await fetch('http://localhost:8000/api/kpi-activities', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: data
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const err = await response.json();
        throw new Error(err.message || "Ошибка при загрузке");
      }
    } catch (error) {
      alert(error.message);
      setStatus('idle');
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
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Документы приняты</h2>
            <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Ваша заявка успешно отправлена. Вы получите уведомление после проверки модератором.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/archive')} className="p-4 rounded-2xl bg-gray-50 text-slate-600 font-bold text-sm hover:bg-gray-100 transition-all">В архив заявок</button>
            <button onClick={() => { setStatus('idle'); setFiles([]); }} className="p-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:shadow-lg transition-all">Новая запись</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">       
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Верификация достижений {new Date().getFullYear()} года</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-4 flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Основная информация
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Шаг 1 из 2</span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Тип индикатора</label>
                  <div className="relative">
                    <select 
                      required
                      value={formData.indicator_id}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:border-blue-500/20 focus:bg-white transition-all appearance-none outline-none cursor-pointer disabled:opacity-50"
                      onChange={(e) => setFormData({...formData, indicator_id: e.target.value})}
                      disabled={loadingIndicators}
                    >
                      <option value="">{loadingIndicators ? 'Загрузка...' : 'Выбрать индикатор...'}</option>
                      {indicators.map(item => (
                        <option key={item.id} value={item.id}>{item.title} ({item.points} б.)</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="group space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Дата реализации</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-5 py-4 text-sm font-bold outline-none focus:border-blue-500/20 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Полное наименование работы</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Например: Статья о применении ИИ в образовании..." 
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 text-sm font-medium outline-none focus:border-blue-500/20 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Dropzone */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Подтверждающие файлы</label>
                  <span className={`text-[10px] font-bold ${sizePercentage > 80 ? 'text-red-500' : 'text-slate-400'}`}>
                    { (totalSize / (1024*1024)).toFixed(1) } MB / 25 MB
                  </span>
                </div>
                
                <div 
                  onDragOver={(e) => {e.preventDefault(); setDragActive(true)}}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {e.preventDefault(); setDragActive(false); handleFileAction(e.dataTransfer.files)}}
                  className={`relative border-3 border-dashed rounded-[32px] p-10 transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 bg-slate-50/30'}`}
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-600"><FileUp size={32} /></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Перетащите файлы или <span className="text-blue-600 cursor-pointer">обзор</span></h4>
                      <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">PDF, JPG или PNG до 10МБ</p>
                    </div>
                  </div>
                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileAction(e.target.files)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><FileText size={18} /></div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-slate-700 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{(file.size/1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={status === 'uploading' || !formData.indicator_id}
            className="w-full bg-slate-900 hover:bg-black text-white p-6 rounded-[30px] font-bold text-sm transition-all flex items-center justify-center gap-4 disabled:bg-slate-400"
          >
            {status === 'uploading' ? <Loader2 className="animate-spin" size={20} /> : <>ОТПРАВИТЬ НА ВЕРИФИКАЦИЮ <PlusCircle size={20} /></>}
          </button>
        </form>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md"><ShieldCheck size={20} /></div>
                  <h3 className="font-bold text-sm uppercase tracking-widest">Безопасность</h3>
                </div>
                <p className="text-blue-100 text-xs leading-relaxed font-medium">Ваши данные зашифрованы и доступны только комиссии.</p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmissionPortal;