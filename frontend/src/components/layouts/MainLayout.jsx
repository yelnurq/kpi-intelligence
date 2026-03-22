import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Bell, Search, Menu, Zap, X, ChevronRight, Phone } from 'lucide-react';
// Импортируем данные
import allSearchItems, { sidebarMenuItems } from './menu';

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  
  const location = useLocation(); 
  const navigate = useNavigate();

  // Закрытие поиска при клике вне
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) navigate('/login');
    else setUser(JSON.parse(savedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Логика фильтрации поиска
  const filteredResults = allSearchItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 flex flex-col fixed h-full transition-all duration-300 z-50`}>
        <div className={`flex items-center border-b border-slate-50 h-20 transition-all duration-300 ${isSidebarOpen ? 'px-6 gap-3' : 'px-0 justify-center'}`}>
          <div className="w-11 h-11"><img src="images/icons/logo.png" alt="Logo" className="h-full w-full object-contain" /></div>
          {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-slate-800 uppercase">KAZ<span className="text-blue-600">UTB</span></span>}
        </div>

        <nav className="flex-1 p-3 space-y-2 mt-4 overflow-y-auto">
          {sidebarMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.id} to={item.path} className={`w-full flex items-center rounded-2xl transition-all duration-300 ${isSidebarOpen ? 'px-4 py-3.5 gap-4' : 'justify-center py-3.5'} ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                {item.icon}
                {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-50">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest">
            <LogOut size={20} />
            {isSidebarOpen && <span>Выйти</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
            </button>
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {sidebarMenuItems.find(i => i.path === location.pathname)?.label || 'Система'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* SEARCH COMPONENT */}
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                <Search size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Поиск по системе..." 
                  className="bg-transparent border-none text-xs font-bold focus:outline-none w-48"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                  onFocus={() => setShowResults(true)}
                />
              </div>

              {showResults && searchQuery && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="max-h-96 overflow-y-auto p-2">
                    {filteredResults.length > 0 ? (
                      filteredResults.map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.type === 'route') { navigate(item.path); setShowResults(false); setSearchQuery(''); }
                          }}
                          className="w-full flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group text-left"
                        >
                          <div className={`p-2 rounded-lg ${item.type === 'route' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-700">{item.label}</p>
                            {item.type === 'department' ? (
                              <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-tight">
                                {item.room} • Тел: {item.phone}
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-400 mt-1 uppercase">Перейти в раздел</p>
                            )}
                          </div>
                          {item.type === 'route' && <ChevronRight size={14} className="text-slate-300 mt-1" />}
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase">Ничего не найдено</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors"><Bell size={22} /></button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100 text-right">
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Ваш ранг</p>
                  <p className="text-sm font-bold text-blue-600 leading-none mt-1">ТОП-5%</p>
                </div>
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg"><Zap size={18} fill="currentColor" /></div>
            </div>
          </div>
        </header>

        <div className="p-6 overflow-x-hidden"><Outlet /></div>
      </main>
    </div>
  );
};

export default MainLayout;