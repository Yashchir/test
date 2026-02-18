
import React from 'react';
import { UserProgress } from '../types';

const StatsView: React.FC<{ progress: UserProgress }> = ({ progress }) => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const today = new Date().toISOString().split('T')[0];
  
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold">Особистий кабінет</h2>
        <p className="text-zinc-500 text-sm">Твої досягнення та активність</p>
      </header>

      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-6 relative overflow-hidden">
        <div className={`w-20 h-20 ${progress.profile.avatarColor} rounded-3xl flex items-center justify-center text-4xl border border-white/20 shadow-inner`}>
          {progress.profile.avatar}
        </div>
        <div className="z-10">
          <h3 className="text-2xl font-black tracking-tight">{progress.profile.name}</h3>
          <div className="flex gap-2 mt-1">
             <span className="bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase px-2 py-1 rounded-md border border-blue-500/20">LVL {progress.level}</span>
             <span className="bg-amber-500/20 text-amber-400 text-[8px] font-black uppercase px-2 py-1 rounded-md border border-amber-500/20">{progress.totalScore} SCORE</span>
          </div>
        </div>
        <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-5 pointer-events-none italic font-black">PRO</div>
      </div>

      <section className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
        <h3 className="text-[10px] font-black text-zinc-500 mb-6 uppercase tracking-[0.2em]">Активність</h3>
        <div className="flex justify-between items-center">
          {last7Days.map((date, i) => {
            const hasActivity = progress.activityCalendar.includes(date);
            const isToday = date === today;
            return (
              <div key={date} className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-zinc-600 font-bold">{days[new Date(date).getDay() === 0 ? 6 : new Date(date).getDay() - 1]}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  hasActivity ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white' : 
                  isToday ? 'border-2 border-blue-500 text-blue-500' : 'bg-zinc-800 text-zinc-700'
                }`}>
                  {hasActivity ? '✓' : '•'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">
          <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Точність</p>
          <p className="text-3xl font-black text-blue-500">
            {progress.completedQuizzes > 0 ? Math.round((progress.correctAnswers / (progress.completedQuizzes * 20)) * 100) : 0}%
          </p>
        </div>
        <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">
          <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Вікторини</p>
          <p className="text-3xl font-black text-purple-500">{progress.completedQuizzes}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
