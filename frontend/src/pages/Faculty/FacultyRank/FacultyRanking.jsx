import React from 'react';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award, 
  Medal,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';

const FacultyRanking = () => {
  const faculties = [
    { 
      id: 1, 
      name: 'Факультет Информационных Технологий', 
      short: 'ФИТ', 
      score: 12450, 
      trend: 'up', 
      students: 450, 
      efficiency: 92,
      color: 'bg-blue-500'
    },
    { 
      id: 2, 
      name: 'Инженерно-Технический Факультет', 
      short: 'ИТФ', 
      score: 10800, 
      trend: 'up', 
      students: 380, 
      efficiency: 88,
      color: 'bg-indigo-500'
    },
    { 
      id: 3, 
      name: 'Факультет Экономики и Права', 
      short: 'ФЭиП', 
      score: 9200, 
      trend: 'down', 
      students: 520, 
      efficiency: 74,
      color: 'bg-emerald-500'
    },
    { 
      id: 4, 
      name: 'Гуманитарный Факультет', 
      short: 'ГФ', 
      score: 7500, 
      trend: 'stable', 
      students: 310, 
      efficiency: 65,
      color: 'bg-amber-500'
    },
    { 
      id: 5, 
      name: 'Естественно-Научный Факультет', 
      short: 'ЕНФ', 
      score: 6900, 
      trend: 'up', 
      students: 240, 
      efficiency: 78,
      color: 'bg-rose-500'
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER & TOP STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-[0.2em]">
            <Trophy size={14} fill="currentColor" /> Live Leaderboard
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Битва Факультетов</h1>
          <p className="text-sm text-gray-500 font-medium italic">Обновлено сегодня в 12:00. Лидеры получают грант на развитие.</p>
        </div>

        <div className="bg-slate-900 rounded-[24px] p-6 text-white flex items-center gap-6 shadow-2xl">
           <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Общий фонд баллов</span>
             <span className="text-2xl font-black italic">46,850 KPI</span>
           </div>
           <div className="h-10 w-[1px] bg-slate-800" />
           <Target className="text-blue-400" size={28} />
        </div>
      </div>

      {/* PODIUM SECTION (TOP 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* SECOND PLACE */}
        <div className="order-2 md:order-1 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-4 relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-300" />
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 font-black text-xl italic">2</div>
          <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{faculties[1].short}</h3>
          <p className="text-2xl font-black text-slate-700">{faculties[1].score.toLocaleString()}</p>
          <div className="flex items-center justify-center gap-2 text-[11px] font-black text-green-500 uppercase">
            <TrendingUp size={14} /> +12.4%
          </div>
        </div>

        {/* FIRST PLACE */}
        <div className="order-1 md:order-2 bg-slate-900 p-10 rounded-[48px] shadow-2xl shadow-blue-200 text-center space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-all">
          <div className="absolute top-0 left-0 w-full h-3 bg-blue-500" />
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
             <div className="w-20 h-20 bg-blue-500 text-white rounded-[24px] flex items-center justify-center mx-auto shadow-xl transform -rotate-6 group-hover:rotate-0 transition-transform">
                <Medal size={40} />
             </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-white text-2xl uppercase tracking-tighter">{faculties[0].short}</h3>
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Абсолютный лидер</p>
          </div>
          <p className="text-4xl font-black text-white italic">{faculties[0].score.toLocaleString()}</p>
          <div className="bg-blue-500/10 rounded-2xl py-2 px-4 inline-flex items-center gap-2 text-blue-400 text-xs font-bold">
             <Users size={14} /> {faculties[0].students} активных студентов
          </div>
        </div>

        {/* THIRD PLACE */}
        <div className="order-3 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-4 relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-600/30" />
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 font-black text-xl italic">3</div>
          <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{faculties[2].short}</h3>
          <p className="text-2xl font-black text-slate-700">{faculties[2].score.toLocaleString()}</p>
          <div className="flex items-center justify-center gap-2 text-[11px] font-black text-red-500 uppercase">
            <TrendingDown size={14} /> -4.1%
          </div>
        </div>
      </div>

      {/* DETAILED LIST */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
           <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Полная таблица результатов</h3>
           <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Экспорт PDF</button>
        </div>

        <div className="divide-y divide-gray-50">
          {faculties.map((f, i) => (
            <div key={f.id} className="group flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-6 md:w-1/3">
                <span className="text-2xl font-black text-slate-200 italic w-8 group-hover:text-slate-400 transition-colors">0{i+1}</span>
                <div>
                   <h4 className="font-black text-slate-900 text-sm tracking-tight">{f.name}</h4>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{f.students} участников</span>
                      <div className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Эффективность: {f.efficiency}%</span>
                   </div>
                </div>
              </div>

              {/* Progress Bar (Efficiency) */}
              <div className="hidden md:block flex-1 max-w-xs mx-12">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Заполняемость KPI</span>
                    <span className="text-[9px] font-black text-slate-900 uppercase">{f.efficiency}%</span>
                 </div>
                 <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`${f.color} h-full transition-all duration-1000 delay-300`} 
                      style={{ width: `${f.efficiency}%` }}
                    />
                 </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-10 mt-6 md:mt-0">
                 <div className="text-right">
                    <p className="text-xl font-black text-slate-900 italic tracking-tight">{f.score.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Очков накоплено</p>
                 </div>
                 <button className="p-4 bg-gray-50 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all group">
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-10">
            <Zap size={150} />
         </div>
         <div className="space-y-4 relative z-10">
            <h2 className="text-3xl font-black tracking-tight leading-none italic">Выведи свой факультет <br/> в лидеры сезона!</h2>
            <p className="text-blue-100 text-sm font-medium max-w-md">Каждая поданная активность добавляет очки в копилку твоего факультета. Чем больше студентов участвует — тем выше шанс на победу.</p>
         </div>
         <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl whitespace-nowrap relative z-10">
            Подать активность
         </button>
      </div>

    </main>
  );
};

export default FacultyRanking;