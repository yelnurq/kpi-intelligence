import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Target, Zap, Award, User, Briefcase, 
  Clock, BarChart3, Loader2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ (SKELETONS) ---
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

const ChartSkeleton = () => (
  <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-100 shadow-sm flex flex-col animate-pulse">
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-50 rounded-lg" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-slate-100 rounded" />
          <div className="h-2 w-48 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
    <div className="flex-1 bg-slate-50/50 rounded-lg border border-dashed border-slate-100 min-h-[250px]" />
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
          {payload[0].payload.month}
        </p>
        <p className="text-sm font-bold text-white leading-none">
          {payload[0].value} <span className="text-[10px] text-slate-400 uppercase ml-1">баллов</span>
        </p>
      </div>
    );
  }
  return null;
};

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

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const Dashboard = () => {
  const navigate = useNavigate();
  
  // Инициализация из localStorage (мгновенное получение имени)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Если нет токена или данных юзера в локалке — выкидываем на логин
    if (!token || !user) {
      navigate('/login');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    Promise.all([
      axios.get('http://localhost:8000/api/user', { headers }),
      axios.get('http://localhost:8000/api/user/kpi-activities', { headers }).catch(() => ({ data: { data: [] } }))
    ])
    .then(([userRes, activitiesRes]) => {
      if (userRes.data.status === 'success') {
        setUser(userRes.data.data);
        // Опционально: обновляем localStorage актуальными данными от сервера
        localStorage.setItem('user', JSON.stringify(userRes.data.data));
      }
      setActivities(activitiesRes.data.data || []);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Auth error:", err);
      if (err.response?.status === 401) navigate('/login');
      setLoading(false);
    });
  }, [navigate]);

  if (!user && !loading) return null; // Предотвращает мерцание перед редиректом

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 bg-[#f8fafc] min-h-screen font-sans"> 
      
      {/* HEADER - Имя будет сразу, т.к. взяли из localStorage */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-6 text-left">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <User size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {user?.name || 'Загрузка...'}
            </h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              <Briefcase size={14} className="text-blue-600" />
              <span>{user?.position_title || (loading ? 'Синхронизация...' : 'Должность не указана')}</span>
              <span className="text-slate-300">|</span>
              <span className='text-blue-800'>{user?.academic_degree || '...'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS & CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-1 space-y-6">
          {loading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <div className="bg-white p-6 rounded-xl border border-slate-100 animate-pulse h-20" />
            </>
          ) : (
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

        {/* GRAPH COLUMN */}
        {loading ? <ChartSkeleton /> : (
          <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-slate-900 rounded-lg text-white"><BarChart3 size={18} /></div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight leading-none">История KPI</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Динамика за последние 6 месяцев</p>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={user?.chart_data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorKpi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="kpi" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorKpi)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ДОПОЛНИТЕЛЬНЫЕ КАРТОЧКИ */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <><StatSkeleton /><StatSkeleton /><StatSkeleton /></>
        ) : (
          <>
            <StatCard icon={Target} label="Цель" value={user?.min_kpi} colorClass="bg-slate-50 text-slate-600" description="Минимум на период" />
            <StatCard icon={Award} label="Кафедра" value={user?.leader || 'Не указан'} colorClass="bg-slate-50 text-slate-600" description={user?.department} hideUnit={true} />
            <StatCard icon={Award} label="Факультет" value={user?.dean || 'Не указан'} colorClass="bg-slate-50 text-slate-600" description={user?.faculty} hideUnit={true} />
          </>
        )}
      </div>

      {/* ACTIVITIES TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-6">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight text-left">Журнал последних достижений</h3>
          <div className='flex gap-2 items-center'>
            {!loading && (
              <>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">
                  Записей: {activities.length}
                </span>
                <Link to={'/archive'} className="text-[10px] font-bold text-blue-900 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm hover:text-blue-600 transition-colors">
                    Смотреть все
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Активность</th>
                <th className="px-6 py-4 font-bold text-center">Баллы</th>
                <th className="px-6 py-4 font-bold text-center">Дата подачи</th>
                <th className="px-6 py-4 font-bold text-right">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Обновляем данные...</span>
                    </div>
                  </td>
                </tr>
              ) : activities.length > 0 ? (
                activities.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-left">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100">+{item.points}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                        item.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {item.status === 'approved' ? 'Одобрено' : item.status === 'pending' ? 'На проверке' : 'Отклонено'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-xs font-bold uppercase">История пуста</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;