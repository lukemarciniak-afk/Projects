import type { Lesson } from "../../types/exercises";

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface PhonicsWord {
  word: string;
  letters: string[];
  emoji: string;
}

const cvcWords: PhonicsWord[] = [
  { word: "cat", letters: ["c", "a", "t"], emoji: "\uD83D\uDC31" },
  { word: "dog", letters: ["d", "o", "g"], emoji: "\uD83D\uDC36" },
  { word: "sun", letters: ["s", "u", "n"], emoji: "\u2600\uFE0F" },
  { word: "hat", letters: ["h", "a", "t"], emoji: "\uD83E\uDDE2" },
  { word: "bug", letters: ["b", "u", "g"], emoji: "\uD83D\uDC1B" },
  { word: "pen", letters: ["p", "e", "n"], emoji: "\uD83D\uDD8A\uFE0F" },
  { word: "cup", letters: ["c", "u", "p"], emoji: "\u2615" },
  { word: "bed", letters: ["b", "e", "d"], emoji: "\uD83D\uDECF\uFE0F" },
  { word: "fox", letters: ["f", "o", "x"], emoji: "\uD83E\uDD8A" },
  { word: "pig", letters: ["p", "i", "g"], emoji: "\uD83D\uDC37" },
  { word: "map", letters: ["m", "a", "p"], emoji: "\uD83D\uDDFA\uFE0F" },
  { word: "red", letters: ["r", "e", "d"], emoji: "\uD83D\uDD34" },
];

export const phonicsLessons: Lesson[] = [
  {
    id: "reading-phonics-1",
    subject: "reading",
    topic: "phonics",
    title: "CVC Words 1",
    description: "Build simple words: cat, dog, sun!",
    icon: "\uD83E\uDDE9",
    order: 35,
    exercises: cvcWords.slice(0, 4).flatMap((cvc, i) => [
      {
        id: `rp1-${i}-spell`,
        type: "drag-and-drop" as const,
        prompt: `Spell the word! ${cvc.emoji}`,
        visual: { type: "phonics-blend" as const, data: { word: cvc.word, emoji: cvc.emoji } },
        dragItems: shuffleArray([
          ...cvc.letters.map((l, j) => ({ id: `${cvc.word}-${j}`, content: l.toUpperCase() })),
        ]),
        dropTargets: cvc.letters.map((_l, j) => ({
          id: `target-${j}`,
          label: "?",
          acceptsId: `${cvc.word}-${j}`,
        })),
        correctAnswer: cvc.word,
      },
      {
        id: `rp1-${i}-mc`,
        type: "multiple-choice" as const,
        prompt: `Which word matches? ${cvc.emoji}`,
        choices: shuffleArray([
          { value: cvc.word, label: cvc.word },
          ...shuffleArray(cvcWords.filter((w) => w.word !== cvc.word))
            .slice(0, 3)
            .map((w) => ({ value: w.word, label: w.word })),
        ]),
        correctAnswer: cvc.word,
      },
    ]),
  },
  {
    id: "reading-phonics-2",
    subject: "reading",
    topic: "phonics",
    title: "CVC Words 2",
    description: "More words: hat, bug, pen!",
    icon: "\uD83D\uDD24",
    order: 36,
    exercises: cvcWords.slice(4, 8).flatMap((cvc, i) => [
      {
        id: `rp2-${i}-spell`,
        type: "drag-and-drop" as const,
        prompt: `Spell the word! ${cvc.emoji}`,
        visual: { type: "phonics-blend" as const, data: { word: cvc.word, emoji: cvc.emoji } },
        dragItems: shuffleArray([
          ...cvc.letters.map((l, j) => ({ id: `${cvc.word}-${j}`, content: l.toUpperCase() })),
        ]),
        dropTargets: cvc.letters.map((_l, j) => ({
          id: `target-${j}`,
          label: "?",
          acceptsId: `${cvc.word}-${j}`,
        })),
        correctAnswer: cvc.word,
      },
      {
        id: `rp2-${i}-mc`,
        type: "multiple-choice" as const,
        prompt: `Which word matches? ${cvc.emoji}`,
        choices: shuffleArray([
          { value: cvc.word, label: cvc.word },
          ...shuffleArray(cvcWords.filter((w) => w.word !== cvc.word))
            .slice(0, 3)
            .map((w) => ({ value: w.word, label: w.word })),
        ]),
        correctAnswer: cvc.word,
      },
    ]),
  },
];
