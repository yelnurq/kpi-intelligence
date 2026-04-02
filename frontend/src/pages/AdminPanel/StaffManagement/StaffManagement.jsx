import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, UserPlus, Mail, Building2, Filter, 
  ChevronRight, Loader2, Trash2, Edit2, X, 
  ShieldCheck, Users, UserCheck, UserMinus, 
  ArrowRight, Shield, User, GraduationCap,
  Phone
} from 'lucide-react';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

const StatCard = ({ icon: Icon, label, value, colorClass, description, isPrimary, unit = "чел." }) => (
  <div className={`bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md ${isPrimary ? 'ring-1 ring-blue-600/10' : ''}`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${isPrimary ? 'bg-blue-600' : 'bg-slate-200'}`} />
    <div className="flex justify-between items-start mb-3 md:mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tighter">{value}</h3>
          <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      <div className={`p-2 md:p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={16} className="md:w-[18px] md:h-[18px]" />
      </div>
    </div>
    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tight text-left leading-tight">{description}</p>
  </div>
);

const ListSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-[120px] md:h-[100px] bg-white border border-slate-100 rounded-2xl w-full" />
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
  
  // Внутри StaffManagement
const [formData, setFormData] = useState({
  name: '', email: '', mobile: '', // <--- Добавлено
  password: '', password_confirmation: '',
  faculty_id: '', department_id: '', position_id: '', academic_degree_id: '',
  academic_specialization: '', 
  role: 'teacher' 
});



  const API_BASE = 'http://10.0.1.54:8000/api';
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
// Блокировка скролла body при открытии модалки
useEffect(() => {
  if (isModalOpen) {
    // Сохраняем текущий стиль, чтобы не испортить другие инлайновые стили, если они есть
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    // Возвращаем исходное состояние при закрытии
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }
}, [isModalOpen]);
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
    name: '', email: '', mobile: '', // <--- Добавлено
    password: '', password_confirmation: '',
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

  const SPECIALIZATION_CATEGORIES = [
    'учеб.работа',
    'учебно-методическая работа',
    'организационно-методическая работа',
    'научно-исследовательская работа',
    'воспитательная работа',
    'профориентационная работа'
  ];

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
        mobile: user.mobile || '',
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

  const getSpecializationPlaceholder = () => {
    const selectedFacObj = options.faculties?.find(f => f.id.toString() === formData.faculty_id);
    const facultyName = selectedFacObj ? selectedFacObj.name : "факультета";

    switch (formData.role) {
      case 'dean': return `Декан какого факультета? (напр: ${facultyName})`;
      case 'head_of_dept': return `Зав. кафедрой (напр: Кафедра ИТ)`;
      case 'teacher': return "Напр: 6B06101 - Информационные системы";
      case 'academic_office': return "Укажите отдел или специализацию в офисе";
      case 'super_admin': return "Специализация для администратора (необязательно)";
      default: return "Введите специализацию...";
    }
  };

  return (
    <main className="border rounded-lg mx-auto px-4 md:px-10 py-6 md:py-10 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-10">
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tighter">Управление штатом</h1>
            <p className="flex items-center gap-2 mt-1 md:mt-2 text-xs md:text-sm text-gray-500 leading-tight">Система ролей и академических данных сотрудников</p>
          </div>

        <button 
          onClick={handleOpenCreateModal}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3.5 rounded-2xl text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <UserPlus size={18} />
          Добавить сотрудника
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard label="Общий" value={apiStats.total} icon={Users} colorClass="bg-slate-100 text-slate-600" description="Всего в системе" />
        <StatCard label="Активны" value={apiStats.active} icon={UserCheck} colorClass="bg-emerald-100 text-emerald-600" description="Заполнили KPI" isPrimary={true} />
        <StatCard label="Пустые" value={apiStats.new} icon={UserMinus} colorClass="bg-amber-100 text-amber-600" description="Новые профили" />
        <StatCard label="Админы" value={apiStats.admins} icon={ShieldCheck} colorClass="bg-blue-100 text-blue-600" description="Права управления" />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative group w-full flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Поиск по ФИО..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="relative group w-full md:w-[300px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-[10px] md:text-[11px] font-bold uppercase tracking-wider appearance-none focus:border-blue-500 outline-none cursor-pointer shadow-sm"
          >
            <option value="all">Все подразделения</option>
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative min-h-[300px]">
        {loading && users.length > 0 && (
          <div className="absolute inset-0 z-10 bg-slate-50/40 backdrop-blur-[1px] flex items-start justify-center pt-20">
            <div className="bg-white px-6 py-3 rounded-full shadow-xl border border-slate-100 flex items-center gap-3">
              <Loader2 className="animate-spin text-blue-600" size={18} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Обновление...</span>
            </div>
          </div>
        )}

        {loading && users.length === 0 ? (
          <ListSkeleton />
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
              <div key={user.id} className={`bg-white p-5 md:p-6 rounded-2xl border transition-all group ${user.role === 'super_admin' ? 'border-blue-100 shadow-sm' : 'border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                  
                  {/* User Main Info */}
                  <div className="flex items-start md:items-center gap-4 w-full lg:w-auto text-left">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all font-bold text-lg md:text-xl shrink-0 ${user.role === 'super_admin' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm md:text-base truncate max-w-[200px] md:max-w-none">{user.name}</h4>
                        <div className="flex items-center gap-1">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${user.auth_type === 'ldap' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                {user.auth_type === 'ldap' ? 'LDAP' : 'local'}
                            </span>
                            {user.role === 'super_admin' ? <Shield size={14} className="text-blue-600" /> : <User size={14} className="text-slate-300" />}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-[10px] md:text-[11px] font-medium mt-1 uppercase tracking-tight">
                        <span className="flex items-center gap-1.5 truncate max-w-[150px] md:max-w-none"><Mail size={12} className="shrink-0" /> {user.email}</span>
                        {user.mobile && (
                            <span className="flex items-center gap-1.5 shrink-0">
                              <Phone size={12} className="shrink-0" /> {user.mobile}
                            </span>
                          )}
                        <span className="flex items-center gap-1.5 shrink-0"><Building2 size={12} className="shrink-0" /> {user.faculty_short}</span>
                        {user.role !== 'teacher' && user.role !== 'super_admin' && (
                          <span className="text-blue-500 font-bold uppercase tracking-tight shrink-0">
                            [{user.role === 'academic_office' ? (user.academic_specialization || 'Офис-регистратор') : user.role}]
                          </span>
                        )}           
                      </div>
                    </div>
                  </div>

                  {/* Actions & Academic */}
                  <div className="flex flex-row items-center justify-between lg:justify-end gap-4 md:gap-8 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right min-w-0">
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.position || 'Должность...'}</p>
                      <p className="text-[11px] md:text-xs font-bold text-slate-700 truncate">{user.academic_degree || 'Без степени'}</p>
                      {user.academic_specialization && (
                        <p className="text-[9px] font-medium text-blue-500 italic mt-0.5 max-w-[150px] md:max-w-[180px] leading-tight truncate">{user.academic_specialization}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-4">
                        <span className={`hidden sm:block px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${
                          user.activities_count > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                          {user.activities_count > 0 ? `Активен (${user.activities_count})` : 'Нет заявок'}
                        </span>
                        
                        <div className="flex items-center gap-1 md:gap-2 border-l border-slate-100 pl-4 md:pl-6">
                          <button onClick={() => handleEditClick(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={18}/></button>
                          <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18}/></button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 border-dashed p-10 md:p-20 text-center">
             <Users size={32} className="text-slate-200 mx-auto mb-4 md:mb-6" />
             <h3 className="text-lg md:text-xl font-bold text-slate-900">Пользователи не найдены</h3>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {meta.last_page > 1 && (
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Страница {currentPage} из {meta.last_page}</p>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="flex-1 md:flex-none px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-100 disabled:opacity-50">Назад</button>
            <button disabled={currentPage === meta.last_page} onClick={() => setCurrentPage(p => p + 1)} className="flex-1 md:flex-none px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-100 disabled:opacity-50">Вперед</button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl max-h-[95vh] rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
              <X size={20} />
            </button>

            <div className="p-6 md:p-8 pb-4 text-left border-b border-slate-50">
              <h3 className="text-xl font-bold text-slate-900 tracking-tighter">
                {editingId ? 'Редактирование' : 'Новый сотрудник'}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Параметры доступа и академический профиль
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                
                {/* ROLE */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${formData.role === 'super_admin' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                        <Shield size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Super Admin</p>
                        <p className="text-[9px] text-slate-500 font-medium italic">Полный доступ к системе</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, role: formData.role === 'super_admin' ? 'teacher' : 'super_admin'})}
                      className={`w-10 h-5 rounded-full relative transition-all ${formData.role === 'super_admin' ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${formData.role === 'super_admin' ? 'left-5.5' : 'left-0.5'}`} />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Тип доступа</label>
                    <select 
                      required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none appearance-none"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">ФИО</label>
                    <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Email</label>
                    <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Мобильный номер</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="+7 (___) ___ __ __" />
                  </div>
                </div>

                {/* ACADEMIC INFO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Факультет</label>
                    <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[13px] font-bold outline-none" value={formData.faculty_id} onChange={e => setFormData({...formData, faculty_id: e.target.value})}>
                      <option value="">Выберите...</option>
                      {options.faculties?.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Кафедра</label>
                    <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[13px] font-bold outline-none" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                      <option value="">Выберите...</option>
                      {options.departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Должность</label>
                    <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[13px] font-bold outline-none" value={formData.position_id} onChange={e => setFormData({...formData, position_id: e.target.value})}>
                      <option value="">Выберите...</option>
                      {options.positions?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Степень</label>
                    <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[13px] font-bold outline-none" value={formData.academic_degree_id} onChange={e => setFormData({...formData, academic_degree_id: e.target.value})}>
                      <option value="">Выберите...</option>
                      {options.degrees?.map(deg => <option key={deg.id} value={deg.id}>{deg.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-1.5"><GraduationCap size={12}/> Специализация / Отдел</label>
                    {formData.role === 'academic_office' ? (
                      <select required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.academic_specialization} onChange={e => setFormData({...formData, academic_specialization: e.target.value})}>
                        <option value="">Выберите категорию...</option>
                        {SPECIALIZATION_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                      </select>
                    ) : (
                      <input type="text" placeholder={getSpecializationPlaceholder()} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.academic_specialization} onChange={e => setFormData({...formData, academic_specialization: e.target.value})} />
                    )}
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">{editingId ? 'Новый пароль' : 'Пароль'}</label>
                    <input type="password" required={!editingId} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Подтверждение</label>
                    <input type="password" required={!editingId || formData.password !== ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} placeholder="••••••••" />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 md:gap-4 pt-4 pb-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Отмена</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <>{editingId ? 'Обновить' : 'Сохранить'} <ArrowRight size={16} /></>}
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