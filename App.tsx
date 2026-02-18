
import React, { useState, useEffect } from 'react';
import { AppTab, Category, UserProgress, Difficulty, UserProfile } from './types';
import { CATEGORIES } from './constants';
import TabNavigation from './components/TabNavigation';
import QuizView from './components/QuizView';
import AcademyView from './components/AcademyView';
import StatsView from './components/StatsView';
import RewardsView from './components/RewardsView';
import OnboardingView from './components/OnboardingView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('pokermaster_progress');
    const defaultUnlockedLevels = CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = { easy: true, medium: true, hard: true };
      return acc;
    }, {} as any);

    if (saved) {
      return JSON.parse(saved);
    }

    return {
      hasCompletedOnboarding: false,
      profile: { name: '', avatar: '👤', avatarColor: 'bg-zinc-800' },
      totalScore: 0,
      completedQuizzes: 0,
      correctAnswers: 0,
      level: 1,
      unlockedLevels: defaultUnlockedLevels,
      activityCalendar: [],
      achievements: []
    };
  });

  const [activeQuiz, setActiveQuiz] = useState<{ cat: Category; diff: Difficulty; isDaily: boolean } | null>(null);

  useEffect(() => {
    localStorage.setItem('pokermaster_progress', JSON.stringify(progress));
  }, [progress]);

  const handleOnboardingComplete = (profile: UserProfile, score: number) => {
    setProgress(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      profile,
      totalScore: score * 50,
      correctAnswers: score,
      level: 1
    }));
  };

  const handleQuizComplete = (correctCount: number) => {
    if (!activeQuiz) return;
    
    const { isDaily, diff } = activeQuiz;
    const isPerfect = correctCount === (isDaily ? 15 : 20);
    const today = new Date().toISOString().split('T')[0];

    setProgress(prev => {
      const newAchievements = [...prev.achievements];
      if (isPerfect && diff === 'easy' && !newAchievements.includes('perfect-easy')) newAchievements.push('perfect-easy');
      if (!newAchievements.includes('first-win')) newAchievements.push('first-win');
      
      const newActivity = prev.activityCalendar.includes(today) ? prev.activityCalendar : [...prev.activityCalendar, today];

      return {
        ...prev,
        totalScore: prev.totalScore + (correctCount * 10),
        correctAnswers: prev.correctAnswers + correctCount,
        completedQuizzes: prev.completedQuizzes + 1,
        level: Math.floor((prev.totalScore + (correctCount * 10)) / 1000) + 1,
        activityCalendar: newActivity,
        achievements: newAchievements
      };
    });

    setActiveQuiz(null);
    setActiveTab(AppTab.STATS);
  };

  const startQuiz = (cat: Category, diff: Difficulty, isDaily: boolean = false) => {
    setActiveQuiz({ cat, diff, isDaily });
  };

  if (!progress.hasCompletedOnboarding) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  if (activeQuiz) {
    return (
      <QuizView 
        category={activeQuiz.cat}
        difficulty={activeQuiz.diff}
        isDaily={activeQuiz.isDaily}
        onComplete={handleQuizComplete}
        onClose={() => setActiveQuiz(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <header className="px-6 pt-12 pb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${progress.profile.avatarColor} rounded-2xl flex items-center justify-center text-2xl border border-white/10 shadow-lg`}>
            {progress.profile.avatar}
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none">{progress.profile.name}</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Рівень {progress.level}</p>
          </div>
        </div>
        <div className="bg-blue-600 px-4 py-2 rounded-2xl text-xs font-black shadow-lg shadow-blue-600/20 border border-blue-400">
          {progress.totalScore} 💎
        </div>
      </header>

      <main className="px-6">
        {activeTab === AppTab.HOME && (
          <div className="space-y-8">
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <h2 className="text-xl font-bold mb-1">Daily Training</h2>
              <p className="text-white/70 text-sm mb-4">15 рандомних питань зі всіх категорій.</p>
              <button 
                onClick={() => startQuiz(CATEGORIES[0], 'easy', true)}
                className="bg-white text-indigo-900 px-6 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform"
              >
                Грати зараз
              </button>
              <div className="absolute right-[-10px] bottom-[-10px] text-8xl opacity-10">📅</div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-400 uppercase text-[10px] tracking-[0.2em]">
                <span>Категорії</span>
                <span className="h-px flex-1 bg-zinc-800"></span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {cat.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{cat.name}</h4>
                        <p className="text-xs text-zinc-500">{cat.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                        <button
                          key={d}
                          onClick={() => startQuiz(cat, d, false)}
                          className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            d === 'easy' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                            d === 'medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                            'bg-rose-500/10 border-rose-500/30 text-rose-500'
                          } active:scale-95`}
                        >
                          {d === 'easy' ? 'Легко' : d === 'medium' ? 'Норм' : 'Профі'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === AppTab.ACADEMY && (
          <AcademyView onStartTest={(cid, diff) => {
            const cat = CATEGORIES.find(c => c.id === cid) || CATEGORIES[0];
            startQuiz(cat, diff, false);
          }} />
        )}

        {activeTab === AppTab.STATS && <StatsView progress={progress} />}
        {activeTab === AppTab.REWARDS && <RewardsView progress={progress} />}
      </main>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
