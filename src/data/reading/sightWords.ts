import type { Lesson } from "../../types/exercises";

const sightWordSets = [
  { id: 1, words: ["the", "and", "a", "to", "in"] },
  { id: 2, words: ["is", "it", "he", "was", "for"] },
  { id: 3, words: ["you", "are", "she", "they", "we"] },
  { id: 4, words: ["can", "said", "not", "but", "had"] },
  { id: 5, words: ["my", "do", "did", "get", "has"] },
  { id: 6, words: ["go", "see", "look", "come", "up"] },
  { id: 7, words: ["all", "like", "one", "big", "no"] },
  { id: 8, words: ["am", "at", "on", "his", "with"] },
];

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getDistractorWords(correct: string, allWords: string[]): string[] {
  return shuffleArray(allWords.filter((w) => w !== correct)).slice(0, 3);
}

const allSightWords = sightWordSets.flatMap((s) => s.words);

export const sightWordLessons: Lesson[] = sightWordSets.map((set) => ({
  id: `reading-sight-${set.id}`,
  subject: "reading" as const,
  topic: "sight-words" as const,
  title: `Sight Words ${set.id}`,
  description: `Learn: ${set.words.join(", ")}`,
  icon: "\uD83D\uDCD6",
  order: 26 + set.id,
  exercises: set.words.flatMap((word, wordIndex) => [
    {
      id: `rsw-${set.id}-${wordIndex}-e1`,
      type: "multiple-choice" as const,
      prompt: `Which word says "${word}"?`,
      visual: { type: "word-card" as const, data: { word } },
      choices: shuffleArray([
        { value: word, label: word },
        ...getDistractorWords(word, allSightWords).map((d) => ({
          value: d,
          label: d,
        })),
      ]),
      correctAnswer: word,
    },
  ]),
}));
