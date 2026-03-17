import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  LogOut,
  User as UserIcon,
  Bell,
  Search,
  Menu,
  Zap,
  X,
  PanelsTopLeftIcon
} from 'lucide-react';

// Импортируем созданные компоненты (предположим, они в этом же файле или импортированы)
import SubmissionPortal from '../../pages/SubmissionPortal/SubmissionPortal';
import ActivityArchive from '../../pages/Archive/ActivityArchive';
import FacultyRanking from '../../pages/Faculty/FacultyRank/FacultyRanking';
import Dashboard from '../../pages/Dashboard/Dashboard';
import PlanningPage from '../../pages/Plan/PlanningPage';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Дашборд' },
    { id: 'plan', icon: <PanelsTopLeftIcon size={20} />, label: 'Планирование KPI' },
    { id: 'archive', icon: <ClipboardList size={20} />, label: 'Архив заявок' },
    { id: 'submit', icon: <CheckCircle size={20} />, label: 'Подать активность' },
    { id: 'rating', icon: <BarChart3 size={20} />, label: 'Рейтинг факультетов' },
  ];

  // Рендер контента в зависимости от выбранной вкладки
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'submit': return <SubmissionPortal />;
      case 'plan': return <PlanningPage />;
      case 'archive': return <ActivityArchive />;
      case 'rating': return <FacultyRanking />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 animate-bounce">
            <LayoutDashboard size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Добро пожаловать в KPI System</h2>
          <p className="text-slate-500 max-w-sm">Выберите раздел в меню слева, чтобы начать работу с вашими достижениями.</p>
        </div>
      );
    }
  };

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
            <img 
                src="images/icons/logo.png" 
                alt="KPI System Logo" 
                className="h-full w-full object-contain"
            />
            </div>
          {isSidebarOpen && (
            <span className="text-xl font-black tracking-tighter text-slate-800 animate-in fade-in duration-500">
              KAZ<span className="text-blue-600">UTB</span>
            </span>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
                ${activeTab === item.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <span className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                {item.icon}
              </span>
              {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
              
              {/* Активный индикатор (точка) */}
              {activeTab === item.id && !isSidebarOpen && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* USER PROFILE CARD */}
        <div className="p-4 mt-auto border-t border-slate-50 space-y-4">
          <div className={`
            flex items-center gap-3 p-3 rounded-2xl transition-colors
            ${isSidebarOpen ? 'bg-slate-50' : 'bg-transparent justify-center'}
          `}>
            <div className="min-w-[40px] h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 ring-2 ring-white shadow-sm">
              <UserIcon size={20} />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden animate-in fade-in slide-in-from-left-2">
                <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tighter">Zeynolla Elnur</p>
                <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-widest">Fullstack Dev</p>
              </div>
            )}
          </div>
          
          <button className={`
            w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all group
            ${!isSidebarOpen && 'justify-center'}
          `}>
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-black uppercase tracking-widest">Выйти</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        
        {/* STICKY NAVBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
            >
              {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div className="h-6 w-[1px] bg-slate-100 mx-2" />
            <h1 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
              {menuItems.find(i => i.id === activeTab)?.label}
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
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Ваш ранг</p>
                  <p className="text-sm font-black text-blue-600 leading-none mt-1">ТОП-5%</p>
               </div>
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Zap size={18} fill="currentColor" />
               </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div className="min-h-[calc(100vh-80px)]">
           {renderContent()}
        </div>

        {/* FOOTER */}
        <footer className="p-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 KPI.PRO — Платформа управления достижениями</p>
           <div className="flex gap-6">
              <a href="#" className="text-[10px] font-bold text-slate-400 uppercase hover:text-blue-600 transition-colors">Поддержка</a>
              <a href="#" className="text-[10px] font-bold text-slate-400 uppercase hover:text-blue-600 transition-colors">Политика</a>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;