
import React from 'react';
import { ACHIEVEMENTS, CATEGORIES } from '../constants';
import { UserProgress } from '../types';

const RewardsView: React.FC<{ progress: UserProgress }> = ({ progress }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold">Нагороди</h2>
        <p className="text-zinc-500 text-sm">Ваші досягнення та трофеї</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = progress.achievements.includes(ach.id);
          return (
            <div 
              key={ach.id} 
              className={`p-5 rounded-3xl border transition-all flex items-center gap-5 ${
                isUnlocked ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-950 border-zinc-900 opacity-50 grayscale'
              }`}
            >
              <div className="text-4xl">{ach.icon}</div>
              <div className="flex-1">
                <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>{ach.title}</h4>
                <p className="text-xs text-zinc-500">{ach.description}</p>
              </div>
              {isUnlocked && <span className="text-emerald-500">✔</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Відкриті категорії</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const levels = progress.unlockedLevels[cat.id] || { easy: true, medium: false, hard: false };
            const unlockedCount = Object.values(levels).filter(Boolean).length;
            return (
              <div key={cat.id} className="bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 text-xs flex items-center gap-2">
                <span>{cat.icon}</span>
                <span className="font-bold">{cat.name}</span>
                <span className="text-blue-500">{unlockedCount}/3</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardsView;
