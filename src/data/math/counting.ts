import type { Lesson } from "../../types/exercises";

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const countingLessons: Lesson[] = [
  {
    id: "math-counting-1",
    subject: "math",
    topic: "counting",
    title: "Counting to 3",
    description: "Let's count small groups!",
    icon: "\uD83C\uDF4E",
    order: 1,
    exercises: [
      {
        id: "mc1-e1",
        type: "counting",
        prompt: "Tap each apple to count them!",
        visual: { type: "objects", data: { item: "apple", count: 2 } },
        correctAnswer: 2,
      },
      {
        id: "mc1-e2",
        type: "counting",
        prompt: "Tap each star to count them!",
        visual: { type: "objects", data: { item: "star", count: 3 } },
        correctAnswer: 3,
      },
      {
        id: "mc1-e3",
        type: "multiple-choice",
        prompt: "How many cookies do you see?",
        visual: { type: "objects", data: { item: "cookie", count: 1 } },
        choices: shuffleArray([
          { value: 1, label: "1" },
          { value: 2, label: "2" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
        ]),
        correctAnswer: 1,
      },
      {
        id: "mc1-e4",
        type: "multiple-choice",
        prompt: "How many butterflies do you see?",
        visual: { type: "objects", data: { item: "butterfly", count: 3 } },
        choices: shuffleArray([
          { value: 1, label: "1" },
          { value: 2, label: "2" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
        ]),
        correctAnswer: 3,
      },
    ],
  },
  {
    id: "math-counting-2",
    subject: "math",
    topic: "counting",
    title: "Counting to 5",
    description: "Can you count up to 5?",
    icon: "\u2B50",
    order: 2,
    exercises: [
      {
        id: "mc2-e1",
        type: "counting",
        prompt: "Tap each balloon to count them!",
        visual: { type: "objects", data: { item: "balloon", count: 4 } },
        correctAnswer: 4,
      },
      {
        id: "mc2-e2",
        type: "counting",
        prompt: "Tap each flower to count them!",
        visual: { type: "objects", data: { item: "flower", count: 5 } },
        correctAnswer: 5,
      },
      {
        id: "mc2-e3",
        type: "multiple-choice",
        prompt: "How many fish do you see?",
        visual: { type: "objects", data: { item: "fish", count: 4 } },
        choices: shuffleArray([
          { value: 3, label: "3" },
          { value: 4, label: "4" },
          { value: 5, label: "5" },
          { value: 6, label: "6" },
        ]),
        correctAnswer: 4,
      },
      {
        id: "mc2-e4",
        type: "multiple-choice",
        prompt: "How many hearts do you see?",
        visual: { type: "objects", data: { item: "heart", count: 5 } },
        choices: shuffleArray([
          { value: 3, label: "3" },
          { value: 4, label: "4" },
          { value: 5, label: "5" },
          { value: 6, label: "6" },
        ]),
        correctAnswer: 5,
      },
    ],
  },
  {
    id: "math-counting-3",
    subject: "math",
    topic: "counting",
    title: "Counting to 10",
    description: "Let's count bigger groups!",
    icon: "\uD83C\uDF88",
    order: 3,
    exercises: [
      {
        id: "mc3-e1",
        type: "counting",
        prompt: "Tap each cookie to count them!",
        visual: { type: "objects", data: { item: "cookie", count: 7 } },
        correctAnswer: 7,
      },
      {
        id: "mc3-e2",
        type: "counting",
        prompt: "Tap each star to count them!",
        visual: { type: "objects", data: { item: "star", count: 10 } },
        correctAnswer: 10,
      },
      {
        id: "mc3-e3",
        type: "multiple-choice",
        prompt: "How many apples do you see?",
        visual: { type: "objects", data: { item: "apple", count: 8 } },
        choices: shuffleArray([
          { value: 6, label: "6" },
          { value: 7, label: "7" },
          { value: 8, label: "8" },
          { value: 9, label: "9" },
        ]),
        correctAnswer: 8,
      },
      {
        id: "mc3-e4",
        type: "multiple-choice",
        prompt: "How many balloons do you see?",
        visual: { type: "objects", data: { item: "balloon", count: 6 } },
        choices: shuffleArray([
          { value: 4, label: "4" },
          { value: 5, label: "5" },
          { value: 6, label: "6" },
          { value: 7, label: "7" },
        ]),
        correctAnswer: 6,
      },
    ],
  },
];
