import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Здесь будет ваша логика авторизации
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">
          <div className="min-w-[45px] h-20 flex items-center justify-center overflow-hidden">
            <img src="images/icons/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tighter text-slate-900">
            KAZ<span className="text-blue-400">UTB</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Система управления эффективностью</p>
        </div>

        {/* CARD */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-4 tracking-widest">Email адрес</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-300"
                  placeholder="name@kazutb.kz"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-4 tracking-widest">Пароль</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 group"
            >
              Войти в систему
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <a href="#" className="text-[10px] font-bold text-slate-400 uppercase hover:text-blue-600 transition-colors tracking-widest">
              Забыли пароль?
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-50">
          © 2026 KAZUTB — Department of IT
        </p>
      </div>
    </div>
  );
};

export default LoginPage;