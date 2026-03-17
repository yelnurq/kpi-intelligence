import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  LogOut,
  User as UserIcon
} from 'lucide-react';

const MainLayout = ({ children, user }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Дашборд', path: '/' },
    { icon: <ClipboardList size={20} />, label: 'Мой План', path: '/plan' },
    { icon: <CheckCircle size={20} />, label: 'Достижения', path: '/activities' },
    { icon: <BarChart3 size={20} />, label: 'Рейтинг кафедры', path: '/rating' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-slate-900">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            K
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">KPI System</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Профиль внизу Sidebar */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <UserIcon size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name || 'Zeynolla Elnur'}</p>
              <p className="text-xs text-slate-500 truncate">Кафедра ИТ</p>
            </div>
          </div>
          <button className="w-full mt-4 flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Выйти</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-700">Панель управления</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
              Сезон 2026 активен
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;