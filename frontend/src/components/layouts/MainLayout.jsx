import React, { useState, useEffect, useRef } from 'react'; // Добавил useRef
import { 
  Link, 
  useLocation, 
  Outlet, 
  useNavigate 
} from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckCircle, 
  BarChart3, 
  LogOut,
  User as UserIcon,
  Bell,
  Search,
  Menu,
  Zap,
  X,
  PanelsTopLeftIcon,
  FileText,
  ChevronRight // Добавил иконку для красоты в поиске
} from 'lucide-react';

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для поиска
  const [showResults, setShowResults] = useState(false); // Показ результатов
  const searchRef = useRef(null); // Реф для закрытия поиска при клике вне его
  
  const location = useLocation(); 
  const navigate = useNavigate();

  // Закрытие поиска при клике вне области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!savedUser || !token) {
      navigate('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Личный кабинет' },
    { id: 'plan', path: '/plan', icon: <PanelsTopLeftIcon size={20} />, label: 'Планирование KPI' },
    { id: 'archive', path: '/archive', icon: <ClipboardList size={20} />, label: 'Архив заявок' },
    { id: 'submit', path: '/submit', icon: <CheckCircle size={20} />, label: 'Подать активность' },
    { id: 'rating', path: '/rating', icon: <BarChart3 size={20} />, label: 'Рейтинг факультетов' },
  ];

  // Фильтрация роутов на основе ввода
  const filteredRoutes = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowResults(false);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* SIDEBAR (оставил без изменений для краткости) */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 flex flex-col fixed h-full transition-all duration-300 z-50`}>
        <div className={`flex items-center border-b border-slate-50 h-20 transition-all duration-300 ${isSidebarOpen ? 'px-6 gap-3' : 'px-0 justify-center'}`}>
          <div className="w-11 h-11">
            <img src="images/icons/logo.png" alt="Logo" className="h-full w-full object-contain drop-shadow-sm" />
          </div>
          {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-slate-800">KAZ<span className="text-blue-600">UTB</span></span>}
        </div>

        <nav className="flex-1 p-3 space-y-2 mt-4 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.id} to={item.path} className={`w-full flex items-center rounded-2xl transition-all duration-300 group relative ${isSidebarOpen ? 'px-4 py-3.5 gap-4' : 'justify-center py-3.5'} ${isActive ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                {item.icon}
                {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-50 space-y-4">
          <button onClick={handleLogout} className={`w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all ${!isSidebarOpen && 'justify-center'}`}>
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-widest">Выйти</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div className="h-6 w-[1px] bg-slate-100 mx-2" />
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-[0.1em]">
              {menuItems.find(i => i.path === location.pathname)?.label || 'KPI System'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* SEARCH COMPONENT - РЕАЛИЗАЦИЯ */}
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 focus-within:border-blue-200 transition-all">
                <Search size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Поиск по разделам..." 
                  className="bg-transparent border-none text-xs font-bold focus:outline-none w-48"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                />
              </div>

              {/* Результаты поиска */}
              {showResults && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  {filteredRoutes.length > 0 ? (
                    <div className="py-2">
                      {filteredRoutes.map(route => (
                        <button
                          key={route.id}
                          onClick={() => handleSearchSelect(route.path)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                              {route.icon}
                            </span>
                            <span className="text-xs font-bold text-slate-700">{route.label}</span>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ничего не найдено</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="relative p-2 text-slate-400 hover:text-blue-600">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Ваш ранг</p>
                  <p className="text-sm font-bold text-blue-600 leading-none mt-1">ТОП-5%</p>
               </div>
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Zap size={18} fill="currentColor" />
               </div>
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-80px)] overflow-x-hidden p-6">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default MainLayout;