import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Send, Bot, User, Sparkles, Trash2, ChevronLeft, 
  Paperclip, Loader2, Maximize2, Info, Circle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatAI = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: 'Привет, Эльнур! Я проанализировал твою активность в системе KPI Intelligence. Чем могу помочь?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
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

      setMessages(prev => [...prev, {
        role: 'model',
        text: response.data.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Произошла ошибка. Проверь квоты API или интернет-соединение.', 
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-8 font-sans selection:bg-blue-100">
      <main className="max-w-[1100px] mx-auto h-[85vh] flex flex-col bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
        
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-slate-50 hover:bg-white hover:shadow-sm rounded-2xl transition-all text-slate-500 border border-slate-100"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Bot size={24} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="text-left">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">KPI Intelligence AI</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Circle size={8} className="fill-emerald-500 text-emerald-500" /> Online
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Info size={20}/></button>
            <button onClick={() => setMessages([])} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* MESSAGES BODY */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-8 py-8 space-y-8 bg-gradient-to-b from-transparent to-slate-50/50"
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm font-bold ${
                  msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-blue-600 border border-slate-100'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                </div>
                <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`px-5 py-4 rounded-[24px] text-[14.5px] leading-[1.6] shadow-sm transition-all hover:shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mx-2">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin text-blue-600" />
                </div>
                <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-tl-none">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* INPUT FOOTER */}
        <div className="p-6 bg-white border-t border-slate-100">
          <form 
            onSubmit={handleSend}
            className="relative max-w-[900px] mx-auto group"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Paperclip size={20} />
              </button>
            </div>
            
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите о KPI, рейтинге или баллах..."
              className="w-full bg-slate-50 border border-slate-200 rounded-[20px] pl-14 pr-16 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
            />

            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-[14px] transition-all ${
                !input.trim() || isLoading 
                  ? 'bg-slate-200 text-slate-400' 
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-105 active:scale-95'
              }`}
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center gap-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Gemini 2.5 Flash Enhanced</p>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">University Smart System</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatAI;