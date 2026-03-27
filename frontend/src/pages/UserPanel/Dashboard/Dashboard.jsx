import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Target, Zap, Award, User, Briefcase, 
  Clock, BarChart3, Loader2, ClipboardCheck, 
  ChevronRight, ArrowUpRight, AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---
const StatSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-3">
        <div className="h-2 w-16 bg-slate-100 rounded" />
        <div className="h-6 w-24 bg-slate-100 rounded" />
      </div>
      <div className="w-10 h-10 bg-slate-50 rounded-lg" />
    </div>
    <div className="h-2 w-32 bg-slate-100 rounded" />
  </div>
);

const StatCard = ({ icon: Icon, label, value, colorClass, description, isPrimary, hideUnit, unitText = "баллов" }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md ${isPrimary ? 'ring-1 ring-blue-600/10' : ''}`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${isPrimary ? 'bg-blue-600' : 'bg-slate-200'}`} />
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{value ?? '—'}</h3> 
           {!hideUnit && <span className="text-[10px] font-bold text-slate-400 uppercase">{unitText}</span>}
        </div>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-left">{description}</p>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{payload[0].payload.month}</p>
        <p className="text-sm font-bold text-white leading-none">{payload[0].value} <span className="text-[10px] text-slate-400 uppercase ml-1">баллов</span></p>
      </div>
    );
  }
  return null;
};

// --- КОМПОНЕНТ КАРТОЧКИ ИНДИКАТОРА ---
const IndicatorCard = ({ title, weight, progress, deadline, index }) => {
  const isExpired = deadline && new Date(deadline) < new Date() && progress < 100;
  const diffDays = deadline ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const isUrgent = diffDays !== null && diffDays <= 10 && diffDays >= 0 && progress < 100;

  return (
    <div className={`bg-white p-5 rounded-xl border shadow-sm text-left group transition-all relative overflow-hidden ${isExpired ? 'border-red-200' : isUrgent ? 'border-amber-200' : 'border-slate-200'} hover:border-blue-200`}>
      {isExpired && (
        <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
          <span className="text-[8px] font-black uppercase tracking-tighter">Просрочено</span>
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isExpired ? 'bg-red-50 text-red-500' : isUrgent ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
          <span className="text-xs font-black">{index + 1}</span>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${isExpired ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          {weight} баллов
        </span>
      </div>
      <p className="text-[11px] font-bold text-slate-700 leading-tight mb-3 line-clamp-2 h-8">
        {title}
      </p>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[9px] font-bold uppercase">
          <span className={isExpired ? 'text-red-500' : isUrgent ? 'text-amber-600' : 'text-slate-400'}>
            До: {deadline || '—'}
          </span>
          <span className="text-slate-900">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : isExpired ? 'bg-red-500' : isUrgent ? 'bg-amber-500' : 'bg-blue-600'}`} 
            style={{ width: `${Math.min(progress, 100)}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [activities, setActivities] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    Promise.all([
      axios.get('http://localhost:8000/api/user', { headers }),
      axios.get('http://localhost:8000/api/user/kpi-activities', { headers }),
      // Получаем и статус плана, и полный список индикаторов, чтобы вытащить названия
      axios.get('http://localhost:8000/api/get-plan-status?year=2025/2026', { headers }),
      axios.get('http://localhost:8000/api/kpi-indicators', { headers }) 
    ])
    .then(([userRes, actRes, planRes, allIndsRes]) => {
      if (userRes.data.status === 'success') setUser(userRes.data.data);
      setActivities(actRes.data.data || []);
      
      // 1. Берем ID выбранных индикаторов и дедлайны
      const selectedIds = planRes.data.selected_ids || [];
      const deadlines = planRes.data.deadlines || {};
      
      // 2. Берем эталонный список индикаторов (где есть названия и веса)
      // Проверяем разные уровни вложенности, в зависимости от твоего API
      const referenceIndicators = allIndsRes.data.data || allIndsRes.data || [];

      // 3. Собираем объекты для отображения
      const userPlan = referenceIndicators
        .filter(ind => selectedIds.includes(ind.id))
        .map(ind => ({
          id: ind.id,
          title: ind.title || ind.name_ru || `Индикатор #${ind.id}`,
          weight: ind.weight || 0,
          progress: ind.progress || 0,
          deadline: deadlines[ind.id] || null
        }));

      // 4. Фильтруем "горящие"
      const criticalTasks = userPlan.filter(ind => {
        if (!ind.deadline) return false;
        const diff = (new Date(ind.deadline) - new Date()) / (1000 * 60 * 60 * 24);
        return (diff <= 10 || diff < 0) && ind.progress < 100;
      });

      // Если критических нет, показываем просто первые 4 из выбранных
      setIndicators(criticalTasks.length > 0 ? criticalTasks : userPlan);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Ошибка загрузки данных дашборда:", err);
      setLoading(false);
    });
  }, [navigate]);
  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-6 text-left">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <User size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{user?.name || 'Загрузка...'}</h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              <Briefcase size={14} className="text-blue-600" />
              <span>{user?.position_title || 'Должность'}</span>
              <span className="text-slate-300">|</span>
              <span className='text-blue-800'>{user?.academic_degree || 'Степень'}</span>
            </div>
          </div>
        </div>
        <Link to="/planning" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          KPI Планирование <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* KPI И ГРАФИК */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-1 space-y-6">
          {loading ? <><StatSkeleton /><StatSkeleton /></> : (
            <>
              <StatCard icon={Zap} label="Текущий KPI" value={user?.current_kpi} isPrimary={true} colorClass="bg-blue-50 text-blue-600" description="Подтвержденные баллы" />
              <StatCard icon={Clock} label="На проверке" value={`+${user?.pending_kpi}`} colorClass="bg-amber-50 text-amber-600" description="Ожидают верификации" />
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  <span>Прогресс цели</span>
                  <span>{user?.progress_percent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${Math.min(user?.progress_percent || 0, 100)}%` }} />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg text-white"><BarChart3 size={18} /></div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight leading-none">История KPI</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Динамика подтвержденных достижений</p>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={user?.chart_data || []}>
                <defs>
                  <linearGradient id="colorKpi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="kpi" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorKpi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* БЛОК ИНДИКАТОРОВ */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-slate-900" />
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight">Внимание: приоритетные задачи</h3>
          </div>
          <Link to="/planning" className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1 hover:underline">
            Весь план <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
             [1,2,3,4].map(i => <div key={i} className="h-32 bg-white border border-slate-100 rounded-xl animate-pulse" />)
          ) : indicators.length > 0 ? (
            indicators.slice(0, 4).map((ind, idx) => (
              <IndicatorCard 
                key={ind.id || idx}
                index={idx}
                title={ind.title}
                weight={ind.weight}
                progress={ind.progress}
                deadline={ind.deadline}
              />
            ))
          ) : (
            <div className="col-span-full py-10 bg-white border border-dashed border-slate-200 rounded-xl text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Активных задач не найдено</p>
              <Link to="/planning" className="inline-block mt-3 text-[10px] text-blue-600 font-black uppercase underline">Перейти к планированию</Link>
            </div>
          )}
        </div>
      </div>

      {/* НИЖНИЕ КАРТОЧКИ */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? <><StatSkeleton /><StatSkeleton /><StatSkeleton /></> : (
          <>
            <StatCard icon={Target} label="Цель на год" value={user?.min_kpi} colorClass="bg-slate-50 text-slate-600" description="Минимальный порог" />
            <StatCard icon={Award} label="Кафедра" value={user?.leader || '—'} colorClass="bg-slate-50 text-slate-600" description={user?.department} hideUnit={true} />
            <StatCard icon={Award} label="Факультет" value={user?.dean || '—'} colorClass="bg-slate-50 text-slate-600" description={user?.faculty} hideUnit={true} />
          </>
        )}
      </div>

      {/* ТАБЛИЦА АКТИВНОСТЕЙ */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-8">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight text-left">Журнал последних достижений</h3>
          <Link to={'/archive'} className="text-[9px] font-black text-blue-900 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            Весь архив <ArrowUpRight size={12} />
          </Link>
        </div>
        
        <div className="overflow-x-auto text-left">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Активность</th>
                <th className="px-6 py-4 font-bold text-center">Баллы</th>
                <th className="px-6 py-4 font-bold text-center">Дата</th>
                <th className="px-6 py-4 font-bold text-right">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center"><Loader2 className="animate-spin inline mr-2 text-blue-500" /></td></tr>
              ) : activities.length > 0 ? (
                activities.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded border border-blue-100">+{item.points}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-[10px] font-bold text-slate-500 uppercase">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                        item.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {item.status === 'approved' ? 'Одобрено' : item.status === 'pending' ? 'В работе' : 'Отказ'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">История пуста</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;