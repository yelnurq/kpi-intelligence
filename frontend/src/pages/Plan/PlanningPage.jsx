import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Info, CheckCircle2, 
  ChevronRight, BookOpen, PenTool, Globe, Trash2
} from 'lucide-react';

// Данные индикаторов (без изменений)
const indicators = [
  { id: 1, category: 'Наука', title: 'Публикация в Scopus/WoS', points: 100, desc: 'Статья в журналах 1, 2, 3 квартиля', difficulty: 'Высокая' },
  { id: 2, category: 'Наука', title: 'Публикация в КОКСНВО', points: 50, desc: 'Статья в перечне рекомендованных изданий', difficulty: 'Средняя' },
  { id: 3, category: 'Метод.раб', title: 'Разработка учебного пособия', points: 70, desc: 'Издание пособия с ISBN и рекомендацией УМС', difficulty: 'Средняя' },
  { id: 4, category: 'Метод.раб', title: 'Курс повышения квалификации', points: 30, desc: 'Сертификат более 72 часов по профилю', difficulty: 'Низкая' },
  { id: 5, category: 'Общ.деят', title: 'Кураторство группы', points: 40, desc: 'Активное участие в воспитательной работе', difficulty: 'Средняя' },
  { id: 6, category: 'Общ.деят', title: 'Организация конференции', points: 80, desc: 'Международный или республиканский уровень', difficulty: 'Высокая' },
];

const categories = ['Все', 'Наука', 'Метод.раб', 'Общ.деят'];

const PlanningPage = () => {
  const [selectedIds, setSelectedIds] = useState([1, 4]);
  const [activeTab, setActiveTab] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleIndicator = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalPoints = indicators
    .filter(item => selectedIds.includes(item.id))
    .reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      
      {/* 1. ВЕРХНЯЯ ПАНЕЛЬ (Header) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold border-r pr-4 border-gray-200">Планирование KPI</h1>
            <p className="text-sm text-gray-500">Сезон: Весна 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Всего баллов</p>
              <p className="text-xl font-black text-blue-600">{totalPoints} / 600</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all">
              Сохранить план
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 2. ЛЕВАЯ КОЛОНКА: ВЫБОР ИНДИКАТОРОВ */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ФИЛЬТРЫ И ПОИСК */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                      activeTab === cat ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Найти индикатор..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* СПИСОК КАРТОЧЕК */}
            <div className="grid grid-cols-1 gap-4">
              {indicators
                .filter(item => activeTab === 'Все' || item.category === activeTab)
                .map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleIndicator(item.id)}
                      className={`flex items-center gap-6 p-5 bg-white border rounded-xl transition-all cursor-pointer group ${
                        isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {item.category === 'Наука' ? <Globe size={20} /> : item.category === 'Метод.раб' ? <BookOpen size={20} /> : <PenTool size={20} />}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-slate-900">{item.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wide">
                            {item.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="text-lg font-bold text-slate-900">{item.points} <span className="text-xs text-gray-400 font-normal">баллов</span></div>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-transparent group-hover:border-gray-400'
                        }`}>
                          <CheckCircle2 size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 3. ПРАВАЯ КОЛОНКА: ВЫБРАННОЕ И ИТОГИ */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* КАРТОЧКА РЕЗУЛЬТАТОВ */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-slate-900">Ваш выбор</h3>
                <p className="text-xs text-gray-500 mt-1">Индикаторы, добавленные в план</p>
              </div>
              
              <div className="p-6 space-y-4">
                {selectedIds.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4 italic">Ничего не выбрано</p>
                ) : (
                  indicators.filter(i => selectedIds.includes(i.id)).map(item => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{item.title}</span>
                        <span className="text-[10px] text-blue-500 font-bold">{item.points} баллов</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleIndicator(item.id); }}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Итоговая цель:</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-slate-900">{totalPoints}</span>
                      <span className="text-sm text-gray-400 font-bold ml-1">/ 600</span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full transition-all duration-500 ${totalPoints >= 450 ? 'bg-green-500' : 'bg-blue-600'}`}
                      style={{ width: `${Math.min((totalPoints / 600) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-gray-400 text-center">Минимум для подтверждения: 450 баллов</p>
                </div>
              </div>
            </div>

            {/* ИНФО-БЛОК */}
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
              <div className="flex gap-3">
                <Info size={20} className="text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900 mb-1">Информация</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Выбранные индикаторы будут отправлены на утверждение зав. кафедрой. После утверждения вы не сможете удалить их из плана самостоятельно.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanningPage;