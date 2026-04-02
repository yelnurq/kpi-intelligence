import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Send, User, Sparkles, 
  X, Loader2, GraduationCap,
  MessageSquare, ChevronDown
} from 'lucide-react';

// --- КОМПОНЕНТ ДЛЯ ЭФФЕКТА ПЕЧАТИ ---
const TypingMessage = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 15); // Скорость печати (мс на символ). Можно поставить 10-20.

    return () => clearInterval(intervalId);
  }, [text]);

  return <p className="text-sm leading-relaxed">{displayedText}</p>;
};

const ChatAIWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: 'Здравствуйте! Я ваш ИИ-помощник KPI. Чем могу помочь?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTyping: false // Первое сообщение не печатаем
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Скролл вниз при изменении контента
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTyping: true // Включаем эффект печати для нового сообщения
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Ошибка связи. Попробуйте позже.', 
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* HEADER */}
          <div className="bg-indigo-900 p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-900">
                    <img src="images/icons/logo.png" alt="Logo" className="h-full w-full object-contain" />

              </div>
              <div>
                <h3 className="text-white text-xs font-bold uppercase tracking-wider text-left">KazUTB Assistant</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-indigo-200 font-medium">Online • AI</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* MESSAGES */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 shadow-inner">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none'
                }`}>
                  
                  {msg.role === 'model' && msg.isTyping ? (
                    <TypingMessage 
                      text={msg.text} 
                      onComplete={() => {
                        // После завершения печати можно убрать флаг, чтобы при скролле не перепечатывалось
                        const newMsgs = [...messages];
                        newMsgs[idx].isTyping = false;
                        setMessages(newMsgs);
                      }} 
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  )}

                  <p className={`text-[8px] mt-1 font-bold uppercase ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-indigo-600 font-bold text-[10px] uppercase pl-1">
                <Loader2 size={14} className="animate-spin" /> Формирую ответ...
              </div>
            )}
          </div>

          {/* INPUT */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите ваш вопрос..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-indigo-600 transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading} 
                className="absolute right-2 text-indigo-600 disabled:text-slate-300 p-1 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* КНОПКА ТРИГГЕР */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-800 rotate-90' : 'bg-indigo-900 shadow-indigo-200 hover:scale-110'} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 z-50`}
      >
        {isOpen ? <ChevronDown size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default ChatAIWidget;