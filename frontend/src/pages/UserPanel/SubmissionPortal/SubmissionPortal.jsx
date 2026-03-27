import React, { useState, useEffect } from 'react';
import { 
  FileUp, CheckCircle2, FileText, Loader2, Calendar as CalendarIcon, 
  Trash2, Zap, ShieldCheck, ChevronDown, Plus, Minus, ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // Добавили useLocation
import axios from 'axios';

const StatCard = ({ icon: Icon, label, value, colorClass, description, isPrimary, unit = "баллов" }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all ${isPrimary ? 'ring-1 ring-blue-600/10' : ''}`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${isPrimary ? 'bg-blue-600' : 'bg-slate-200'}`} />
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{value}</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed text-left">
      {description}
    </p>
  </div>
);

const SubmissionPortal = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Хук для работы с URL
  
  const [indicators, setIndicators] = useState([]);
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle'); 
  const [loadingIndicators, setLoadingIndicators] = useState(true);

  const [formData, setFormData] = useState({
    indicator_id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    quantity: 1,
  });

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  // 1. Загрузка индикаторов и авто-выбор из URL
  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await axios.get(`${API_BASE}/user/kpi-indicators`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.status === 'success') {
          const fetchedIndicators = response.data.data;
          setIndicators(fetchedIndicators);

          // Пытаемся достать ID из параметров (?indicator_id=...)
          const params = new URLSearchParams(location.search);
          const idFromUrl = params.get('indicator_id');

          // Если ID есть в URL, устанавливаем его в форму
          if (idFromUrl) {
            setFormData(prev => ({ ...prev, indicator_id: idFromUrl }));
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoadingIndicators(false);
      }
    };
    fetchIndicators();
  }, [token, location.search]); // Следим за изменением URL параметров

  useEffect(() => {
    if (status === 'success') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [status]);

  const handleFileAction = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(f => f.size <= 10 * 1024 * 1024);
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Загрузите подтверждающие документы");
    setStatus('uploading');
    const data = new FormData();
    data.append('indicator_id', formData.indicator_id);
    data.append('title', formData.title);
    data.append('quantity', formData.quantity);
    data.append('date', formData.date);
    files.forEach(file => data.append('files[]', file));

    try {
      const response = await axios.post(`${API_BASE}/kpi-activities`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.status === 'success') setStatus('success');
    } catch (error) {
      alert(error.response?.data?.message || "Ошибка при отправке");
      setStatus('idle');
    }
  };

  const selectedIndicator = indicators.find(i => i.id === parseInt(formData.indicator_id));
  const indicatorWeight = selectedIndicator?.weight || selectedIndicator?.points || 0;
  const predictedPoints = indicatorWeight * formData.quantity;

  if (status === 'success') {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-[#f8fafc]/90 backdrop-blur-sm z-50 px-6">
        <div className="max-w-[440px] w-full bg-white border border-slate-200 rounded-[2.5rem] p-12 text-center shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto mb-8">
            <div className="relative w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Готово к проверке!</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed px-4">
            Достижение успешно отправлено. После одобрения модератором вам будет начислено:
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-10 flex items-center justify-center gap-3">
            <Zap size={20} className="text-amber-500 fill-amber-500" />
            <span className="text-3xl font-black text-slate-900">+{predictedPoints}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">баллов</span>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/archive')} 
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
            >
              Перейти в архив
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button 
              onClick={() => { 
                setStatus('idle'); 
                setFiles([]); 
                setFormData(prev => ({...prev, title: '', indicator_id: ''})); 
                navigate('/submit', { replace: true }); // Очищаем URL
              }} 
              className="w-full py-4 bg-white text-slate-500 hover:text-blue-600 font-bold text-sm transition-all"
            >
              Добавить еще одну активность
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:col-span-2 flex-1 space-y-8">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Верификация достижения</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Заполните данные для подтверждения выполнения KPI</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-3 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Выберите индикатор</label>
                  <div className="relative">
                    <select 
                      required
                      value={formData.indicator_id}
                      onChange={(e) => setFormData({...formData, indicator_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold focus:border-blue-500 focus:bg-white outline-none appearance-none transition-all cursor-pointer"
                    >
                      <option value="">{loadingIndicators ? 'Загрузка данных...' : 'Выберите KPI из вашего плана...'}</option>
                      {indicators.map(item => (
                        <option key={item.id} value={item.id}>{item.title} ({item.weight || item.points} б.)</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Количество</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setFormData(prev => ({...prev, quantity: Math.max(1, prev.quantity - 1)}))} className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all"><Minus size={18} /></button>
                    <input type="number" value={formData.quantity} readOnly className="flex-1 bg-white border border-slate-200 rounded-xl py-3 text-center text-sm font-black text-slate-900" />
                    <button type="button" onClick={() => setFormData(prev => ({...prev, quantity: prev.quantity + 1}))} className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-100"><Plus size={18} /></button>
                  </div>
                </div>
              </div>

              {/* Остальные поля без изменений */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-3 space-y-3 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Название выполненной работы</label>
                  <input 
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Напр: Опубликована статья в журнале..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Дата выполнения</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-5 py-4 text-sm font-bold outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Подтверждающие документы</label>
                <div 
                  onDragOver={(e) => {e.preventDefault(); setDragActive(true)}}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {e.preventDefault(); setDragActive(false); handleFileAction(e.dataTransfer.files)}}
                  className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center gap-3 text-center ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'}`}
                >
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-2">
                    <FileUp size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Перетащите файлы или нажмите для выбора</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PDF, PNG, JPG (Макс. 10MB)</p>
                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileAction(e.target.files)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                          <FileText size={16} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 truncate">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === 'uploading' || !formData.indicator_id || files.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-100 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none flex items-center justify-center gap-3 group"
              >
                {status === 'uploading' ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Отправить на модерацию <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:w-80 space-y-6">
          <StatCard 
            label="Прогноз" 
            value={predictedPoints > 0 ? `+${predictedPoints}` : '0'} 
            icon={Zap} 
            colorClass="bg-amber-100 text-amber-600" 
            description={`Формула: ${indicatorWeight} б. × ${formData.quantity} шт.`}
            isPrimary={true}
          />
          {/* Чек-лист без изменений */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-10">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" /> Чек-лист готовности
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Выбран показатель", check: !!formData.indicator_id },
                { label: "Описана работа", check: formData.title.length > 5 },
                { label: "Файлы загружены", check: files.length > 0 },
                { label: "Верная дата", check: !!formData.date }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-left">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${item.check ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 bg-slate-50 text-transparent'}`}>
                    <CheckCircle2 size={12} />
                  </div>
                  <span className={`text-[11px] font-bold ${item.check ? 'text-slate-700' : 'text-slate-300'}`}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmissionPortal;