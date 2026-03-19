import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, Clock, Search, Filter, 
  MessageSquare, History, User, FileText, 
  ArrowRight, Shield, Download, Eye, ExternalLink
} from 'lucide-react';

const VerificationAudit = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'history', 'logs'
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // --- ФЕЙКОВЫЕ ДАННЫЕ: ОЧЕРЕДЬ МОДЕРАЦИИ ---
  const pendingRequests = [
    { id: 1, user: "Др. Арман Искаков", role: "Профессор", category: "Наука", item: "Публикация Scopus Q1", points: 150, date: "14.03.2026, 10:45", attachment: "article_scopus.pdf" },
    { id: 2, user: "Индира Макарова", role: "Старший преп.", category: "Метод.раб", item: "Учебное пособие (изд. КазНУ)", points: 80, date: "14.03.2026, 09:12", attachment: "posobie_final.docx" },
    { id: 3, user: "Сергей Иванов", role: "Доцент", category: "Восп.раб", item: "Организация олимпиады", points: 40, date: "13.03.2026, 16:30", attachment: "prikaz_olymp.jpg" },
  ];

  // --- ФЕЙКОВЫЕ ДАННЫЕ: ЖУРНАЛ АУДИТА (LOGS) ---
  const auditLogs = [
    { id: 101, action: "UPDATE", user: "Admin_Olga", target: "Индикатор #45 (Статьи)", time: "15 мин. назад", color: "text-blue-600" },
    { id: 102, action: "DELETE", user: "Admin_Olga", target: "План пользователя #88", time: "1 час назад", color: "text-red-500" },
    { id: 103, action: "APPROVE", user: "System_Bot", target: "Авто-подтверждение стажа", time: "3 часа назад", color: "text-emerald-500" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-blue-600" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Контроль качества данных</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Верификация и Аудит</h1>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === 'pending' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-slate-700'}`}
          >
            Очередь ({pendingRequests.length})
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === 'logs' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-slate-700'}`}
          >
            Журнал действий
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeTab === 'pending' ? (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div key={req.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:border-blue-200 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <User size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{req.user}</h3>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">{req.role}</span>
                        </div>
                        <p className="text-sm font-bold text-blue-600 mt-1">{req.item}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          <span className="flex items-center gap-1"><Clock size={12}/> {req.date}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full" />
                          <span className="flex items-center gap-1 text-emerald-600"><FileText size={12}/> {req.attachment}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right mb-2">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">{req.points}</span>
                        <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">баллов</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                           onClick={() => { setSelectedRequest(req); setShowCommentModal(true); }}
                           className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                           title="Отклонить"
                        >
                          <XCircle size={18} />
                        </button>
                        <button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Одобрить">
                          <CheckCircle size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* AUDIT LOGS VIEW */
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                   <History size={16} /> Последние изменения в системе
                 </h3>
                 <button className="p-2 text-gray-400 hover:text-blue-600"><Download size={18}/></button>
              </div>
              <div className="divide-y divide-gray-50">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`text-[10px] font-black w-16 py-1 rounded-md text-center border ${log.color.replace('text', 'border').replace('600', '200').replace('500', '200')} ${log.color}`}>
                        {log.action}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">Пользователь <span className="text-slate-900 underline">{log.user}</span> изменил {log.target}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{log.time}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-300 hover:text-slate-600"><Eye size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SUMMARY & TOOLS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Статистика модерации</p>
                <div className="mt-8 space-y-6">
                   <div className="flex justify-between items-end">
                      <span className="text-xs text-slate-400 font-bold uppercase">Одобрено сегодня</span>
                      <span className="text-2xl font-bold">128</span>
                   </div>
                   <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[75%] shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-xs text-slate-400 font-bold uppercase">В очереди</span>
                      <span className="text-2xl font-bold text-orange-400">12</span>
                   </div>
                </div>
                <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                  Сформировать отчет по аудиту
                </button>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-10">
                <Shield size={180} />
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Быстрые действия</h4>
            <div className="space-y-3">
               <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-gray-100 transition-all text-left group">
                  <span className="text-xs font-bold text-slate-700">Массовое подтверждение</span>
                  <ArrowRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
               </button>
               <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-gray-100 transition-all text-left group">
                  <span className="text-xs font-bold text-slate-700">Настройки уведомлений</span>
                  <ArrowRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: REJECTION COMMENT */}
      {showCommentModal && (
        <div className="mt-0 fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-slate-900">Причина отказа</h3>
                <button onClick={() => setShowCommentModal(false)} className="text-gray-400 hover:text-slate-600"><XCircle size={24}/></button>
              </div>
              <p className="text-sm text-gray-500 mb-4 font-medium">Для {selectedRequest?.user}: {selectedRequest?.item}</p>
              <textarea 
                className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 ring-blue-50 focus:outline-none resize-none"
                placeholder="Напишите, что именно нужно исправить (например: Нечеткий скан или отсутствует печать)..."
              />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCommentModal(false)} className="flex-1 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-slate-600">Отмена</button>
                <button className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-600 transition-all">Отправить и отказать</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default VerificationAudit;