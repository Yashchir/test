
import React, { useState } from 'react';
import { COURSES, CATEGORIES } from '../constants';
import { Course, Difficulty } from '../types';

interface AcademyViewProps {
  onStartTest: (categoryId: string, difficulty: Difficulty) => void;
}

const AcademyView: React.FC<AcademyViewProps> = ({ onStartTest }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Difficulty>('easy');
  const [selectedFact, setSelectedFact] = useState<string | null>(null);

  if (selectedFact) {
    const [title, description] = selectedFact.split(':').map(s => s.trim());
    return (
      <div className="fixed inset-0 z-[150] bg-black/95 ios-blur animate-in fade-in zoom-in duration-300 flex flex-col p-8 safe-area-bottom">
        <button 
          onClick={() => setSelectedFact(null)}
          className="self-end mb-8 bg-zinc-800 w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 font-bold"
        >
          ✕
        </button>
        
        <div className="flex-1 flex flex-col justify-center text-center">
          <div className="w-24 h-24 bg-blue-600/20 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8 border border-blue-500/30">
            {selectedCourse?.icon}
          </div>
          <h2 className="text-4xl font-black mb-6 tracking-tight text-white leading-tight">
            {title || "Термін"}
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-10 rounded-full" />
          <p className="text-xl text-zinc-300 leading-relaxed font-medium px-4">
            {description || selectedFact}
          </p>
        </div>

        <button 
          onClick={() => setSelectedFact(null)}
          className="mt-auto w-full bg-white text-black py-5 rounded-3xl font-black text-xl shadow-2xl active:scale-95 transition-all"
        >
          Зрозуміло
        </button>
      </div>
    );
  }

  if (selectedCourse) {
    const facts = selectedCourse.levels[selectedLevel];
    
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="mb-6 text-blue-500 flex items-center gap-1 font-bold text-sm uppercase tracking-wider"
        >
          ← Список курсів
        </button>
        
        <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedLevel === lvl 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-zinc-500'
              }`}
            >
              {lvl === 'easy' ? 'Новачок' : lvl === 'medium' ? 'Адепт' : 'Майстер'}
            </button>
          ))}
        </div>

        <section className="mb-8">
          <div className="flex items-center gap-4 mb-8 bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
            <div className="text-4xl bg-zinc-800 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">
              {selectedCourse.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black leading-tight">{selectedCourse.title}</h2>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                {selectedLevel} рівень
              </p>
            </div>
          </div>

          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 px-2">Теми для вивчення:</p>
          <div className="space-y-3">
            {facts.map((fact, i) => {
              const term = fact.split(':')[0];
              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedFact(fact)}
                  className="w-full flex justify-between items-center bg-zinc-900 p-5 rounded-2xl border border-zinc-800 group active:scale-[0.98] transition-all"
                >
                  <div className="flex gap-4 items-center">
                    <span className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-500 flex items-center justify-center font-black text-xs">
                      {i + 1}
                    </span>
                    <span className="text-zinc-200 font-bold text-lg text-left">{term}</span>
                  </div>
                  <span className="text-zinc-700 group-hover:text-blue-500 transition-colors">➔</span>
                </button>
              );
            })}
          </div>
        </section>
        
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col items-center text-center gap-4">
          <div className="text-sm text-zinc-500 font-medium italic">Вивчили всі терміни?</div>
          <button 
            onClick={() => onStartTest(selectedCourse.categoryId, selectedLevel)}
            className="w-full bg-white text-black py-5 rounded-2xl font-black text-xl shadow-xl active:scale-[0.97] transition-all"
          >
            Скласти іспит
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-black tracking-tighter">Академія</h2>
        <p className="text-zinc-500 font-medium">Опануй базу для перемоги</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {COURSES.map((course) => (
          <button
            key={course.id}
            onClick={() => {
              setSelectedCourse(course);
              setSelectedLevel('easy');
            }}
            className="group bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 flex items-center gap-5 text-left active:scale-[0.98] transition-all relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              {course.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-xl mb-1">{course.title}</h4>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                {CATEGORIES.find(c => c.id === course.categoryId)?.name}
              </p>
            </div>
            <div className="text-zinc-700 font-black text-2xl group-hover:text-blue-500 transition-colors">→</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AcademyView;
