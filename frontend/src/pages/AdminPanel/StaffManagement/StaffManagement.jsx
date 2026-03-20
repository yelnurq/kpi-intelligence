import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, UserPlus, Mail, Building2, Filter, 
  Download, ChevronRight, Loader2, Trash2, 
  Edit2, X, ShieldCheck, Key, GraduationCap, MapPin
} from 'lucide-react';

const StaffManagement = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [faculties, setFaculties] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState({ faculties: [], departments: [], positions: [], degrees: [] });
  
  // ОБНОВЛЕНО: Добавлены department_id и academic_degree_id
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    password_confirmation: '',
    faculty_id: '', 
    department_id: '', 
    position_id: '', 
    academic_degree_id: '',
    role: 'user'
  });

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json' 
        }
      });
      const result = await res.json();
      if (result.status === 'success') {
        setUsers(result.data || []);
        const uniqueNames = [...new Set((result.data || []).map(u => u.faculty))].filter(Boolean);
        setFaculties(uniqueNames);
      }
    } catch (error) {
      console.error("Ошибка при загрузке сотрудников:", error);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  const fetchOptions = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/helpers/user-options`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOptions(data);
    } catch (error) {
      console.error("Ошибка загрузки справочников:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
        setFormData({
          name: '', email: '', password: '', password_confirmation: '',
          faculty_id: '', department_id: '', position_id: '', academic_degree_id: '',
          role: 'user'
        });
      } else {
        alert(result.message || "Ошибка при заполнении формы");
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = selectedFaculty === 'all' || user.faculty === selectedFaculty;
    return matchesSearch && matchesFaculty;
  });

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Синхронизация штата...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Управление персоналом</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Сотрудники и ППС</h1>
        </div>

        <button 
          onClick={() => { fetchOptions(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-200 group"
        >
          <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
          Добавить сотрудника
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Поиск по ФИО или Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[22px] text-sm font-bold focus:outline-none focus:ring-4 ring-blue-50 transition-all shadow-sm"
          />
        </div>

        <div className="md:col-span-4 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-[22px] text-[11px] font-black uppercase tracking-wider appearance-none focus:outline-none focus:ring-4 ring-blue-50 transition-all cursor-pointer shadow-sm"
          >
            <option value="all">Все подразделения</option>
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-[35px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Сотрудник</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Подразделение</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Статус KPI</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner font-black text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-none">{user.name}</h4>
                        <div className="flex items-center gap-2 mt-1.5 text-slate-400">
                          <Mail size={12} />
                          <span className="text-xs font-medium">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{user.faculty}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.position}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      user.activities_count > 0 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {user.activities_count > 0 ? `Активен (${user.activities_count})` : 'Нет заявок'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={18}/></button>
                      <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADD USER */}
      {isModalOpen && (
        <div style={{marginTop:0}} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-[45px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Регистрация</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Добавление нового сотрудника в штат</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-6">
                {/* Личные данные */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Полное имя</label>
                    <input 
                      type="text" required placeholder="Имя Фамилия"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-blue-50 transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Электронная почта</label>
                    <input 
                      type="email" required placeholder="email@kazutb.kz"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-blue-50 transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                {/* Организационные данные: Факультет и Кафедра */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Факультет</label>
                    <div className="relative">
                       <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                       <select 
                        required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none"
                        value={formData.faculty_id}
                        onChange={e => setFormData({...formData, faculty_id: e.target.value})}
                      >
                        <option value="">Выберите факультет</option>
                        {options.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Кафедра</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                       <select 
                        required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none"
                        value={formData.department_id}
                        onChange={e => setFormData({...formData, department_id: e.target.value})}
                      >
                        <option value="">Выберите кафедру</option>
                        {options.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Квалификационные данные: Должность и Степень */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Должность</label>
                    <select 
                      required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                      value={formData.position_id}
                      onChange={e => setFormData({...formData, position_id: e.target.value})}
                    >
                      <option value="">Выберите должность</option>
                      {options.positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Ученая степень</label>
                    <div className="relative">
                       <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                       <select 
                        required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none"
                        value={formData.academic_degree_id}
                        onChange={e => setFormData({...formData, academic_degree_id: e.target.value})}
                      >
                        <option value="">Выберите степень</option>
                        {options.degrees.map(deg => <option key={deg.id} value={deg.id}>{deg.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Безопасность */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-50 pt-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Пароль</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="password" required placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Подтверждение</label>
                    <input 
                      type="password" required placeholder="••••••••"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                      value={formData.password_confirmation}
                      onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-5 bg-slate-900 hover:bg-blue-600 text-white rounded-[25px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                    Завершить регистрацию
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;