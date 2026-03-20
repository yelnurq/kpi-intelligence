import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, UserPlus, MoreVertical, Mail, 
  Shield, Building2, MapPin, ExternalLink,
  Filter, Download, ChevronRight, Loader2,
  Trash2, Edit2
} from 'lucide-react';

const StaffManagement = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [faculties, setFaculties] = useState([]);

  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem("token");

  // Загрузка списка пользователей
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
        // Извлекаем уникальные факультеты для фильтра
        const uniqueFaculties = [...new Set((result.data || []).map(u => u.faculty))].filter(Boolean);
        setFaculties(uniqueFaculties);
      }
    } catch (error) {
      console.error("Ошибка при загрузке сотрудников:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Логика фильтрации на клиенте
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = selectedFaculty === 'all' || user.faculty === selectedFaculty;
    return matchesSearch && matchesFaculty;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Загрузка штата...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Управление персоналом</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Сотрудники и ППС</h1>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-200">
          <UserPlus size={18} />
          Добавить сотрудника
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Поиск по ФИО или Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[20px] text-sm font-bold focus:outline-none focus:ring-4 ring-blue-50 transition-all shadow-sm"
          />
        </div>

        <div className="md:col-span-4 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-[20px] text-[11px] font-black uppercase tracking-wider appearance-none focus:outline-none focus:ring-4 ring-blue-50 transition-all cursor-pointer shadow-sm"
          >
            <option value="all">Все подразделения</option>
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={14} />
        </div>
      </div>

      {/* USERS TABLE/GRID */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
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
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                      <span className="font-black text-sm">{user.name.charAt(0)}</span>
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
                    <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{user.faculty || '—'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.position || 'Преподаватель'}</p>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      user.activities_count > 0 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {user.activities_count > 0 ? 'Активен' : 'Нет заявок'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Редактировать">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Удалить">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Сотрудники не найдены</p>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="flex justify-between items-center px-4 opacity-60">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Всего в системе: {users.length} пользователей
        </p>
        <div className="flex gap-2">
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            <Download size={16} className="text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;