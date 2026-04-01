import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, UserPlus, Mail, Building2, Filter, 
  ChevronRight, Loader2, Trash2, Edit2, X, 
  ShieldCheck, Users, UserCheck, UserMinus, 
  ArrowRight, Shield, User, GraduationCap
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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ last_page: 1, total: 0 });
  const [apiStats, setApiStats] = useState({ total: 0, active: 0, new: 0, admins: 0 });

  const [options, setOptions] = useState({ faculties: [], departments: [], positions: [], degrees: [] });
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    faculty_id: '', department_id: '', position_id: '', academic_degree_id: '',
    academic_specialization: '', 
    role: 'teacher' 
  });

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

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
        setApiStats(result.stats);
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE, currentPage, searchTerm, selectedFaculty]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedFaculty]);

  useEffect(() => {
    const loadInitialOptions = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/helpers/options`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.faculties) setFaculties(data.faculties.map(f => f.name));
        } catch (e) { console.error(e); }
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
    } catch (error) { console.error("Ошибка справочников:", error); }
  }, [token, API_BASE]);

  const resetForm = () => {
    setFormData({
      name: '', email: '', password: '', password_confirmation: '',
      faculty_id: '', department_id: '', position_id: '', academic_degree_id: '',
      academic_specialization: '',
      role: 'teacher'
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
    const freshOptions = await fetchOptions(); 

    if (freshOptions) {
      const foundFaculty = freshOptions.faculties.find(f => 
        f.name?.toLowerCase() === user.faculty?.toLowerCase() || 
        f.short_name?.toLowerCase() === user.faculty_short?.toLowerCase()
      );
      const foundDept = freshOptions.departments.find(d => d.name?.toLowerCase() === user.department?.toLowerCase());
      const foundPos = freshOptions.positions.find(p => p.name?.toLowerCase() === user.position?.toLowerCase());
      const foundDeg = freshOptions.degrees.find(d => d.name?.toLowerCase() === user.academic_degree?.toLowerCase());

      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', 
        password_confirmation: '',
        role: user.role || 'teacher',
        academic_specialization: user.academic_specialization || '',
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
            <p className="flex items-center gap-2 mt-2 text-sm text-gray-500">Система ролей и академических данных сотрудников</p>
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

      {/* CONTENT */}
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
              <div key={user.id} className={`bg-white p-6 rounded-2xl border transition-all group ${user.role === 'super_admin' ? 'border-blue-100 shadow-sm' : 'border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto text-left">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all font-bold text-xl shrink-0 ${user.role === 'super_admin' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{user.name}</h4>
                        {user.auth_type === 'ldap' ? (
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[9px] font-black uppercase tracking-wider">LDAP</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[9px] font-black uppercase tracking-wider">local</span>
                        )}
                        {user.role === 'super_admin' ? <Shield size={14} className="text-blue-600" title="Администратор" /> : <User size={14} className="text-slate-300" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 text-slate-400 text-[11px] font-medium mt-0.5 uppercase tracking-tight">
                        <span className="flex items-center gap-1.5"><Mail size={12} /> {user.email}</span>
                        <span className="flex items-center gap-1.5"><Building2 size={12} /> {user.faculty_short}</span>
                        {user.role !== 'teacher' && <span className="text-blue-500 font-bold">[{user.role}]</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                    <div className="text-left md:text-right min-w-[120px]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.position || 'Должность...'}</p>
                      <p className="text-xs font-bold text-slate-700">{user.academic_degree || 'Без степени'}</p>
                      {user.academic_specialization && (
                        <p className="text-[9px] font-medium text-blue-500 italic mt-0.5 max-w-[180px] leading-tight">{user.academic_specialization}</p>
                      )}
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
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {meta.last_page > 1 && (
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest md:ml-4">Страница {currentPage} из {meta.last_page}</p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-100 disabled:opacity-50">Назад</button>
            <button disabled={currentPage === meta.last_page} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-100 disabled:opacity-50">Вперед</button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="p-10 pb-6 flex justify-between items-start text-left">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{editingId ? 'Редактирование профиля' : 'Новый сотрудник'}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Настройка ролей и академических данных</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
            </div>

            <div className="px-10 pb-10 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                
                {/* ROLE SELECTION */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${formData.role === 'super_admin' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}><Shield size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">Полный доступ (Super Admin)</p>
                        <p className="text-[10px] text-slate-500 font-medium italic">Управление пользователями и настройками</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, role: formData.role === 'super_admin' ? 'teacher' : 'super_admin'})}
                      className={`w-12 h-6 rounded-full relative transition-all ${formData.role === 'super_admin' ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.role === 'super_admin' ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Тип доступа</label>
                    <select 
                      required className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                      value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="teacher">Преподаватель</option>
                      <option value="head_of_dept">Заведующий кафедрой</option>
                      <option value="dean">Декан факультета</option>
                      <option value="academic_office">Офис-регистратор</option>
                      <option value="super_admin">Супер Администратор</option>
                    </select>
                  </div>
                </div>

                {/* PERSONAL INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Полное ФИО</label>
                    <input type="text" required className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Email (Логин)</label>
                    <input type="email" required className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                {/* ACADEMIC INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Факультет</label>
                    <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.faculty_id} onChange={e => setFormData({...formData, faculty_id: e.target.value})}>
                      <option value="">Выберите...</option>
                      {options.faculties?.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Кафедра</label>
                    <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                      <option value="">Выберите...</option>
                      {options.departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Должность</label>
                    <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.position_id} onChange={e => setFormData({...formData, position_id: e.target.value})}>
                      <option value="">Выберите...</option>
                      {options.positions?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Ученая степень</label>
                    <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.academic_degree_id} onChange={e => setFormData({...formData, academic_degree_id: e.target.value})}>
                      <option value="">Выберите...</option>
                      {options.degrees?.map(deg => <option key={deg.id} value={deg.id}>{deg.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-1.5">
                      <GraduationCap size={12}/> Академическая специализация
                    </label>
                    <input 
                      type="text" 
                      placeholder="Напр: 6B06101 - Информационные системы"
                      className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-blue-500 outline-none transition-all" 
                      value={formData.academic_specialization} 
                      onChange={e => setFormData({...formData, academic_specialization: e.target.value})} 
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{editingId ? 'Новый пароль' : 'Пароль'}</label>
                    <input type="password" required={!editingId} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={editingId ? "Оставьте пустым" : "••••••••"} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Подтверждение</label>
                    <input type="password" required={!editingId || formData.password !== ''} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none" value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Отмена</button>
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