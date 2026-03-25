export interface LessonResult {
  stars: number;
  bestScore: number;
  attempts: number;
  completedAt: string;
}

export interface ProgressState {
  totalStars: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  completedLessons: Record<string, LessonResult>;
  unlockedLessons: string[];
}
