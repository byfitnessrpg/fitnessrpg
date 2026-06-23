export interface Exercise {
  id: string;
  name: string;
  icon: string;
  base: number;
  max: number;
  sets: number;
  unit: string;
  type: 'reps' | 'timer';
  cat: 'força' | 'core' | 'cardio';
  muscles: string[];
  pose: string;
  mColor: string;
  xp: number;
  diff: 'Fácil' | 'Médio' | 'Difícil' | 'Épico';
  steps: string[];
}

export interface WeeklyMission {
  id: string;
  title: string;
  desc: string;
  xp: number;
  diff: string;
  total: number;
}

export interface SpecialMission {
  id: string;
  title: string;
  desc: string;
  xp: number;
  diff: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface UserProfileState {
  level: number;
  xp: number;
  totalXP: number;
  streak: number;
  lastTrainingDate: string | null;
  totalMissions: number;
  completedToday: string[];
  weekDaysTraining: number;
  weekFlexoes: number;
  weekCardio: number;
  weekConsistency: number;
  totalFlexoes: number;
  totalAgacham: number;
  totalPrancha: number;
  maxDayMissions: number;
  maxConsecutive: number;
  consecutiveRun: number;
  completedWeekly: string[];
  completedSpecial: string[];
  unlockedAchievements: string[];
  earlyBird: boolean;
  trioPerfect: boolean;
  todayCategories: string[];
  moedas: number;
}

export interface RankingPlayer {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  isMe?: boolean;
}
