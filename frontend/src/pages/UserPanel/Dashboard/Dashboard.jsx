import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Target, Zap, TrendingUp, ChevronRight, FilePlus2, Award, 
  User, GraduationCap, Briefcase, ShieldCheck, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

// Компонент карточки статистики (без изменений)
const StatCard = ({ icon: Icon, label, value, trend, colorClass, subtitle, description }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500 ${colorClass}`}>
        <Icon size={22} />
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full uppercase tracking-wider">
          <TrendingUp size={12} /> {trend}%
        </div>
      )}
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</p>
        <span className="text-xs text-slate-400 font-semibold uppercase">{subtitle || 'баллов'}</span>
      </div>
      {description && <p className="text-[11px] text-gray-400 mt-2 font-medium leading-relaxed">{description}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]); // Состояние для таблицы
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    // Загружаем пользователя и его последние активности параллельно
    Promise.all([
      axios.get('http://localhost:8000/api/user', { headers }),
      axios.get('http://localhost:8000/api/user/kpi-activities', { headers }).catch(() => ({ data: [] }))
    ])
    .then(([userRes, activitiesRes]) => {
      if (userRes.data.status === 'success') {
        setUser(userRes.data.data);
      }
      setActivities(activitiesRes.data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Ошибка API:", err);
      setLoading(false);
    });
  }, []);

 if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-slate-50/80 backdrop-blur-sm">
        <div className="relative">
          {/* Внешнее кольцо */}
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
          {/* Анимированное кольцо */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="font-black text-slate-900 uppercase tracking-[0.2em] text-xs">
            Загрузка системы
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }  if (!user) return <div className="flex h-screen items-center justify-center font-bold text-red-500">Ошибка доступа</div>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8"> 
      
      {/* 1. ПЕРСОНАЛЬНЫЙ HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
             <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform duration-500">
               <User size={40} />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-sm">
               <ShieldCheck size={14} />
             </div>
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 items-center">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg">
                <Briefcase size={12} /> {user.position_title}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <GraduationCap size={14} /> {user.academic_degree}
              </span>
            </div>
          </div>
        </div>

        <button className="flex-grow lg:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group">
          <FilePlus2 size={16} /> Создать отчет
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 2. ГРИД КАРТОЧЕК KPI */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"> {/* Изменил lg:grid-cols-5 для 5 колонок */}
  <StatCard 
    icon={Zap} 
    label="Мой Текущий KPI" 
    value={user.current_kpi} 
    trend={user.progress_percent} 
    colorClass="bg-blue-600 text-white" 
    description="Подтверждено баллов" 
  />

  {/* НОВАЯ КАРТОЧКА: Pending KPI */}
  <StatCard 
    icon={Clock} // Не забудь импортировать Clock из lucide-react
    label="На проверке" 
    value={`+${user.pending_kpi}`} 
    colorClass="bg-amber-50 text-amber-600 border border-amber-100" 
    description="Ожидают подтверждения" 
  />

  <StatCard 
    icon={Target} 
    label="Целевой План" 
    value={user.min_kpi} 
    colorClass="bg-slate-50 text-slate-600" 
    subtitle={`/ ${user.min_kpi}`} 
    description="Порог для вашей должности" 
  />
  
  <StatCard 
    icon={Award} 
    label="Зав. кафедрой" 
    value={user.department_leader} 
    subtitle=" " 
    colorClass="bg-slate-50 text-slate-600" 
    description={user.department} 
  />
  
  <StatCard 
    icon={Award} 
    label="Декан" 
    value={user.dean} 
    subtitle=" " 
    colorClass="bg-slate-50 text-slate-600" 
    description={user.faculty} 
  />
</div>
      {/* 3. ТАБЛИЦА ПОСЛЕДНИХ АКТИВНОСТЕЙ */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Последние активности</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">Всего записей: {activities.length}</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Достижение / Категория</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Баллы</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Дата</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{item.category}</p>
                  </td>
                  <td className="p-6 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-lg">+{item.points}</span>
                  </td>
                  <td className="p-6 text-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{item.date}</span>
                  </td>
                  <td className="p-6 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                      item.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                      item.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                      'bg-red-50 text-red-600'
                    }`}>
                      {item.status === 'approved' && <CheckCircle size={12} />}
                      {item.status === 'pending' && <Clock size={12} />}
                      {item.status === 'rejected' && <AlertCircle size={12} />}
                      {item.status === 'approved' ? 'Одобрено' : item.status === 'pending' ? 'На проверке' : 'Отклонено'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
};

export default Dashboard;