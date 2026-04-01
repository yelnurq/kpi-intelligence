import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, UserPlus, Mail, Building2, Filter, 
  ChevronRight, Loader2, Trash2, Edit2, X, 
  ShieldCheck, Users, UserCheck, UserMinus, 
  ArrowRight, Shield, User
} from 'lucide-react';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

const StatCard = ({ icon: Icon, label, value, colorClass, description, isPrimary, unit = "чел." }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md ${isPrimary ? 'ring-1 ring-blue-600/10' : ''}`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${isPrimary ? 'bg-blue-600' : 'bg-slate-200'}`} />
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{value}</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-left">{description}</p>
  </div>
);

const ListSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-[100px] bg-white border border-slate-100 rounded-2xl w-full" />
    ))}
  </div>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ---

const StaffManagement = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [faculties, setFaculties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Пагинация и статистика
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ last_page: 1, total: 0 });
  const [apiStats, setApiStats] = useState({ total: 0, active: 0, new: 0, admins: 0 });

  const [options, setOptions] = useState({ faculties: [], departments: [], positions: [], degrees: [] });
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    faculty_id: '', department_id: '', position_id: '', academic_degree_id: '',
    role: '' 
  });

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  // Функция загрузки с учетом фильтров и страницы
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        search: searchTerm,
        faculty: selectedFaculty
      });

      const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const result = await res.json();
      
      if (result.status === 'success') {
        setUsers(result.data || []);
        setMeta(result.meta);
        setApiStats(result.stats); // Берем статистику напрямую из ответа Laravel
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE, currentPage, searchTerm, selectedFaculty]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }, [currentPage]);
  // Эффект для загрузки данных
  useEffect(() => { 
    fetchUsers(); 
  }, [fetchUsers]);

  // Сброс на 1 страницу при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFaculty]);

  // Загрузка только списка факультетов для фильтра (один раз при старте)
  useEffect(() => {
    const loadInitialOptions = async () => {
        const res = await fetch(`${API_BASE}/admin/helpers/options`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (data.faculties) {
            setFaculties(data.faculties.map(f => f.name));
        }
    };
    loadInitialOptions();
  }, [token, API_BASE]);

  const fetchOptions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/helpers/options`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      setOptions(data);
      return data;
    } catch (error) {
      console.error("Ошибка справочников:", error);
    }
  }, [token, API_BASE]);

  const resetForm = () => {
    setFormData({
      name: '', email: '', password: '', password_confirmation: '',
      faculty_id: '', department_id: '', position_id: '', academic_degree_id: '',
      role : ''
    });
    setEditingId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
    fetchOptions();
  };

const handleEditClick = async (user) => {
  setEditingId(user.id);
  setIsModalOpen(true);
  
  // 1. Сначала загружаем свежие опции, если их еще нет
  const freshOptions = await fetchOptions(); 

  if (freshOptions) {
    // 2. Ищем совпадения. 
    // ВАЖНО: используем опциональную цепочку ?. и приведение к нижнему регистру для надежности
    const foundFaculty = freshOptions.faculties.find(f => 
      f.name?.toLowerCase() === user.faculty?.toLowerCase() || 
      f.short_name?.toLowerCase() === user.faculty_short?.toLowerCase()
    );

    const foundDept = freshOptions.departments.find(d => 
      d.name?.toLowerCase() === user.department?.toLowerCase()
    );

    const foundPos = freshOptions.positions.find(p => 
      p.name?.toLowerCase() === user.position?.toLowerCase()
    );

    const foundDeg = freshOptions.degrees.find(d => 
      d.name?.toLowerCase() === user.academic_degree?.toLowerCase()
    );

    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', 
      password_confirmation: '',
      is_admin: user.is_admin ? 1 : 0,
      // Приводим к строке, так как <select> работает со строковыми значениями
      faculty_id: foundFaculty ? foundFaculty.id.toString() : '',
      department_id: foundDept ? foundDept.id.toString() : '',
      position_id: foundPos ? foundPos.id.toString() : '',
      academic_degree_id: foundDeg ? foundDeg.id.toString() : '',
    });
  }
};

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Удалить пользователя?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      alert("Пароли не совпадают!");
      return;
    }

    setIsSubmitting(true);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/admin/users/${editingId}` : `${API_BASE}/admin/users`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchUsers();
      } else {
        const errData = await res.json();
        alert(errData.message || "Ошибка при сохранении");
      }
    } finally { setIsSubmitting(false); }
  };

  return (
    <main className="border rounded-lg mx-auto px-10 py-10 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Управление штатом</h1>
            <p className="flex items-center gap-2 mt-2 text-sm text-gray-500">Список сотрудников и администраторов системы</p>
          </div>

        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <UserPlus size={18} />
          Добавить сотрудника
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Общий штат" value={apiStats.total} icon={Users} colorClass="bg-slate-100 text-slate-600" description="Всего в системе" />
        <StatCard label="С активностью" value={apiStats.active} icon={UserCheck} colorClass="bg-emerald-100 text-emerald-600" description="Заполнили KPI" isPrimary={true} />
        <StatCard label="Без данных" value={apiStats.new} icon={UserMinus} colorClass="bg-amber-100 text-amber-600" description="Новые профили" />
        <StatCard label="Админы" value={apiStats.admins} icon={ShieldCheck} colorClass="bg-blue-100 text-blue-600" description="Права управления" />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative group flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Поиск по ФИО или Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="relative group w-full md:w-[300px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider appearance-none focus:border-blue-500 outline-none cursor-pointer shadow-sm"
          >
            <option value="all">Все подразделения</option>
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="relative min-h-[400px]">
        {loading && users.length > 0 && (
          <div className="absolute inset-0 z-10 bg-slate-50/40 backdrop-blur-[1px] flex items-start justify-center pt-20">
            <div className="bg-white px-6 py-3 rounded-full shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in zoom-in duration-200">
              <Loader2 className="animate-spin text-blue-600" size={20} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Обновление...</span>
            </div>
          </div>
        )}

        {loading && users.length === 0 ? (
          <ListSkeleton />
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
              <div key={user.id} className={`bg-white p-6 rounded-2xl border transition-all group ${user.is_admin ? 'border-blue-100 shadow-sm' : 'border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto text-left">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all font-bold text-xl shrink-0 ${user.is_admin ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                      {user.name?.charAt(0) || '?'}
            
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{user.name}</h4>
                          {user.auth_type === 'ldap' ? (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[9px] font-black uppercase tracking-wider">
                              LDAP
                            </span>
                          ): (
                            <span className="px-2 py-0.5 bg-green-100 text-green-500 border border-green-200 rounded text-[9px] font-black uppercase tracking-wider">                              
                              local
                            </span>
                          )}
                        {user.is_admin ? <Shield size={14} className="text-blue-600" title="Администратор" /> : <User size={14} className="text-slate-300" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 text-slate-400 text-[11px] font-medium mt-0.5 uppercase tracking-tight">
                        <span className="flex items-center gap-1.5"><Mail size={12} /> {user.email}</span>
                        <span className="flex items-center gap-1.5"><Building2 size={12} /> {user.faculty_short}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                    <div className="text-left md:text-right min-w-[120px]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.position || 'Должность...'}</p>
                      <p className="text-xs font-bold text-slate-700">{user.academic_degree || 'Без степени'}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase border ${
                      user.activities_count > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {user.activities_count > 0 ? `Активен (${user.activities_count})` : 'Нет заявок'}
                    </span>
                    <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                      <button onClick={() => handleEditClick(user)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Редактировать"><Edit2 size={18}/></button>
                      <button onClick={() => handleDeleteUser(user.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Удалить"><Trash2 size={18}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-slate-200 border-dashed p-20 text-center">
             <Users size={32} className="text-slate-200 mx-auto mb-6" />
             <h3 className="text-xl font-bold text-slate-900">Пользователи не найдены</h3>
             <p className="text-sm text-slate-400 mt-2">Попробуйте изменить параметры поиска или фильтрации</p>
          </div>
        )}
      </div>

      {/* PAGINATION UI */}
      {meta.last_page > 1 && (
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest md:ml-4">
            Страница {currentPage} из {meta.last_page} (Всего: {meta.total})
          </p>
          
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all"
            >
              Назад
            </button>

            {/* Логика сокращенной пагинации для большого кол-ва страниц */}
            {[...Array(meta.last_page)].map((_, i) => {
                const pageNum = i + 1;
                // Показываем первую, последнюю и соседние с текущей
                if (pageNum === 1 || pageNum === meta.last_page || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[40px] h-10 rounded-xl text-[10px] font-bold transition-all ${
                            currentPage === pageNum 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                            : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                    );
                }
                return null;
            })}

            <button 
              disabled={currentPage === meta.last_page}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all"
            >
              Вперед
            </button>
          </div>
        </div>
      )}

      {/* MODAL WINDOW (Остался без изменений, только исправил тексты) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="p-10 pb-6 flex justify-between items-start text-left">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">
                  {editingId ? 'Редактирование профиля' : 'Новый сотрудник'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Учетные данные и права доступа
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="px-10 pb-10 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.is_admin ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">Права администратора</p>
                      <p className="text-[10px] text-slate-500 font-medium italic">Дает доступ к управлению всей системой</p>
                    </div>
                  </div>
            <button 
                type="button"
                onClick={() => setFormData({
                  ...formData, 
                  // Если роль уже super_admin, ставим user, иначе ставим super_admin
                  role: formData.role === 'super_admin' ? 'user' : 'super_admin'
                })}
                className={`w-12 h-6 rounded-full relative transition-all ${
                  formData.role === 'super_admin' ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  formData.role === 'super_admin' ? 'left-7' : 'left-1'
                }`} />
              </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Полное ФИО</label>
                    <input type="text" required className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Email (Логин)</label>
                    <input type="email" required className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                        <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Факультет</label>
                  <select 
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer" 
                    value={formData.faculty_id} 
                    onChange={e => setFormData({...formData, faculty_id: e.target.value})}
                  >
                    <option value="">Выберите подразделение</option>
                    {options.faculties?.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Кафедра</label>
                  <select 
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer" 
                    value={formData.department_id} 
                    onChange={e => setFormData({...formData, department_id: e.target.value})}
                  >
                    <option value="">Выберите кафедру</option>
                    {options.departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Должность</label>
                  <select 
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer" 
                    value={formData.position_id} 
                    onChange={e => setFormData({...formData, position_id: e.target.value})}
                  >
                    <option value="">Выберите должность</option>
                    {options.positions?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Ученая степень</label>
                  <select 
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer" 
                    value={formData.academic_degree_id} 
                    onChange={e => setFormData({...formData, academic_degree_id: e.target.value})}
                  >
                    <option value="">Выберите степень</option>
                    {options.degrees?.map(deg => <option key={deg.id} value={deg.id}>{deg.name}</option>)}
                  </select>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{editingId ? 'Новый пароль' : 'Пароль'}</label>
                    <input 
                      type="password" 
                      required={!editingId} 
                      className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                      placeholder={editingId ? "Оставьте пустым, чтобы не менять" : "••••••••"}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Подтверждение</label>
                    <input 
                      type="password" 
                      required={!editingId || formData.password !== ''} 
                      className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" 
                      value={formData.password_confirmation} 
                      onChange={e => setFormData({...formData, password_confirmation: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Отмена</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-3 transition-all">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <>{editingId ? 'Обновить данные' : 'Сохранить'} <ArrowRight size={16} /></>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StaffManagement;