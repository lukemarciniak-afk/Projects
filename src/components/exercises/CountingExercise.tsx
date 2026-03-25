import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSound } from "../../hooks/useSound";
import { BigButton } from "../ui/BigButton";

interface CountingExerciseProps {
  count: number;
  objectType: string;
  onAnswer: (value: number) => void;
}

const OBJECT_EMOJIS: Record<string, string> = {
  apple: "\uD83C\uDF4E",
  star: "\u2B50",
  butterfly: "\uD83E\uDD8B",
  fish: "\uD83D\uDC1F",
  cookie: "\uD83C\uDF6A",
  balloon: "\uD83C\uDF88",
  flower: "\uD83C\uDF3B",
  heart: "\u2764\uFE0F",
};

export function CountingExercise({ count, objectType, onAnswer }: CountingExerciseProps) {
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const { play, speak } = useSound();
  const emoji = OBJECT_EMOJIS[objectType] ?? "\uD83C\uDF4E";

  const handleTap = useCallback(
    (index: number) => {
      if (tapped.has(index)) return;
      const newTapped = new Set(tapped).add(index);
      setTapped(newTapped);
      play("tap");
      speak(String(newTapped.size));

      if (newTapped.size === count) {
        setShowConfirm(true);
      }
    },
    [tapped, count, play, speak]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-3 max-w-sm">
        {Array.from({ length: count }, (_, i) => (
          <motion.button
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: i * 0.1,
              type: "spring",
              stiffness: 300,
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTap(i)}
            className={`
              text-4xl w-16 h-16 flex items-center justify-center
              rounded-2xl cursor-pointer relative
              transition-all
              ${tapped.has(i)
                ? "bg-kid-green/20 ring-2 ring-kid-green"
                : "bg-white shadow-sm hover:shadow-md"
              }
            `}
          >
            {emoji}
            {tapped.has(i) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-kid-green text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
              >
                {Array.from(tapped).sort((a, b) => a - b).indexOf(i) + 1}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <div className="text-center font-display text-2xl font-bold text-kid-purple">
        Count: {tapped.size}
      </div>

      {showConfirm && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <BigButton
            onClick={() => onAnswer(tapped.size)}
            color="green"
          >
            That&apos;s {count}! &#10004;
          </BigButton>
        </motion.div>
      )}
    </div>
  );
}
