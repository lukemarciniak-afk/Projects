import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "../../hooks/useSound";

interface WordBuilderProps {
  targetWord: string;
  availableLetters: string[];
  onComplete: (correct: boolean) => void;
}

export function WordBuilder({ targetWord, availableLetters, onComplete }: WordBuilderProps) {
  const [placed, setPlaced] = useState<(string | null)[]>(
    Array(targetWord.length).fill(null)
  );
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const { play } = useSound();

  const nextEmptySlot = placed.findIndex((p) => p === null);

  const handleLetterClick = useCallback(
    (letter: string, index: number) => {
      if (usedIndices.has(index) || nextEmptySlot === -1) return;

      play("tap");
      const newPlaced = [...placed];
      newPlaced[nextEmptySlot] = letter;
      setPlaced(newPlaced);
      setUsedIndices(new Set(usedIndices).add(index));

      // Check if complete
      if (newPlaced.every((p) => p !== null)) {
        const word = newPlaced.join("");
        const correct = word.toLowerCase() === targetWord.toLowerCase();
        if (correct) {
          play("correct");
        } else {
          play("wrong");
        }
        setTimeout(() => onComplete(correct), 600);
      }
    },
    [placed, usedIndices, nextEmptySlot, targetWord, onComplete, play]
  );

  const handleSlotClick = useCallback(
    (slotIndex: number) => {
      if (placed[slotIndex] === null) return;

      play("tap");
      // Find which available letter index was used for this slot
      const letter = placed[slotIndex];
      const newPlaced = [...placed];
      newPlaced[slotIndex] = null;
      setPlaced(newPlaced);

      // Remove from used indices - find first matching used index
      const newUsed = new Set(usedIndices);
      for (const idx of usedIndices) {
        if (availableLetters[idx] === letter) {
          newUsed.delete(idx);
          break;
        }
      }
      setUsedIndices(newUsed);
    },
    [placed, usedIndices, availableLetters, play]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Target slots */}
      <div className="flex gap-2 justify-center">
        {placed.map((letter, i) => (
          <motion.button
            key={i}
            onClick={() => handleSlotClick(i)}
            className={`
              w-14 h-16 rounded-xl border-3 border-dashed
              flex items-center justify-center
              font-display font-bold text-2xl
              cursor-pointer transition-all
              ${letter
                ? "border-kid-purple bg-kid-purple/10 text-kid-purple"
                : i === nextEmptySlot
                  ? "border-kid-orange bg-kid-orange/5 text-kid-orange animate-pulse"
                  : "border-gray-300 bg-gray-50 text-gray-300"
              }
            `}
          >
            <AnimatePresence mode="wait">
              {letter && (
                <motion.span
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {letter.toUpperCase()}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Available letters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {availableLetters.map((letter, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLetterClick(letter, i)}
            disabled={usedIndices.has(i)}
            className={`
              w-12 h-14 rounded-xl
              font-display font-bold text-xl
              shadow-[0_3px_0_rgba(0,0,0,0.1)]
              cursor-pointer transition-all
              ${usedIndices.has(i)
                ? "bg-gray-100 text-gray-300 shadow-none"
                : "bg-white text-kid-text hover:bg-kid-blue/10"
              }
            `}
          >
            {letter.toUpperCase()}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
