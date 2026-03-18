import React, { useState, useEffect } from 'react';
import { 
  FileUp, X, CheckCircle2, Info, ChevronDown, 
  PlusCircle, FileText, Loader2, Calendar as CalendarIcon, 
  Link as LinkIcon, AlertCircle, ArrowLeft, ShieldCheck,
  Zap, Eye, Trash2, Clock, HelpCircle
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

<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start">
  <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 sticky top-8 self-start z-10">
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

        <div className="lg:col-span-5 space-y-6">
  {/* 1. ДИНАМИЧЕСКИЙ ПРЕДПРОСМОТР БАЛЛОВ */}
  <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 relative overflow-hidden group">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors"></div>
    
    <div className="relative z-10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Zap size={20} fill="currentColor" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Прогноз баллов</h3>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <span className="text-6xl font-black text-slate-900 tracking-tighter">
            {formData.indicator_id 
              ? `+${indicators.find(i => i.id == formData.indicator_id)?.points || 0}`
              : '0'
            }
          </span>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">баллов</span>
        </div>
        <p className="text-xs text-slate-500 font-medium">Будет начислено после верификации</p>
      </div>

      {formData.indicator_id && (
        <div className="pt-6 border-t border-slate-50">
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-3 rounded-2xl">
            <Info size={16} />
            <span className="text-[11px] font-bold uppercase tracking-tight">Выбран: {indicators.find(i => i.id == formData.indicator_id)?.title}</span>
          </div>
        </div>
      )}
    </div>
  </div>

<div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 relative overflow-hidden group">
  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-50 transition-colors duration-500"></div>
  
  <div className="relative z-10 space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
        <ShieldCheck size={20} className="text-blue-500" />
      </div>
      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Памятка верификации</h3>
    </div>

    <ul className="space-y-4">
      {[
        { text: "Файлы четко читаемы (скан или фото)", done: files.length > 0 },
        { text: "Указана верная дата публикации/участия", done: formData.date !== "" },
        { text: "Название совпадает с документом", done: formData.title.length > 10 },
        { text: "Размер вложений не превышает 25 МБ", done: totalSize < sizeLimit && totalSize > 0 }
      ].map((item, i) => (
        <li key={i} className={`flex items-start gap-3 transition-all duration-300 ${item.done ? 'opacity-100 scale-[1.02]' : 'opacity-40'}`}>
          <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${item.done ? 'bg-blue-500 border-blue-500 shadow-md shadow-blue-100' : 'border-slate-200'}`}>
            {item.done ? (
              <CheckCircle2 size={12} className="text-white" />
            ) : (
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
            )}
          </div>
          <span className={`text-[12px] font-bold leading-tight ${item.done ? 'text-slate-800' : 'text-slate-400'}`}>
            {item.text}
          </span>
        </li>
      ))}
    </ul>

    {/* Блок с важной информацией */}
    <div className="p-5 bg-blue-50/50 rounded-[24px] border border-blue-100/50 space-y-2">
      <div className="flex items-center gap-2">
        <Info size={14} className="text-blue-500" />
        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Важно знать</p>
      </div>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
        Срок проверки заявки составляет от <span className="text-slate-900 font-bold">3 до 5 рабочих дней</span> модераторами вашего департамента.
      </p>
    </div>
  </div>
</div>

  {/* 3. ПОДДЕРЖКА */}
  <div className="bg-red rounded-[32px] border border-slate-100 p-6 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
            <HelpCircle size={24} />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-900">Возникли вопросы?</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Связаться с техподдержкой</p>
        </div>
    </div>
    <ArrowLeft size={18} className="rotate-180 text-slate-300 group-hover:text-blue-600 transition-all" />
  </div>
        </div>
      </div>
    </main>
  );
};

export default SubmissionPortal;