import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Send, Bot, User, Sparkles, 
  Trash2, MessageSquare, ChevronLeft, 
  MoreVertical, Paperclip, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatAI = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: 'Привет! Я твой AI-ассистент KPI Intelligence. Чем могу помочь сегодня?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Авто-скролл к последнему сообщению
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/chat/send', 
        { message: input },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const botMessage = {
        role: 'model',
        text: response.data.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Извини, произошла ошибка при соединении с сервером.', 
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (window.confirm('Очистить всю историю переписки?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8000/api/chat/reset', {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessages([{ 
          role: 'model', 
          text: 'История очищена. Готов к новым вопросам!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <main className="max-w-[1000px] mx-auto h-[calc(100vh-40px)] flex flex-col px-4 py-6 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white p-4 rounded-t-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-blue-200 shadow-lg">
              <Bot size={22} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">Gemini AI Assistant</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Система активна</span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-slate-400 group"
          title="Очистить чат"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* CHAT BODY */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${
                msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600 border border-blue-100'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className="space-y-1 text-left">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <p className={`text-[9px] font-bold uppercase tracking-tighter text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Анализирую KPI...</span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-4 rounded-b-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <button type="button" className="p-3 text-slate-400 hover:text-blue-600 transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Задайте вопрос по вашим KPI показателям..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all shadow-lg ${
              !input.trim() || isLoading 
                ? 'bg-slate-100 text-slate-400' 
                : 'bg-blue-600 text-white shadow-blue-200 hover:scale-105 active:scale-95'
            }`}
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[9px] text-slate-400 font-medium mt-3 uppercase tracking-[0.2em] text-center">
          Powered by Gemini 1.5 Flash • KPI Intelligence System
        </p>
      </div>
    </main>
  );
};

export default ChatAI;