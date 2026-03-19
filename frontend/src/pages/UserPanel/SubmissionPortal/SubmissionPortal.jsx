import React, { useState, useEffect } from 'react';
import { 
  FileUp, CheckCircle2, Info, ChevronDown, 
  FileText, Loader2, Calendar as CalendarIcon, 
  Trash2, Zap, ShieldCheck, HelpCircle, ArrowRight
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
    quantity: 1,
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

  const selectedIndicator = indicators.find(i => i.id === parseInt(formData.indicator_id));
  const predictedPoints = selectedIndicator ? selectedIndicator.points * formData.quantity : 0;

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Отправлено на проверку</h2>
        <p className="text-slate-500 text-sm mb-8">Ваша активность успешно передана модератору.</p>
        <div className="space-y-3">
          <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">В личный кабинет</button>
          <button onClick={() => { setStatus('idle'); setFiles([]); }} className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition-all">Добавить еще</button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8"> 
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Верификация достижений</h1>
          <p className="text-slate-500 text-sm">Добавление подтверждающих документов в ваш KPI план</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ФОРМА */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8 space-y-7">
              {/* Показатель */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Индикатор из плана</label>
                <div className="relative">
                  <select 
                    required
                    value={formData.indicator_id}
                    onChange={(e) => setFormData({...formData, indicator_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:border-blue-500 focus:bg-white outline-none appearance-none transition-all"
                  >
                    <option value="">{loadingIndicators ? 'Загрузка показателей...' : 'Выберите индикатор...'}</option>
                    {indicators.map(item => (
                      <option key={item.id} value={item.id}>{item.title} ({item.points} б.)</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Дата и Количество */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Дата реализации</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="date" required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
              
              </div>

              {/* Заголовок */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Полное название работы</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Например: Публикация в журнале 'Наука и жизнь'..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Файлы */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Подтверждающие документы</label>
                <div 
                  onDragOver={(e) => {e.preventDefault(); setDragActive(true)}}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {e.preventDefault(); setDragActive(false); handleFileAction(e.dataTransfer.files)}}
                  className={`relative border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center gap-2 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'}`}
                >
                  <FileUp size={24} className="text-slate-400 mb-1" />
                  <p className="text-sm font-semibold text-slate-900">Загрузите файлы</p>
                  <p className="text-xs text-slate-400">Перетащите сюда или нажмите для выбора (PDF, JPG до 10MB)</p>
                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileAction(e.target.files)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText size={16} className="text-blue-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="p-1 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === 'uploading' || !formData.indicator_id || files.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 disabled:bg-slate-200 disabled:shadow-none flex items-center justify-center gap-3"
              >
                {status === 'uploading' ? <Loader2 className="animate-spin" size={20} /> : 'Отправить на верификацию'}
              </button>
            </div>
          </form>
        </div>

        {/* ПРАВАЯ ЧАСТЬ - ДЕТАЛИ */}
        <div className="space-y-6">
          {/* БАЛЛЫ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap size={14} className="text-orange-400 fill-orange-400" /> Прогноз баллов
            </h3>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black text-slate-900 tracking-tight">
                {predictedPoints > 0 ? `+${predictedPoints}` : '0'}
              </span>
              <span className="text-sm font-bold text-slate-400">баллов</span>
            </div>

            {selectedIndicator && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-blue-500 font-bold uppercase mb-1">Выбрано:</p>
                <p className="text-xs text-slate-600 font-semibold leading-tight">{selectedIndicator.title}</p>
              </div>
            )}
          </div>

          {/* ЧЕК-ЛИСТ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Чек-лист
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Показатель выбран", check: !!formData.indicator_id },
                { label: "Дата заполнена", check: !!formData.date },
                { label: "Документы прикреплены", check: files.length > 0 },
                { label: "Название указано", check: formData.title.length > 3 }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${item.check ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white'}`}>
                    {item.check && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <span className={`text-xs font-semibold ${item.check ? 'text-slate-700' : 'text-slate-300'}`}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ПОМОЩЬ */}
          <div className="flex items-center justify-between p-5 bg-slate-900 rounded-2xl group cursor-pointer hover:bg-blue-700 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/50">
                <HelpCircle size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Нужна помощь?</p>
                <p className="text-[10px] text-white/40 font-medium">Связаться с куратором</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-white/20 group-hover:text-white transition-all" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmissionPortal;