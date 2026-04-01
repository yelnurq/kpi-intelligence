import React, { useState, useEffect } from 'react';
import { 
  Link, 
  useLocation, 
  Outlet, 
  useNavigate 
} from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Settings, 
  LogOut,
  FileSearch,
  School2Icon,
  CopyCheckIcon,
  MonitorDotIcon,
  Menu,
  X,
  Logs,
  Users2,
  LayoutDashboard
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation(); 
  const navigate = useNavigate();

  // 1. Определение всех пунктов меню с привязкой к ролям
  const allMenuItems = [
    { id: 'dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Дэшборд', roles: ['super_admin', 'dean', 'head_of_dept'] },
    { id: 'dean', path: '/admin/dean', icon: <CopyCheckIcon size={20} />, label: 'Утверждение планов', roles: ['super_admin', 'dean', 'head_of_dept'] },
    { id: 'monitor', path: '/admin/monitor', icon: <MonitorDotIcon size={20} />, label: 'Мониторинг дедлайнов', roles: ['super_admin', 'dean', 'head_of_dept'] },
    { id: 'audit', path: '/admin/audit', icon: <ShieldCheck size={20} />, label: 'Верификация KPI', roles: ['super_admin', 'academic_office'] },
    { id: 'users', path: '/admin/users', icon: <Users size={20} />, label: 'Пользователи', roles: ['super_admin', 'academic_office','dean', 'head_of_dept'] },
    { id: 'ldap', path: '/admin/users/ldap', icon: <Users2 size={20} />, label: 'LDAP Пользователи', roles: ['super_admin'] },
    { id: 'assets', path: '/admin/assets', icon: <FileSearch size={20} />, label: 'Репозиторий', roles: ['super_admin', 'academic_office'] },
    { id: 'logs', path: '/admin/logs', icon: <Logs size={20} />, label: 'Логи', roles: ['super_admin'] },
    { id: 'faculties', path: '/admin/faculties', icon: <School2Icon size={20} />, label: 'Рейтинг', roles: ['super_admin', 'academic_office','dean', 'head_of_dept'] },
    { id: 'settings', path: '/admin/settings', icon: <Settings size={20} />, label: 'Настройки', roles: ['super_admin', 'academic_office','dean', 'head_of_dept'] },
  ];

 useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!savedUser || !token) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    // Приводим роль к нижнему регистру для надежности сравнения
    const userRole = parsedUser.role?.toLowerCase(); 
    setUser(parsedUser);

    // Находим текущий пункт меню
    const currentItem = allMenuItems.find(item => item.path === location.pathname);
    
    if (currentItem) {
      // Проверяем наличие роли в массиве (тоже в нижнем регистре)
      const hasAccess = currentItem.roles.some(role => role.toLowerCase() === userRole);

      if (!hasAccess) {
        console.warn(`Access denied. User role: [${userRole}], Required roles:`, currentItem.roles);
        
        // Редирект на первую доступную страницу
        const firstAvailablePage = allMenuItems.find(item => 
          item.roles.some(role => role.toLowerCase() === userRole)
        );
        
        if (firstAvailablePage) {
          navigate(firstAvailablePage.path);
        } else {
          navigate('/login');
        }
      }
    }
  }, [location.pathname, navigate]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Фильтруем меню для отрисовки в сайдбаре
  const filteredMenuItems = allMenuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

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
            <img src="/images/icons/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col animate-in fade-in duration-500">
              <span className="font-black text-lg tracking-tighter text-white leading-none">
                KAZUTB <span className="text-blue-500">ADMIN</span>
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1.5 mt-4 overflow-y-auto">
          {filteredMenuItems.map((item) => {
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
            <div className="min-w-[40px] h-10 bg-blue-600 rounded-full flex items-center justify-center text-white ring-2 ring-white/10 shadow-sm font-black text-xs uppercase">
              {user.name?.substring(0, 2) || 'AD'}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 text-left">
                <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">
                  {user.name}
                </p>
            <p className="text-[9px] text-blue-400 font-bold truncate uppercase tracking-widest">
              {(() => {
                if (user.role === 'super_admin') {
                  return 'Администратор';
                }
                
                if (user.role === 'head_of_dept') {
                  // Если есть название кафедры в объекте, выводим его, иначе общую специализацию
                  return user.department?.title || user.department || 'Заведующий кафедрой';
                }
                
                if (user.role === 'academic_office' || user.role === 'dean') {
                  return user.academic_specialization || (user.role === 'dean' ? 'Декан факультета' : 'Академический офис');
                }
                
                return 'Faculty Dean';
              })()}
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
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Console</span>
               <h1 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                 {allMenuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
               </h1>
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