import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProgressState, LessonResult } from "../types/progress";

interface ProgressActions {
  completeLesson: (lessonId: string, score: number, total: number) => void;
  unlockLesson: (lessonId: string) => void;
  updateStreak: () => void;
  resetProgress: () => void;
}

type ProgressStore = ProgressState & ProgressActions;

const INITIAL_UNLOCKED = [
  "math-counting-1",
  "math-addition-1",
  "math-subtraction-1",
  "reading-letters-a",
  "reading-sight-1",
  "reading-phonics-1",
];

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      totalStars: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      completedLessons: {},
      unlockedLessons: [...INITIAL_UNLOCKED],

      completeLesson: (lessonId: string, score: number, total: number) => {
        const pct = total > 0 ? score / total : 0;
        const stars = pct === 1 ? 3 : pct >= 0.8 ? 2 : 1;
        const prev = get().completedLessons[lessonId];
        const newStars = prev ? Math.max(stars - prev.stars, 0) : stars;

        const result: LessonResult = {
          stars: prev ? Math.max(prev.stars, stars) : stars,
          bestScore: prev ? Math.max(prev.bestScore, pct) : pct,
          attempts: (prev?.attempts ?? 0) + 1,
          completedAt: new Date().toISOString(),
        };

        set((s) => ({
          totalStars: s.totalStars + newStars,
          completedLessons: {
            ...s.completedLessons,
            [lessonId]: result,
          },
        }));

        get().updateStreak();
      },

      unlockLesson: (lessonId: string) => {
        set((s) => ({
          unlockedLessons: s.unlockedLessons.includes(lessonId)
            ? s.unlockedLessons
            : [...s.unlockedLessons, lessonId],
        }));
      },

      updateStreak: () => {
        const today = new Date().toISOString().slice(0, 10);
        const last = get().lastActivityDate;
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .slice(0, 10);

        let newStreak: number;
        if (last === today) {
          newStreak = get().currentStreak;
        } else if (last === yesterday) {
          newStreak = get().currentStreak + 1;
        } else {
          newStreak = 1;
        }

        set((s) => ({
          lastActivityDate: today,
          currentStreak: newStreak,
          longestStreak: Math.max(s.longestStreak, newStreak),
        }));
      },

      resetProgress: () => {
        set({
          totalStars: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          completedLessons: {},
          unlockedLessons: [...INITIAL_UNLOCKED],
        });
      },
    }),
    { name: "kidlearn-progress" }
  )
);
