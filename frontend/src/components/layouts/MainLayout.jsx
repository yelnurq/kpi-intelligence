import React, { useState } from 'react';
import { 
  Routes, 
  Route, 
  Link, 
  useLocation, 
  Navigate 
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

// Импорт ваших страниц
import Dashboard from '../../pages/Dashboard/Dashboard';
import SubmissionPortal from '../../pages/SubmissionPortal/SubmissionPortal';
import ReportGenerator from '../../pages/ReportGenerator/ReportGenerator';
import PlanningPage from '../../pages/UserPanel/Plan/PlanningPage';
import ActivityArchive from '../../pages/Archive/ActivityArchive';
import FacultyRanking from '../../pages/Faculty/FacultyRank/FacultyRanking';

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation(); // Получаем текущий путь для активного стиля

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Дашборд' },
    { id: 'plan', path: '/plan', icon: <PanelsTopLeftIcon size={20} />, label: 'Планирование KPI' },
    { id: 'archive', path: '/archive', icon: <ClipboardList size={20} />, label: 'Архив заявок' },
    { id: 'submit', path: '/submit', icon: <CheckCircle size={20} />, label: 'Подать активность' },
    { id: 'rating', path: '/rating', icon: <BarChart3 size={20} />, label: 'Рейтинг факультетов' },
    { id: 'report', path: '/report', icon: <FileText size={20} />, label: 'Генератор отчетов' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-20'} 
        bg-white border-r border-slate-200 flex flex-col fixed h-full transition-all duration-300 z-50
      `}>
        {/* LOGO */}
        <div className="p-6 flex items-center gap-3 h-20 border-b border-slate-50">
          <div className="min-w-[45px] h-12 flex items-center justify-center overflow-hidden">
            <img src="images/icons/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-bold tracking-tighter text-slate-800 animate-in fade-in duration-500">
              KAZ<span className="text-blue-600">UTB</span>
            </span>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                
                {isActive && !isSidebarOpen && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE CARD */}
        <div className="p-4 mt-auto border-t border-slate-50 space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${isSidebarOpen ? 'bg-slate-50' : 'bg-transparent justify-center'}`}>
            <div className="min-w-[40px] h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 ring-2 ring-white shadow-sm">
              <UserIcon size={20} />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 text-left">
                <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tighter">Zeynolla Elnur</p>
                <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-widest">Fullstack Dev</p>
              </div>
            )}
          </div>
          
          <button className={`w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all group ${!isSidebarOpen && 'justify-center'}`}>
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-widest">Выйти</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        
        {/* STICKY NAVBAR */}
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

        {/* PAGE CONTENT CONTAINER WITH ROUTES */}
        <div className="min-h-[calc(100vh-80px)] overflow-x-hidden">
          <Routes>
            {/* Редирект с корня на дашборд */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plan" element={<PlanningPage />} />
            <Route path="/archive" element={<ActivityArchive />} />
            <Route path="/submit" element={<SubmissionPortal />} />
            <Route path="/rating" element={<FacultyRanking />} />
            <Route path="/report" element={<ReportGenerator />} />

            {/* 404 Страница (опционально) */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-full p-20">
                <h2 className="text-4xl font-bold italic">404</h2>
                <p className="text-slate-500">Страница не найдена</p>
              </div>
            } />
          </Routes>
        </div>

        {/* FOOTER */}
        <footer className="p-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 KAZUTB — KPI SYSTEM</p>
           <div className="flex gap-6">
              <a href="#" className="text-[10px] font-bold text-slate-400 uppercase hover:text-blue-600 transition-colors">Поддержка</a>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;