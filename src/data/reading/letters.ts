import type { Lesson } from "../../types/exercises";

interface LetterData {
  letter: string;
  word: string;
  emoji: string;
}

const letterData: LetterData[] = [
  { letter: "A", word: "Apple", emoji: "\uD83C\uDF4E" },
  { letter: "B", word: "Bear", emoji: "\uD83D\uDC3B" },
  { letter: "C", word: "Cat", emoji: "\uD83D\uDC31" },
  { letter: "D", word: "Dog", emoji: "\uD83D\uDC36" },
  { letter: "E", word: "Elephant", emoji: "\uD83D\uDC18" },
  { letter: "F", word: "Fish", emoji: "\uD83D\uDC1F" },
  { letter: "G", word: "Grape", emoji: "\uD83C\uDF47" },
  { letter: "H", word: "House", emoji: "\uD83C\uDFE0" },
  { letter: "I", word: "Ice cream", emoji: "\uD83C\uDF68" },
  { letter: "J", word: "Jellyfish", emoji: "\uD83E\uDEBC" },
  { letter: "K", word: "Kite", emoji: "\uD83E\uDE81" },
  { letter: "L", word: "Lion", emoji: "\uD83E\uDD81" },
  { letter: "M", word: "Moon", emoji: "\uD83C\uDF19" },
  { letter: "N", word: "Nest", emoji: "\uD83E\uDEB9" },
  { letter: "O", word: "Orange", emoji: "\uD83C\uDF4A" },
  { letter: "P", word: "Penguin", emoji: "\uD83D\uDC27" },
  { letter: "Q", word: "Queen", emoji: "\uD83D\uDC51" },
  { letter: "R", word: "Rainbow", emoji: "\uD83C\uDF08" },
  { letter: "S", word: "Sun", emoji: "\u2600\uFE0F" },
  { letter: "T", word: "Tree", emoji: "\uD83C\uDF33" },
  { letter: "U", word: "Umbrella", emoji: "\u2602\uFE0F" },
  { letter: "V", word: "Violin", emoji: "\uD83C\uDFBB" },
  { letter: "W", word: "Whale", emoji: "\uD83D\uDC33" },
  { letter: "X", word: "Xylophone", emoji: "\uD83C\uDFB6" },
  { letter: "Y", word: "Yarn", emoji: "\uD83E\uDDF6" },
  { letter: "Z", word: "Zebra", emoji: "\uD83E\uDD93" },
];

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getDistractorLetters(correct: string, count: number = 3): string[] {
  const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((l) => l !== correct.toUpperCase());
  return shuffleArray(all).slice(0, count);
}

export const letterLessons: Lesson[] = letterData.map((data, index) => {
  const distractors = getDistractorLetters(data.letter);
  return {
    id: `reading-letters-${data.letter.toLowerCase()}`,
    subject: "reading" as const,
    topic: "letters" as const,
    title: `Letter ${data.letter}`,
    description: `${data.letter} is for ${data.word}!`,
    icon: data.emoji,
    order: index + 1,
    exercises: [
      {
        id: `rl-${data.letter.toLowerCase()}-e1`,
        type: "multiple-choice" as const,
        prompt: `Which letter is ${data.letter}?`,
        visual: { type: "letter" as const, data: { letter: data.letter, word: data.word, emoji: data.emoji } },
        choices: shuffleArray([
          { value: data.letter, label: data.letter },
          ...distractors.map((d) => ({ value: d, label: d })),
        ]),
        correctAnswer: data.letter,
      },
      {
        id: `rl-${data.letter.toLowerCase()}-e2`,
        type: "multiple-choice" as const,
        prompt: `Which letter is lowercase ${data.letter.toLowerCase()}?`,
        choices: shuffleArray([
          { value: data.letter.toLowerCase(), label: data.letter.toLowerCase() },
          ...distractors.map((d) => ({ value: d.toLowerCase(), label: d.toLowerCase() })),
        ]),
        correctAnswer: data.letter.toLowerCase(),
      },
      {
        id: `rl-${data.letter.toLowerCase()}-e3`,
        type: "multiple-choice" as const,
        prompt: `What starts with the letter ${data.letter}?`,
        choices: shuffleArray([
          { value: data.word, label: `${data.emoji} ${data.word}` },
          ...distractors.slice(0, 3).map((d) => {
            const match = letterData.find((ld) => ld.letter === d);
            return { value: match?.word ?? d, label: `${match?.emoji ?? ""} ${match?.word ?? d}` };
          }),
        ]),
        correctAnswer: data.word,
      },
    ],
  };
});
