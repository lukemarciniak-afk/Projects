import { useState, useCallback } from "react";
import type { Exercise } from "../types/exercises";

export type ExercisePhase = "presenting" | "answering" | "feedback" | "complete";

interface ExerciseAnswer {
  exerciseId: string;
  correct: boolean;
  attempts: number;
}

interface ExerciseState {
  phase: ExercisePhase;
  currentIndex: number;
  totalExercises: number;
  score: number;
  currentAttempts: number;
  answers: ExerciseAnswer[];
  feedbackCorrect: boolean | null;
}

export function useExercise(exercises: Exercise[]) {
  const [state, setState] = useState<ExerciseState>({
    phase: "presenting",
    currentIndex: 0,
    totalExercises: exercises.length,
    score: 0,
    currentAttempts: 0,
    answers: [],
    feedbackCorrect: null,
  });

  const currentExercise = exercises[state.currentIndex] ?? null;

  const startAnswering = useCallback(() => {
    setState((s) => ({ ...s, phase: "answering" }));
  }, []);

  const submitAnswer = useCallback(
    (answer: string | number) => {
      if (!currentExercise) return;

      const isCorrect =
        String(answer).toLowerCase() ===
        String(currentExercise.correctAnswer).toLowerCase();

      const newAttempts = state.currentAttempts + 1;

      if (isCorrect) {
        const newAnswer: ExerciseAnswer = {
          exerciseId: currentExercise.id,
          correct: true,
          attempts: newAttempts,
        };
        setState((s) => ({
          ...s,
          phase: "feedback",
          feedbackCorrect: true,
          score: s.score + 1,
          currentAttempts: 0,
          answers: [...s.answers, newAnswer],
        }));
      } else if (newAttempts >= 3) {
        // After 3 wrong attempts, reveal answer and move on
        const newAnswer: ExerciseAnswer = {
          exerciseId: currentExercise.id,
          correct: false,
          attempts: newAttempts,
        };
        setState((s) => ({
          ...s,
          phase: "feedback",
          feedbackCorrect: false,
          currentAttempts: 0,
          answers: [...s.answers, newAnswer],
        }));
      } else {
        setState((s) => ({
          ...s,
          feedbackCorrect: false,
          currentAttempts: newAttempts,
        }));
      }
    },
    [currentExercise, state.currentAttempts]
  );

  const nextExercise = useCallback(() => {
    setState((s) => {
      const nextIndex = s.currentIndex + 1;
      if (nextIndex >= s.totalExercises) {
        return { ...s, phase: "complete" };
      }
      return {
        ...s,
        phase: "presenting",
        currentIndex: nextIndex,
        feedbackCorrect: null,
        currentAttempts: 0,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      phase: "presenting",
      currentIndex: 0,
      totalExercises: exercises.length,
      score: 0,
      currentAttempts: 0,
      answers: [],
      feedbackCorrect: null,
    });
  }, [exercises.length]);

  return {
    ...state,
    currentExercise,
    startAnswering,
    submitAnswer,
    nextExercise,
    reset,
    progress: exercises.length > 0
      ? ((state.currentIndex + (state.phase === "complete" ? 1 : 0)) / exercises.length) * 100
      : 0,
  };
}
