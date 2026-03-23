import React, { useState, useEffect } from 'react';
import { 
  Link, 
  useLocation, 
  Outlet, 
  navigate,
  useNavigate 
} from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Settings, 
  BarChart3, 
  LogOut,
  User as UserIcon,
  Bell,
  Search,
  Menu,
  X,
  Database,
  FileSearch
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation(); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // Проверка не только наличия данных, но и роли (isAdmin)
    if (!savedUser || !token) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(savedUser);
      // Если нужно жестко ограничить доступ:
      // if (parsedUser.role !== 'admin') navigate('/dashboard');
      setUser(parsedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // МЕНЮ ДЛЯ АДМИНИСТРАТОРА
  const adminMenuItems = [
    { id: 'audit', path: '/admin/audit', icon: <ShieldCheck size={20} />, label: 'Верификация KPI' },
    { id: 'users', path: '/admin/users', icon: <Users size={20} />, label: 'Пользователи' },
    { id: 'indicators', path: '/admin/indicators', icon: <Database size={20} />, label: 'Справочник KPI' },
    { id: 'analytics', path: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Общая аналитика' },
    { id: 'logs', path: '/admin/logs', icon: <FileSearch size={20} />, label: 'Логи системы' },
    { id: 'settings', path: '/admin/settings', icon: <Settings size={20} />, label: 'Настройки' },
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-20'} 
        bg-slate-900 border-r border-white/5 flex flex-col fixed h-full transition-all duration-300 z-50 shadow-2xl
      `}>
        <div className="p-6 flex items-center gap-3 h-20 border-b border-white/5 bg-slate-950/50">
          <div className="min-w-[45px] h-12 flex items-center justify-center">
            <img src="http://localhost:3000/images/icons/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col animate-in fade-in duration-500">
              <span className="font-black text-lg tracking-tighter text-white leading-none">
                KAZUTB <span className="text-blue-500">ADMIN</span>
              </span>
              <span className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.3em] mt-1">Management System</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1.5 mt-4 overflow-y-auto">
          {adminMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                
                {isActive && !isSidebarOpen && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ADMIN PROFILE */}
        <div className="p-4 mt-auto border-t border-white/5 space-y-4 bg-slate-950/30">
          <div className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${isSidebarOpen ? 'bg-white/5' : 'bg-transparent justify-center'}`}>
            <div className="min-w-[40px] h-10 bg-blue-600 rounded-full flex items-center justify-center text-white ring-2 ring-white/10 shadow-sm font-black text-xs">
              AD
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 text-left">
                <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">
                  {user.name}
                </p>
                <p className="text-[9px] text-blue-400 font-bold truncate uppercase tracking-widest">
                  Administrator
                </p>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all group ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Выйти из панели</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        
        {/* ADMIN HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Admin</span>
               <h1 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                 {adminMenuItems.find(i => i.path === location.pathname)?.label || 'Console'}
               </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200">
               <Search size={14} className="text-slate-400" />
               <input type="text" placeholder="Поиск по системе..." className="bg-transparent border-none text-[11px] font-bold focus:outline-none w-48 placeholder:text-slate-400" />
            </div>
          
          </div>
        </header>

        {/* ROUTE CONTENT */}
        <div className="min-h-[calc(100vh-80px)] p-8">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet /> 
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;