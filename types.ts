
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  category: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Course {
  id: string;
  title: string;
  categoryId: string;
  levels: Record<Difficulty, string[]>; // Повернуто до масиву фактів
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  avatarColor: string;
}

export interface UserProgress {
  hasCompletedOnboarding: boolean;
  profile: UserProfile;
  totalScore: number;
  completedQuizzes: number;
  correctAnswers: number;
  level: number;
  unlockedLevels: Record<string, Record<Difficulty, boolean>>;
  activityCalendar: string[]; 
  achievements: string[]; 
}

export enum AppTab {
  HOME = 'home',
  ACADEMY = 'academy',
  STATS = 'stats',
  REWARDS = 'rewards'
}
