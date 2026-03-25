import type { Lesson } from "../../types/exercises";

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const subtractionLessons: Lesson[] = [
  {
    id: "math-subtraction-1",
    subject: "math",
    topic: "subtraction",
    title: "Taking Away (to 5)",
    description: "Some go away! How many are left?",
    icon: "\u2796",
    order: 6,
    exercises: [
      {
        id: "ms1-e1",
        type: "multiple-choice",
        prompt: "What is 3 - 1?",
        visual: { type: "subtraction-scene", data: { total: 3, remove: 1, item: "apple" } },
        choices: shuffleArray([
          { value: 2, label: "2" },
          { value: 1, label: "1" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
        ]),
        correctAnswer: 2,
      },
      {
        id: "ms1-e2",
        type: "multiple-choice",
        prompt: "What is 5 - 2?",
        visual: { type: "subtraction-scene", data: { total: 5, remove: 2, item: "cookie" } },
        choices: shuffleArray([
          { value: 3, label: "3" },
          { value: 2, label: "2" },
          { value: 4, label: "4" },
          { value: 1, label: "1" },
        ]),
        correctAnswer: 3,
      },
      {
        id: "ms1-e3",
        type: "fill-in-blank",
        prompt: "4 - 2 = ___",
        visual: { type: "subtraction-scene", data: { total: 4, remove: 2, item: "star" } },
        blanks: [{ position: 0, answer: 2, options: [1, 2, 3, 4] }],
        correctAnswer: 2,
      },
      {
        id: "ms1-e4",
        type: "multiple-choice",
        prompt: "What is 5 - 3?",
        visual: { type: "subtraction-scene", data: { total: 5, remove: 3, item: "balloon" } },
        choices: shuffleArray([
          { value: 2, label: "2" },
          { value: 1, label: "1" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
        ]),
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "math-subtraction-2",
    subject: "math",
    topic: "subtraction",
    title: "Taking Away (to 10)",
    description: "Bigger numbers going away!",
    icon: "\uD83C\uDF43",
    order: 7,
    exercises: [
      {
        id: "ms2-e1",
        type: "multiple-choice",
        prompt: "What is 8 - 3?",
        visual: { type: "subtraction-scene", data: { total: 8, remove: 3, item: "fish" } },
        choices: shuffleArray([
          { value: 5, label: "5" },
          { value: 4, label: "4" },
          { value: 6, label: "6" },
          { value: 3, label: "3" },
        ]),
        correctAnswer: 5,
      },
      {
        id: "ms2-e2",
        type: "fill-in-blank",
        prompt: "10 - 4 = ___",
        blanks: [{ position: 0, answer: 6, options: [4, 5, 6, 7] }],
        correctAnswer: 6,
      },
      {
        id: "ms2-e3",
        type: "multiple-choice",
        prompt: "What is 7 - 4?",
        choices: shuffleArray([
          { value: 3, label: "3" },
          { value: 2, label: "2" },
          { value: 4, label: "4" },
          { value: 5, label: "5" },
        ]),
        correctAnswer: 3,
      },
      {
        id: "ms2-e4",
        type: "fill-in-blank",
        prompt: "9 - 5 = ___",
        blanks: [{ position: 0, answer: 4, options: [3, 4, 5, 6] }],
        correctAnswer: 4,
      },
    ],
  },
];
