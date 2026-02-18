
import React, { useState } from 'react';
import { UserProfile, UserProgress, Difficulty, Question } from '../types';
import { AVATARS, AVATAR_COLORS, ALL_QUESTIONS } from '../constants';

interface OnboardingViewProps {
  onComplete: (profile: UserProfile, assessmentScore: number) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'profile' | 'quiz' | 'finish'>('profile');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0].icon);
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  
  const [quizQuestions] = useState<Question[]>(() => {
    return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleStartQuiz = () => {
    if (name.trim()) setStep('quiz');
  };

  const handleSkip = () => {
    onComplete({ 
      name: 'Гравець', 
      avatar: AVATARS[0].icon, 
      avatarColor: AVATAR_COLORS[0] 
    }, 0);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === quizQuestions[currentIdx].correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentIdx + 1 < quizQuestions.length) {
        setCurrentIdx(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setStep('finish');
      }
    }, 1000);
  };

  const handleFinish = () => {
    onComplete({ name, avatar, avatarColor }, correctCount);
  };

  if (step === 'profile') {
    return (
      <div className="fixed inset-0 bg-black z-[200] p-8 flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-y-auto scrollbar-hide">
        <div className="text-center mb-10 shrink-0">
          <h1 className="text-4xl font-black mb-2 tracking-tighter">Вітаємо!</h1>
          <p className="text-zinc-500 font-medium">Створи свій ігровий профіль</p>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className={`w-24 h-24 ${avatarColor} rounded-3xl flex items-center justify-center text-5xl border-2 border-white/20 shadow-2xl transition-all duration-300`}>
              {avatar}
            </div>
            <input 
              type="text" 
              placeholder="Твоє ім'я" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 text-center font-bold focus:border-blue-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3 text-center">Вибери аватар</p>
              <div className="grid grid-cols-5 gap-3">
                {AVATARS.map(av => (
                  <button 
                    key={av.id}
                    onClick={() => setAvatar(av.icon)}
                    className={`text-2xl w-full aspect-square rounded-xl flex items-center justify-center border-2 transition-all ${
                      avatar === av.icon ? 'bg-blue-600 border-blue-400 scale-110 shadow-lg shadow-blue-600/20' : 'bg-zinc-900 border-zinc-800 opacity-60'
                    }`}
                  >
                    {av.icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3 text-center">Вибери колір фону</p>
              <div className="grid grid-cols-5 gap-3">
                {AVATAR_COLORS.map((color, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setAvatarColor(color)}
                    className={`w-full aspect-square rounded-full border-2 transition-all ${color} ${
                      avatarColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              disabled={!name.trim()}
              onClick={handleStartQuiz}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              Продовжити
            </button>
            <button 
              onClick={handleSkip}
              className="w-full py-2 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] active:opacity-50 transition-opacity"
            >
              Пропустити і почати гру
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = quizQuestions[currentIdx];
    return (
      <div className="fixed inset-0 bg-black z-[200] p-8 flex flex-col animate-in slide-in-from-right duration-500">
        <div className="mb-12">
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Оцінка знань</p>
          <div className="flex gap-1">
            {quizQuestions.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentIdx ? 'bg-blue-500' : 'bg-zinc-800'}`} />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-10 leading-tight">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map(opt => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === q.correctAnswer;
              let style = "bg-zinc-900 border-zinc-800 text-zinc-400";
              if (selectedAnswer) {
                if (isCorrect) style = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
                else if (isSelected) style = "bg-rose-500/20 border-rose-500 text-rose-400 font-bold";
                else style = "opacity-30 border-zinc-900";
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[200] p-8 flex flex-col items-center justify-center animate-in zoom-in duration-500 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-4xl font-black mb-4">Профіль готовий!</h2>
      <p className="text-zinc-500 mb-12 max-w-xs">
        Ти відповів правильно на {correctCount} з 5 питань. Ми підготували для тебе персональну програму навчання.
      </p>
      
      <div className="w-full max-w-xs bg-zinc-900 rounded-3xl p-6 border border-zinc-800 mb-12">
        <div className={`w-20 h-20 mx-auto ${avatarColor} rounded-2xl flex items-center justify-center text-4xl mb-3 border border-white/10`}>
          {avatar}
        </div>
        <div className="font-bold text-xl">{name}</div>
        <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-1">Рівень 1 • Картка Акули</div>
      </div>

      <button 
        onClick={handleFinish}
        className="w-full max-w-sm bg-blue-600 text-white py-5 rounded-3xl font-black text-xl active:scale-95 transition-all shadow-2xl shadow-blue-600/20"
      >
        До столу!
      </button>
    </div>
  );
};

export default OnboardingView;
