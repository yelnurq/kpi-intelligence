import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Filter, MessageCircle, MoreVertical, 
  ChevronRight, Download, Mail, Phone, GraduationCap,
  AlertCircle, CheckCircle2, ArrowUpDown
} from 'lucide-react';

const StaffManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('Все');
  const [filterStatus, setFilterStatus] = useState('Все');

  // --- ФЕЙКОВЫЕ ДАННЫЕ СОТРУДНИКОВ ---
  const staffData = [
    { id: 1, name: "Ахметов Алихан", role: "Профессор", faculty: "ИТ", kpi: 450, status: "Заполнено", phone: "77011234567" },
    { id: 2, name: "Иванова Мария", role: "Доцент", faculty: "Экономика", kpi: 120, status: "В процессе", phone: "77029876543" },
    { id: 3, name: "Смагулов Берик", role: "Старший преп.", faculty: "ИТ", kpi: 0, status: "Не приступал", phone: "77075554433" },
    { id: 4, name: "Оспанова Дина", role: "Ассистент", faculty: "Медицина", kpi: 310, status: "Заполнено", phone: "77010001122" },
    { id: 5, name: "Петров Игорь", role: "Доцент", faculty: "Экономика", kpi: 45, status: "Не приступал", phone: "77473332211" },
  ];

  const faculties = ['Все', 'ИТ', 'Экономика', 'Медицина', 'Гуманитарный'];
  const statuses = ['Все', 'Заполнено', 'В процессе', 'Не приступал'];

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  const filteredStaff = useMemo(() => {
    return staffData.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFaculty = filterFaculty === 'Все' || user.faculty === filterFaculty;
      const matchesStatus = filterStatus === 'Все' || user.status === filterStatus;
      return matchesSearch && matchesFaculty && matchesStatus;
    });
  }, [searchQuery, filterFaculty, filterStatus]);

  // --- ФУНКЦИЯ РАССЫЛКИ В WHATSAPP ---
  const handleWhatsAppAll = () => {
    const debtors = staffData.filter(s => s.status !== 'Заполнено');
      alert("Запрос отправлен на сервер. Сообщения формируются...");
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">Сотрудники и Кадры</h1>
          <p className="text-sm text-gray-500 font-medium">Управление доступом, мониторинг активности и связь.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleWhatsAppAll}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <MessageCircle size={18} /> Напомнить в WhatsApp
          </button>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow min-w-[250px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Поиск по ФИО..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 ring-blue-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100">
          <GraduationCap size={16} className="text-gray-400" />
          <select 
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 cursor-pointer"
          >
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100">
          <Filter size={16} className="text-gray-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 cursor-pointer"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* STAFF LIST TABLE */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-gray-50">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Сотрудник</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Статус плана</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Баллы KPI</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStaff.map((person) => (
              <tr key={person.id} className="group hover:bg-slate-50/30 transition-all">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{person.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{person.role} • {person.faculty}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className={`
                      flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight
                      ${person.status === 'Заполнено' ? 'bg-emerald-50 text-emerald-600' : 
                        person.status === 'В процессе' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}
                    `}>
                      {person.status === 'Заполнено' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                      {person.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-center">
                    <span className="text-sm font-black text-slate-900 tracking-tighter">{person.kpi}</span>
                    <span className="text-[10px] text-gray-400 ml-1 font-bold">/ 600</span>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full mx-auto mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${person.kpi > 300 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                        style={{ width: `${(person.kpi / 600) * 100}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-end items-center gap-2">
                    <a 
                      href={`https://wa.me/${person.phone}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                      title="Написать лично"
                    >
                      <MessageCircle size={18} />
                    </a>
                    <button className="p-2.5 text-gray-300 hover:text-slate-900 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                    <button className="p-2 text-gray-300 hover:text-blue-600 transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredStaff.length === 0 && (
          <div className="p-20 text-center">
            <Users size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Никто не найден</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default StaffManagement;