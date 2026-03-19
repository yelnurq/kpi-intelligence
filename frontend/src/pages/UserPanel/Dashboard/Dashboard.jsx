import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Target, Zap, TrendingUp, ChevronRight, CheckCircle, 
  Clock, Lightbulb, FilePlus2, Award, ArrowRight,
  User, GraduationCap, Briefcase, MapPin, ShieldCheck
} from 'lucide-react';

// Компонент карточки статистики
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем токен из локального хранилища
    const token = localStorage.getItem('token'); 

    axios.get('http://localhost:8000/api/user', {
      headers: {
        // Передаем токен в заголовке
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => {
        // Учитывая твою структуру ответа в контроллере
        if (res.data.status === 'success') {
          setUser(res.data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка API:", err);
        // Если токен невалидный (401), можно редиректнуть на логин
        if (err.response && err.response.status === 401) {
           // window.location.href = '/login';
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-blue-600 animate-pulse uppercase tracking-widest">Загрузка системы...</div>;
  if (!user) return <div className="flex h-screen items-center justify-center font-bold text-red-500">Ошибка доступа к данным</div>;

  // Фейковые данные для графика (пока нет API для них)
  const planVsFactData = [
    { name: 'Наука', plan: user.min_kpi * 0.5, fact: user.current_kpi * 0.4 },
    { name: 'Метод.раб', plan: user.min_kpi * 0.3, fact: user.current_kpi * 0.4 },
    { name: 'Общ.деят', plan: user.min_kpi * 0.2, fact: user.current_kpi * 0.2 },
  ];

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
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
              {user.name}
            </h1>
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

        <div className="flex items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0">
          
          <button className="flex-grow lg:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group">
            <FilePlus2 size={16} /> Создать отчет
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. ГРИД КАРТОЧЕК KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Zap} 
          label="Мой Текущий KPI" 
          value={user.current_kpi} 
          trend={user.progress} 
          colorClass="bg-blue-600 text-white" 
          description={`Загружено подтверждений на ${user.current_kpi} баллов`} 
        />
        <StatCard 
          icon={Target} 
          label="Целевой План" 
          value={user.min_kpi} 
          colorClass="bg-slate-50 text-slate-600" 
          subtitle={`/ ${user.min_kpi}`} 
          description={`Минимальный порог для: ${user.position_title}`} 
        />
     
        <StatCard 
          icon={Award} 
          label="Зав. кафедрой" 
          value={`${user.department_leader}`}
          subtitle=" " 
          colorClass="bg-amber-50 text-amber-600" 
          description={`${user.department}`} 
        />
        <StatCard 
          icon={Award} 
          label="Декан" 
          value={`${user.dean}`}
          subtitle=" " 
          colorClass="bg-amber-50 text-amber-600" 
          description={`${user.faculty}`} 
        />
      </div>

    
    </main>
  );
};

export default Dashboard;