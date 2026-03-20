import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Target, Zap, TrendingUp, ChevronRight, FilePlus2, Award, 
  User, GraduationCap, Briefcase, ShieldCheck, Clock, CheckCircle, 
  AlertCircle, BarChart3, Calendar, ArrowUpRight  
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, trend, colorClass, description, isPrimary }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-md ${isPrimary ? 'ring-1 ring-blue-600/10' : ''}`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${isPrimary ? 'bg-blue-600' : 'bg-slate-200'}`} />
    
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{value}</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">баллов</span>
        </div>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>

    <div className="flex items-center justify-between mt-2">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
        {description}
      </p>
      {trend && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
          <ArrowUpRight size={14} /> {trend}%
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    Promise.all([
      axios.get('http://localhost:8000/api/user', { headers }),
      axios.get('http://localhost:8000/api/user/kpi-activities', { headers }).catch(() => ({ data: { data: [] } }))
    ])
    .then(([userRes, activitiesRes]) => {
      if (userRes.data.status === 'success') setUser(userRes.data.data);
      setActivities(activitiesRes.data.data || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Загрузка профиля...</p>
    </div>
  );

  if (!user) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Ошибка доступа</div>;

  return (
    <main className="max-w-7xl mx-auto px-8 py-10 space-y-8 bg-[#f8fafc] min-h-screen">
      
      {/* 1. HEADER SECTION (Style matched to Ranking) */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-6 text-left">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
              <User size={32} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-[#f8fafc]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{user.name}</h1>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <Briefcase size={14} className="text-blue-600" />
                <span className="text-[10px] uppercase tracking-wider text-slate-500">{user.position_title}</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight italic">{user.academic_degree}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs transition-all tracking-wider uppercase border bg-white text-slate-700 border-slate-200 shadow-sm hover:bg-slate-50">
            <Calendar size={16} />
            <span>Архив периодов</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-xs transition-all tracking-wider uppercase bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200">
            <FilePlus2 size={16} />
            <span>Новый отчет</span>
          </button>
        </div>
      </div>
{/* Пример для вставки в StatCard или рядом */}
<div className="mt-4 space-y-2">
  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
    <span>Прогресс цели</span>
    <span>{Math.round((user.current_kpi / user.min_kpi) * 100)}%</span>
  </div>
  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
    <div 
      className="h-full bg-blue-600 transition-all duration-1000" 
      style={{ width: `${(user.current_kpi / user.min_kpi) * 100}%` }}
    />
  </div>
</div>
      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
       
        <StatCard 
          icon={Zap} 
          label="Текущий KPI" 
          value={user.current_kpi} 
          isPrimary={true}
          colorClass="bg-blue-50 text-blue-600" 
          description="Подтвержденные баллы" 
        />
        <StatCard 
          icon={Clock} 
          label="На проверке" 
          value={`+${user.pending_kpi}`} 
          colorClass="bg-amber-50 text-amber-600" 
          description="Ожидают верификации" 
        />
        <StatCard 
          icon={Target} 
          label="Целевой план" 
          value={user.min_kpi} 
          colorClass="bg-slate-50 text-slate-600" 
          description="Минимум для должности" 
        />
        <StatCard 
          icon={Award} 
          label="Кафедра" 
          value={user.department_leader} 
          colorClass="bg-slate-50 text-slate-600" 
          description={user.department} 
        />
        <StatCard 
          icon={Award} 
          label="Факультет" 
          value={user.dean} 
          colorClass="bg-slate-50 text-slate-600" 
          description={user.faculty} 
        />
      </div>

      {/* 3. ACTIVITIES TABLE (Matched to Ranking Table Style) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight">Журнал последних достижений</h3>
          <div className='flex gap-2 items-center'>

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">
            Записей: {activities.length}
          </span>
          <Link to={'/archive'} className="text-[10px] font-bold text-blue-900 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm pointer hover:text-blue-600">
              Смотреть все
          </Link>
          </div>

        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Активность</th>
                <th className="px-6 py-4 font-bold text-center">Баллы</th>
                <th className="px-6 py-4 font-bold text-center">Дата подачи</th>
                <th className="px-6 py-4 font-bold text-right">Статус верификации</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100">
                      +{item.points}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      item.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
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