import React, { useState, useEffect } from 'react';
import { 
  FileUp, CheckCircle2, FileText, Loader2, Calendar as CalendarIcon, 
  Trash2, Zap, ShieldCheck, HelpCircle, ArrowRight, ChevronDown, Plus, Minus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubmissionPortal = () => {
  const navigate = useNavigate();
  const [indicators, setIndicators] = useState([]);
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle'); 
  const [loadingIndicators, setLoadingIndicators] = useState(true);

  const [formData, setFormData] = useState({
    indicator_id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    quantity: 1, // По умолчанию 1
  });

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await axios.get(`${API_BASE}/user/kpi-indicators`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setIndicators(response.data.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки индикаторов:", error);
      } finally {
        setLoadingIndicators(false);
      }
    };
    fetchIndicators();
  }, [token]);

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
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.status === 'success') setStatus('success');
    } catch (error) {
      alert(error.response?.data?.message || "Ошибка при отправке");
      setStatus('idle');
    }
  };

  // Находим выбранный индикатор. В API теперь используем weight.
  const selectedIndicator = indicators.find(i => i.id === parseInt(formData.indicator_id));
  const indicatorWeight = selectedIndicator?.weight || selectedIndicator?.points || 0;
  const predictedPoints = indicatorWeight * formData.quantity;

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xl shadow-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Отправлено!</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Достижение добавлено. <br />После проверки модератором вам будет начислено <b>{predictedPoints} баллов</b>.
        </p>
        <div className="space-y-3">
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">Вернуться в кабинет</button>
          <button onClick={() => { setStatus('idle'); setFiles([]); setFormData({...formData, title: ''}); }} className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">Добавить еще</button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12"> 
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Верификация достижений</h1>
        <p className="text-slate-500 font-medium mt-1">Добавление подтверждающих документов в ваш KPI план</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
            <div className="p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Выбор индикатора */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Индикатор из плана</label>
                  <div className="relative">
                    <select 
                      required
                      value={formData.indicator_id}
                      onChange={(e) => setFormData({...formData, indicator_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-blue-600 focus:bg-white outline-none appearance-none transition-all cursor-pointer"
                    >
                      <option value="">{loadingIndicators ? 'Загрузка...' : 'Выберите индикатор...'}</option>
                      {indicators.map(item => (
                        <option key={item.id} value={item.id}>{item.title} ({item.weight || item.points} б.)</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Количество */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Количество (штук/часов)</label>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, quantity: Math.max(1, prev.quantity - 1)}))}
                      className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"
                    >
                      <Minus size={18} />
                    </button>
                    <input 
                      type="number" 
                      value={formData.quantity}
                      readOnly
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 text-center text-sm font-black text-slate-900"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, quantity: prev.quantity + 1}))}
                      className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-md shadow-slate-200"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Название и Дата */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Полное название работы</label>
                  <input 
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Например: Статья в Scopus, участие в конференции..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Дата</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold outline-none focus:border-blue-600 transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Загрузка файлов */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Подтверждающие документы</label>
                <div 
                  onDragOver={(e) => {e.preventDefault(); setDragActive(true)}}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {e.preventDefault(); setDragActive(false); handleFileAction(e.dataTransfer.files)}}
                  className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center gap-3 text-center ${dragActive ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'}`}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-2">
                    <FileUp size={28} />
                  </div>
                  <p className="text-sm font-black text-slate-900">Загрузите файлы подтверждения</p>
                  <p className="text-[11px] text-slate-400 font-medium">PDF, PNG или JPG до 10MB (минимум 1 файл)</p>
                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileAction(e.target.files)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                          <FileText size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === 'uploading' || !formData.indicator_id || files.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-100 disabled:bg-slate-200 disabled:shadow-none flex items-center justify-center gap-3 group"
              >
                {status === 'uploading' ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Отправить на верификацию <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-white">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap size={14} className="text-amber-400 fill-amber-400" /> Прогноз начисления
            </h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-6xl font-black tracking-tight text-white">
                {predictedPoints > 0 ? `+${predictedPoints}` : '0'}
              </span>
              <span className="text-sm font-bold text-slate-500 uppercase">баллов</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-amber-400 font-black uppercase mb-1">Формула:</p>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                {indicatorWeight} (балл индикатора) × {formData.quantity} (количество)
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-500" /> Готовность к отправке
            </h3>
            <ul className="space-y-5">
              {[
                { label: "Показатель выбран", check: !!formData.indicator_id },
                { label: "Название указано", check: formData.title.length > 3 },
                { label: "Документы загружены", check: files.length > 0 },
                { label: "Количество указано", check: formData.quantity >= 1 }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${item.check ? 'bg-green-500 border-green-500' : 'border-slate-100 bg-slate-50'}`}>
                    {item.check && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className={`text-xs font-bold ${item.check ? 'text-slate-800' : 'text-slate-300'}`}>{item.label}</span>
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