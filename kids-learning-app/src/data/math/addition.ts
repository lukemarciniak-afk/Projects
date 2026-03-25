import type { Lesson } from "../../types/exercises";

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const additionLessons: Lesson[] = [
  {
    id: "math-addition-1",
    subject: "math",
    topic: "addition",
    title: "Adding to 5",
    description: "Let's put groups together!",
    icon: "\u2795",
    order: 4,
    exercises: [
      {
        id: "ma1-e1",
        type: "multiple-choice",
        prompt: "What is 1 + 1?",
        visual: { type: "addition-scene", data: { a: 1, b: 1, item: "apple" } },
        choices: shuffleArray([
          { value: 2, label: "2" },
          { value: 1, label: "1" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
        ]),
        correctAnswer: 2,
      },
      {
        id: "ma1-e2",
        type: "multiple-choice",
        prompt: "What is 2 + 1?",
        visual: { type: "addition-scene", data: { a: 2, b: 1, item: "star" } },
        choices: shuffleArray([
          { value: 3, label: "3" },
          { value: 2, label: "2" },
          { value: 4, label: "4" },
          { value: 1, label: "1" },
        ]),
        correctAnswer: 3,
      },
      {
        id: "ma1-e3",
        type: "fill-in-blank",
        prompt: "2 + 2 = ___",
        visual: { type: "addition-scene", data: { a: 2, b: 2, item: "cookie" } },
        blanks: [{ position: 0, answer: 4, options: [2, 3, 4, 5] }],
        correctAnswer: 4,
      },
      {
        id: "ma1-e4",
        type: "multiple-choice",
        prompt: "What is 3 + 2?",
        visual: { type: "addition-scene", data: { a: 3, b: 2, item: "balloon" } },
        choices: shuffleArray([
          { value: 5, label: "5" },
          { value: 4, label: "4" },
          { value: 6, label: "6" },
          { value: 3, label: "3" },
        ]),
        correctAnswer: 5,
      },
    ],
  },
  {
    id: "math-addition-2",
    subject: "math",
    topic: "addition",
    title: "Adding to 10",
    description: "Bigger numbers, more fun!",
    icon: "\uD83E\uDDE9",
    order: 5,
    exercises: [
      {
        id: "ma2-e1",
        type: "multiple-choice",
        prompt: "What is 4 + 3?",
        visual: { type: "addition-scene", data: { a: 4, b: 3, item: "fish" } },
        choices: shuffleArray([
          { value: 7, label: "7" },
          { value: 6, label: "6" },
          { value: 8, label: "8" },
          { value: 5, label: "5" },
        ]),
        correctAnswer: 7,
      },
      {
        id: "ma2-e2",
        type: "fill-in-blank",
        prompt: "5 + 3 = ___",
        visual: { type: "addition-scene", data: { a: 5, b: 3, item: "butterfly" } },
        blanks: [{ position: 0, answer: 8, options: [6, 7, 8, 9] }],
        correctAnswer: 8,
      },
      {
        id: "ma2-e3",
        type: "multiple-choice",
        prompt: "What is 6 + 4?",
        visual: { type: "addition-scene", data: { a: 6, b: 4, item: "star" } },
        choices: shuffleArray([
          { value: 10, label: "10" },
          { value: 9, label: "9" },
          { value: 8, label: "8" },
          { value: 11, label: "11" },
        ]),
        correctAnswer: 10,
      },
      {
        id: "ma2-e4",
        type: "fill-in-blank",
        prompt: "3 + 5 = ___",
        blanks: [{ position: 0, answer: 8, options: [6, 7, 8, 9] }],
        correctAnswer: 8,
      },
    ],
  },
];
