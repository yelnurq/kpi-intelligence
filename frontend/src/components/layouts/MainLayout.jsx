import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation(); 
  const navigate = useNavigate();

  // 1. Загрузка данных пользователя при монтировании
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!savedUser || !token) {
      // Если данных нет, отправляем на логин
      navigate('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  // 2. Функция выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Дашборд' },
    { id: 'plan', path: '/plan', icon: <PanelsTopLeftIcon size={20} />, label: 'Планирование KPI' },
    { id: 'archive', path: '/archive', icon: <ClipboardList size={20} />, label: 'Архив заявок' },
    { id: 'submit', path: '/submit', icon: <CheckCircle size={20} />, label: 'Подать активность' },
    { id: 'rating', path: '/rating', icon: <BarChart3 size={20} />, label: 'Рейтинг факультетов' },
    { id: 'report', path: '/report', icon: <FileText size={20} />, label: 'Генератор отчетов' },
  ];

  // Если данные пользователя еще не загрузились, показываем пустой экран или лоадер
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      <aside className={`
  ${isSidebarOpen ? 'w-72' : 'w-20'} 
  bg-white border-r border-slate-200 flex flex-col fixed h-full transition-all duration-300 z-50
`}>
  {/* LOGO AREA - Исправлено здесь */}
  <div className={`
    flex items-center border-b border-slate-50 h-20 transition-all duration-300
    ${isSidebarOpen ? 'px-6 gap-3' : 'px-0 justify-center'}
  `}>
    <div className={`
      flex items-center justify-center transition-all duration-300
      ${isSidebarOpen ? 'w-11 h-11' : 'w-11 h-11'} 
    `}>
      <img 
        src="images/icons/logo.png" 
        alt="Logo" 
        className="h-full w-full object-contain drop-shadow-sm" 
      />
    </div>
    
    {isSidebarOpen && (
      <span className="font-black text-xl tracking-tighter text-slate-800 animate-in fade-in slide-in-from-left-4 duration-500 whitespace-nowrap">
        KAZ<span className="text-blue-600">UTB</span>
      </span>
    )}
  </div>

<nav className="flex-1 p-3 space-y-2 mt-4 overflow-y-auto overflow-x-hidden">
  {menuItems.map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.id}
        to={item.path}
        className={`
          w-full flex items-center rounded-2xl transition-all duration-300 group relative
          ${isSidebarOpen ? 'px-4 py-3.5 gap-4' : 'justify-center py-3.5'}
          ${isActive 
            ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
        `}
      >
        {/* ИКОНКА */}
        <span className={`
          flex items-center justify-center transition-transform duration-300
          ${isActive ? 'scale-110' : 'group-hover:scale-110'}
          ${!isSidebarOpen ? 'min-w-[20px]' : ''}
        `}>
          {item.icon}
        </span>

        {/* ТЕКСТ (Появляется плавно) */}
        {isSidebarOpen && (
          <span className="font-bold text-sm tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
            {item.label}
          </span>
        )}
        
        {/* ИНДИКАТОР АКТИВНОСТИ (Когда сайдбар закрыт) */}
        {isActive && !isSidebarOpen && (
          <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full animate-in fade-in duration-500" />
        )}
      </Link>
    );
  })}
</nav>

        {/* PROFILE SECTION */}
        <div className="p-4 mt-auto border-t border-slate-50 space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${isSidebarOpen ? 'bg-slate-50' : 'bg-transparent justify-center'}`}>
            <div className="min-w-[40px] h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 ring-2 ring-white shadow-sm">
              <UserIcon size={20} />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 text-left">
                {/* Динамическое имя из localStorage (Zeynolla Elnur) */}
                <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tighter">
                  {user.name}
                </p>
                {/* Динамическая позиция/роль (Fullstack Dev) */}
                <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-widest">
                  {user.position || 'Сотрудник IT'}
                </p>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all group ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-widest">Выйти</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div className="h-6 w-[1px] bg-slate-100 mx-2" />
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-[0.1em]">
              {menuItems.find(i => i.path === location.pathname)?.label || 'KPI System'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
               <Search size={16} className="text-slate-400" />
               <input type="text" placeholder="Поиск..." className="bg-transparent border-none text-xs font-bold focus:outline-none w-32" />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
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

        {/* ROUTE CONTENT */}
        <div className="min-h-[calc(100vh-80px)] overflow-x-hidden p-6">
          <Outlet /> 
        </div>

      </main>
    </div>
  );
};

export default MainLayout;