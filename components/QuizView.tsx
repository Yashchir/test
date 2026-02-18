
import React, { useState, useEffect } from 'react';
import { Question, Category, Difficulty } from '../types';
import { ALL_QUESTIONS, CATEGORIES } from '../constants';

interface QuizViewProps {
  category: Category;
  difficulty: Difficulty;
  isDaily?: boolean;
  onComplete: (correctCount: number) => void;
  onClose: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ category, difficulty, isDaily = false, onComplete, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    let preparedQuestions: Question[] = [];

    if (isDaily) {
      // Режим Daily Training: 1 питання з кожної категорії і кожного рівня складності (5 * 3 = 15)
      const dailySelection: Question[] = [];
      
      CATEGORIES.forEach(cat => {
        (['easy', 'medium', 'hard'] as Difficulty[]).forEach(diff => {
          const matching = ALL_QUESTIONS.filter(
            q => q.category === cat.id && q.difficulty === diff
          );
          
          if (matching.length > 0) {
            const randomIdx = Math.floor(Math.random() * matching.length);
            const selectedQ = { ...matching[randomIdx] };
            // Перемішуємо варіанти відповідей
            selectedQ.options = [...selectedQ.options].sort(() => Math.random() - 0.5);
            dailySelection.push(selectedQ);
          }
        });
      });
      
      // Перемішуємо 15 вибраних запитань між собою
      preparedQuestions = dailySelection.sort(() => Math.random() - 0.5);
    } else {
      // Стандартний режим: 20 питань з однієї категорії та рівня
      const filtered = ALL_QUESTIONS.filter(
        q => q.category === category.id && q.difficulty === difficulty
      );
      
      const shuffledQuestions = [...filtered].sort(() => Math.random() - 0.5);
      preparedQuestions = shuffledQuestions.slice(0, 20).map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));
    }
    
    setQuestions(preparedQuestions);
  }, [category, difficulty, isDaily]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === questions[currentIdx].correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete(correctCount);
    }
  };

  if (questions.length === 0) return (
    <div className="fixed inset-0 z-[100] bg-black text-white p-8 flex flex-col items-center justify-center text-center">
      <div className="text-4xl mb-4">🧩</div>
      <h2 className="text-xl font-bold mb-2">Запитання готуються</h2>
      <p className="text-zinc-500 mb-6">Ми наповнюємо цей рівень новими даними. Спробуйте іншу категорію!</p>
      <button onClick={onClose} className="bg-zinc-800 px-6 py-3 rounded-2xl font-bold">Назад</button>
    </div>
  );

  const currentQuestion = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white p-6 safe-area-bottom flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onClose} className="text-zinc-400 font-medium px-2 py-1">Скасувати</button>
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold tracking-tighter text-zinc-500">
            {isDaily ? 'Щоденне тренування' : `${category.name} • ${difficulty}`}
          </p>
          <div className="text-lg font-black">{currentIdx + 1} <span className="text-zinc-600 text-sm">/ {questions.length}</span></div>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
          {correctCount} ✅
        </div>
      </div>

      <div className="h-1.5 bg-zinc-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
        <h2 className="text-2xl font-bold mb-8 leading-snug">{currentQuestion.question}</h2>
        
        {isDaily && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded-md text-zinc-400 font-bold uppercase tracking-widest">
              {CATEGORIES.find(c => c.id === currentQuestion.category)?.name}
            </span>
            <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest ${
              currentQuestion.difficulty === 'easy' ? 'text-emerald-500 bg-emerald-500/10' :
              currentQuestion.difficulty === 'medium' ? 'text-amber-500 bg-amber-500/10' :
              'text-rose-500 bg-rose-500/10'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>
        )}

        <div className="space-y-3">
          {currentQuestion.options.map((opt) => {
            const isCorrect = opt === currentQuestion.correctAnswer;
            const isSelected = selectedAnswer === opt;
            
            let style = "bg-zinc-900/50 border-zinc-800 text-zinc-300";
            if (selectedAnswer) {
              if (isCorrect) {
                style = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
              } else if (isSelected) {
                style = "bg-rose-500/20 border-rose-500 text-rose-400 font-bold";
              } else {
                style = "bg-zinc-900/30 border-zinc-900 text-zinc-600 opacity-50";
              }
            } else {
              style += " hover:bg-zinc-800 active:scale-[0.98] transition-all duration-200";
            }

            return (
              <button
                key={opt}
                disabled={!!selectedAnswer}
                onClick={() => handleAnswer(opt)}
                className={`w-full p-5 rounded-3xl border-2 text-left text-base shadow-sm ${style}`}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {selectedAnswer && isCorrect && <span className="text-lg">✓</span>}
                  {selectedAnswer && isSelected && !isCorrect && <span className="text-lg">✕</span>}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-8 p-5 bg-blue-500/5 rounded-3xl border border-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2">Пояснення</h4>
            <p className="text-sm text-zinc-400 leading-relaxed italic">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 mt-auto">
        {showExplanation ? (
          <button
            onClick={nextQuestion}
            className="w-full bg-white text-black py-4 rounded-3xl font-black text-lg active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            {currentIdx + 1 < questions.length ? 'Наступне питання' : 'Завершити тренування'}
          </button>
        ) : (
          <div className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest py-4">
            Виберіть одну правильну відповідь
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
