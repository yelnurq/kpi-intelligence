import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, UserPlus, Mail, Building2, Filter, 
  ChevronRight, Loader2, Trash2, Edit2, X, 
  ShieldCheck, MapPin, Users,
  UserCheck, UserMinus, ArrowRight, Shield
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
  
  const [options, setOptions] = useState({ faculties: [], departments: [], positions: [], degrees: [] });
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    faculty_id: '', department_id: '', position_id: '', academic_degree_id: '',
    role: 'user'
  });

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  // Загрузка пользователей
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const result = await res.json();
      if (result.status === 'success') {
        setUsers(result.data || []);
        const uniqueNames = [...new Set((result.data || []).map(u => u.faculty))].filter(Boolean);
        setFaculties(uniqueNames);
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Загрузка справочников для формы
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
      role: 'user'
    });
    setEditingId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
    fetchOptions();
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setIsModalOpen(true);

    const initialFormData = {
      name: user.name,
      email: user.email,
      password: '', 
      password_confirmation: '',
      role: user.role || 'user',
      faculty_id: options.faculties.find(f => f.name === user.faculty)?.id || '',
      department_id: options.departments.find(d => d.name === user.department)?.id || '',
      position_id: options.positions.find(p => p.name === user.position)?.id || '',
      academic_degree_id: options.degrees.find(d => d.name === user.academic_degree)?.id || '',
    };
    setFormData(initialFormData);

    fetchOptions().then(freshOptions => {
      if (freshOptions) {
        setFormData(prev => ({
          ...prev,
          faculty_id: freshOptions.faculties.find(f => f.name === user.faculty)?.id || prev.faculty_id,
          department_id: freshOptions.departments.find(d => d.name === user.department)?.id || prev.department_id,
          position_id: freshOptions.positions.find(p => p.name === user.position)?.id || prev.position_id,
          academic_degree_id: freshOptions.degrees.find(d => d.name === user.academic_degree)?.id || prev.academic_degree_id,
        }));
      }
    });
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Удалить этого сотрудника?")) return;
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
      }
    } finally { setIsSubmitting(false); }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFaculty = selectedFaculty === 'all' || user.faculty === selectedFaculty;
      return matchesSearch && matchesFaculty;
    });
  }, [users, searchTerm, selectedFaculty]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.activities_count > 0).length,
    new: users.filter(u => u.activities_count === 0).length,
    admins: users.filter(u => u.role === 'admin').length
  }), [users]);

  return (
    <main className="mx-auto px-6 md:px-10 py-10 bg-[#f8fafc] min-h-screen font-sans text-left">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Сотрудники и ППС</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Управление кадрами KPI Intelligence</p>
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
        <StatCard label="Общий штат" value={stats.total} icon={Users} colorClass="bg-slate-100 text-slate-600" description="Всего в системе" />
        <StatCard label="Активные" value={stats.active} icon={UserCheck} colorClass="bg-emerald-100 text-emerald-600" description="С заявками KPI" isPrimary={true} />
        <StatCard label="Новые" value={stats.new} icon={UserMinus} colorClass="bg-amber-100 text-amber-600" description="Без активности" />
        <StatCard label="Админы" value={stats.admins} icon={ShieldCheck} colorClass="bg-blue-100 text-blue-600" description="С правами доступа" />
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
        {/* Индикатор загрузки поверх контента (для обновлений) */}
        {loading && users.length > 0 && (
          <div className="absolute inset-0 z-10 bg-slate-50/40 backdrop-blur-[1px] flex items-start justify-center pt-20">
            <div className="bg-white px-6 py-3 rounded-full shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in zoom-in duration-200">
              <Loader2 className="animate-spin text-blue-600" size={20} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Обновление...</span>
            </div>
          </div>
        )}

        {/* Начальная загрузка (Skeleton) или Список */}
        {loading && users.length === 0 ? (
          <ListSkeleton />
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto text-left">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-bold text-xl shrink-0">
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{user.name}</h4>
                        {user.role === 'admin' && <Shield size={14} className="text-blue-600" title="Администратор" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 text-slate-400 text-[11px] font-medium mt-0.5 uppercase tracking-tight">
                        <span className="flex items-center gap-1.5"><Mail size={12} /> {user.email}</span>
                        <span className="flex items-center gap-1.5"><Building2 size={12} /> {user.faculty}</span>
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
             <Search size={32} className="text-slate-200 mx-auto mb-6" />
             <h3 className="text-xl font-bold text-slate-900">Ничего не найдено</h3>
             <p className="text-sm text-slate-400 mt-2">Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        )}
      </div>

      {/* MODAL WINDOW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-10 pb-6 flex justify-between items-start text-left">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">
                  {editingId ? 'Редактирование данных' : 'Регистрация сотрудника'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Заполните все обязательные поля системы
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-10 pb-10 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
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
                    <select required className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer" value={formData.faculty_id} onChange={e => setFormData({...formData, faculty_id: e.target.value})}>
                      <option value="">Выберите подразделение</option>
                      {options.faculties?.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Кафедра</label>
                    <select required className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                      <option value="">Выберите кафедру</option>
                      {options.departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Должность</label>
                    <select required className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer" value={formData.position_id} onChange={e => setFormData({...formData, position_id: e.target.value})}>
                      <option value="">Выберите должность</option>
                      {options.positions?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Ученая степень</label>
                    <select required className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer" value={formData.academic_degree_id} onChange={e => setFormData({...formData, academic_degree_id: e.target.value})}>
                      <option value="">Выберите степень</option>
                      {options.degrees?.map(deg => <option key={deg.id} value={deg.id}>{deg.name}</option>)}
                    </select>
                  </div>
                </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-slate-100">
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
      {editingId ? 'Новый пароль' : 'Пароль'}
    </label>
    <input 
      type="password" 
      // Если редактируем — не обязательно. Если создаем — обязательно.
      required={!editingId} 
      className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" 
      value={formData.password} 
      onChange={e => setFormData({...formData, password: e.target.value})} 
      placeholder={editingId ? "••••••••" : ""}
    />
  </div>

  <div className="space-y-1.5">
    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
      Подтвердите пароль
    </label>
    <input 
      type="password" 
      // Обязательно только если: 1. Это создание нового юзера 
      // ИЛИ 2. Поле пароля не пустое (пользователь решил сменить пароль при эдите)
      required={!editingId || formData.password !== ''} 
      className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" 
      value={formData.password_confirmation} 
      onChange={e => setFormData({...formData, password_confirmation: e.target.value})} 
      placeholder={editingId ? "••••••••" : ""}
    />
  </div>
</div>

                <div className="flex gap-4 mt-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Отмена</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-3 transition-all">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <>{editingId ? 'Обновить данные' : 'Зарегистрировать'} <ArrowRight size={16} /></>}
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