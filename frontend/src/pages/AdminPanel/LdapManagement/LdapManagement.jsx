import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Users, Loader2, RefreshCw, 
  UserPlus, Mail, Building2, Shield, 
  CheckCircle2, Globe, Database, ArrowRight, UserCheck
} from 'lucide-react';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---
const StatCard = ({ icon: Icon, label, value, colorClass, description }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-left">{description}</p>
  </div>
);

const LdapManagement = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [importingEmail, setImportingEmail] = useState(null); // Для индикации импорта конкретного юзера
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, inLdap: 0, imported: 0 });

  const API_BASE = 'http://10.0.1.54:8000/api';
  const token = localStorage.getItem("token");

  const fetchLdapUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/ldap/users`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const result = await res.json();
      if (result.status === 'success') {
        setUsers(result.users || []);
        setStats(prev => ({ ...prev, total: result.total_found, inLdap: result.total_found }));
      }
    } catch (error) {
      console.error("Ошибка LDAP:", error);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  useEffect(() => { fetchLdapUsers(); }, [fetchLdapUsers]);

  // Импорт ОДНОГО пользователя
  const handleImportSingle = async (user) => {
    setImportingEmail(user.email);
    try {
      const res = await fetch(`${API_BASE}/admin/ldap/import-single`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
// Внутри handleImportSingle измените body запроса:
body: JSON.stringify({ 
    email: user.email, 
    name: user.name // Передаем имя для запасного поиска
})      });
      
      const result = await res.json();
      if (res.ok) {
        alert(`Пользователь ${user.name} успешно добавлен в систему!`);
      } else {
        alert(result.message || "Ошибка импорта");
      }
    } catch (e) {
      alert("Сетевая ошибка");
    } finally {
      setImportingEmail(null);
    }
  };

  const handleSyncAll = async () => {
    if (!window.confirm("Начать синхронизацию всех пользователей?")) return;
    setSyncing(true);
    try {
      const res = await fetch(`${API_BASE}/admin/ldap/sync-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) alert("Синхронизация завершена успешно");
    } catch (e) {
      alert("Ошибка при синхронизации");
    } finally {
      setSyncing(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <main className="mx-auto px-4 md:px-10 py-10 bg-[#f8fafc] min-h-screen font-sans border rounded-lg">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Active Directory (LDAP)</h1>
          <p className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Globe size={14} className="text-blue-500" /> 
            Университетский сервер: 10.0.1.30
          </p>
        </div>

        <div className="flex gap-3">
            <button onClick={fetchLdapUsers} className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Обновить
            </button>
            <button onClick={handleSyncAll} disabled={syncing} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-200 disabled:opacity-50">
                {syncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                Синхронизировать всех
            </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Найдено в AD" value={stats.total} icon={Database} colorClass="bg-slate-100 text-slate-600" description="Всего записей" />
        <StatCard label="Результаты поиска" value={filteredUsers.length} icon={Users} colorClass="bg-blue-100 text-blue-600" description="Отфильтровано" />
        <StatCard label="Статус сервера" value="Online" icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600" description="Соединение установлено" />
      </div>

      {/* SEARCH */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Поиск по ФИО или Email в LDAP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-blue-500 outline-none shadow-sm"
        />
      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} /></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUsers.map((user, idx) => (
              <div key={idx} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                    {user.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                      <span className="flex items-center gap-1"><Mail size={12}/> {user.userPrincipalName}</span>
                      <span className="flex items-center gap-1"><Building2 size={12}/> {user.company}</span>
                      <span className="flex items-center gap-1"><Building2 size={12}/> {user.mobile}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.position || 'Сотрудник'}</p>
                    </div>
                    <button 
                        onClick={() => handleImportSingle(user)}
                        disabled={importingEmail === user.email}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                        {importingEmail === user.email ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                        Импорт
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default LdapManagement;