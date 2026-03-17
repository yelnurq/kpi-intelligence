import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Settings, 
  CheckCircle2, 
  RefreshCcw,
  FileCheck,
  Share2,
  Printer,
  ChevronRight,
  PieChart as PieIcon,
  Layout,
  Trophy
} from 'lucide-react';

const ReportGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('full');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-3">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Генератор отчетов</h1>

          <p className="text-slate-500 text-sm font-medium">Сформируйте официальный документ на основе ваших KPI достижений за выбранный период.</p>
        </div>

        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
             <Share2 size={16} /> Поделиться
           </button>
           <button 
             onClick={handleGenerate}
             disabled={isGenerating}
             className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
           >
             {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <FileCheck size={18} />}
             {isGenerating ? 'Генерация...' : 'Сформировать PDF'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: SETTINGS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* STEP 1: TEMPLATE */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
              Тип документа
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'full', label: 'Полный годовой отчет', icon: <FileText /> },
                { id: 'short', label: 'Квартальная выписка', icon: <PieIcon /> },
                { id: 'science', label: 'Научная деятельность', icon: <Layout /> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setReportType(t.id)}
                  className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${
                    reportType === t.id 
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${reportType === t.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {React.cloneElement(t.icon, { size: 18 })}
                    </div>
                    <span className={`text-sm font-bold ${reportType === t.id ? 'text-slate-900' : 'text-slate-500'}`}>{t.label}</span>
                  </div>
                  {reportType === t.id && <CheckCircle2 size={18} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: FILTERS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              Настройки периода
            </h3>
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Академический год</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    <option>2025-2026</option>
                    <option>2024-2025</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-center block">Включить разделы</label>
                 <div className="space-y-2">
                    {['Научные публикации', 'Методическая работа', 'Общественные баллы'].map((label, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
                      </label>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW AREA */}
        <div className="lg:col-span-8">
           <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                Предварительный просмотр
              </h3>
              
              {/* DOCUMENT MOCKUP */}
              <div className="bg-slate-200 rounded-[40px] p-8 md:p-12 min-h-[700px] shadow-inner relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent rounded-[40px] pointer-events-none" />
                
                {/* THE PAGE */}
                <div className="bg-white w-full h-full min-h-[600px] rounded-lg shadow-2xl p-10 md:p-16 space-y-10 animate-in slide-in-from-bottom-4 duration-1000">
                  {/* Page Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
                    <div>
                       <img src="images/icons/logo.png" alt="logo" className="h-10 mb-4 opacity-50 grayscale" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Официальный отчет KPI</h4>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold uppercase text-slate-900 leading-none italic">ID: #RE-2026-991</p>
                       <p className="text-[10px] text-slate-400 mt-1 font-bold">Дата: 17.03.2026</p>
                    </div>
                  </div>

                  {/* Page Title */}
                  <div className="text-center py-6">
                    <h2 className="text-2xl font-serif font-bold text-slate-900">Индивидуальный отчет о достижениях</h2>
                    <p className="text-xs text-slate-500 mt-2">Преподаватель: <span className="font-bold text-slate-900">Zeynolla Elnur</span></p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 italic">Кафедра Информационных Технологий</p>
                  </div>

                  {/* Content Placeholder Blocks */}
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                        <span className="text-[11px] font-bold uppercase text-slate-900">1. Сводные показатели</span>
                        <span className="text-[10px] font-bold text-blue-600 italic">Итого: 350 баллов</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-20 bg-slate-50 rounded-lg border border-slate-100" />
                        <div className="h-20 bg-slate-50 rounded-lg border border-slate-100" />
                        <div className="h-20 bg-slate-50 rounded-lg border border-slate-100" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-1">
                        <span className="text-[11px] font-bold uppercase text-slate-900">2. Перечень подтвержденных активностей</span>
                      </div>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-4 items-start opacity-40">
                          <div className="w-10 h-1 bg-slate-100 mt-2" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-1/3 bg-slate-100 rounded" />
                            <div className="h-2 w-full bg-slate-50 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Page Footer */}
                  <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end opacity-20">
                    <div className="space-y-1">
                      <div className="w-32 h-px bg-slate-400 mb-2" />
                      <p className="text-[8px] font-bold uppercase">Подпись сотрудника</p>
                    </div>
                    <div className="w-20 h-20 border-4 border-slate-100 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-200 uppercase text-center p-2">
                       Печать организации
                    </div>
                  </div>
                </div>

                {/* OVERLAY ACTIONS ON HOVER */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all rounded-[40px]">
                   <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <button className="p-4 bg-white rounded-2xl text-slate-900 shadow-xl hover:scale-110 transition-transform">
                        <Printer size={24} />
                      </button>
                      <button className="p-4 bg-white rounded-2xl text-slate-900 shadow-xl hover:scale-110 transition-transform">
                        <Download size={24} />
                      </button>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER TIPS */}
      <div className="bg-slate-50 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
               <Trophy size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">Совет для рейтинга</p>
               <p className="text-xs text-slate-500 mt-1 font-medium">Отчеты в PDF формате с цифровой подписью обрабатываются системой <span className="text-blue-600 font-bold">на 40% быстрее</span>.</p>
            </div>
         </div>
         <button className="group flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-all">
           Инструкция по заполнению <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>

    </main>
  );
};

export default ReportGenerator;