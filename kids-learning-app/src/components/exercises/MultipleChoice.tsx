import { useState } from "react";
import { motion } from "framer-motion";
import type { Choice } from "../../types/exercises";
import { useSound } from "../../hooks/useSound";

interface MultipleChoiceProps {
  choices: Choice[];
  onAnswer: (value: string | number) => void;
  disabled?: boolean;
}

const choiceColors = ["bg-kid-blue", "bg-kid-pink", "bg-kid-green", "bg-kid-orange"];

export function MultipleChoice({ choices, onAnswer, disabled }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | number | null>(null);
  const [wrongIds, setWrongIds] = useState<Set<string | number>>(new Set());
  const { play } = useSound();

  const handleSelect = (value: string | number) => {
    if (disabled || selected === value) return;
    play("tap");
    setSelected(value);
    onAnswer(value);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {choices.map((choice, i) => {
        const isWrong = wrongIds.has(choice.value);
        return (
          <motion.button
            key={choice.value}
            whileTap={{ scale: 0.95 }}
            animate={
              isWrong
                ? { x: [0, -8, 8, -8, 0] }
                : undefined
            }
            transition={{ duration: 0.4 }}
            onClick={() => {
              handleSelect(choice.value);
              // Parent will call submitAnswer; if wrong we mark it
              // This is handled via the parent feedback
            }}
            onAnimationComplete={() => {
              if (isWrong) {
                setWrongIds((prev) => {
                  const next = new Set(prev);
                  next.delete(choice.value);
                  return next;
                });
              }
            }}
            disabled={disabled}
            className={`
              ${choiceColors[i % choiceColors.length]}
              min-h-[64px] rounded-2xl
              text-white font-display font-bold text-xl
              shadow-[0_4px_0_rgba(0,0,0,0.15)]
              active:shadow-[0_2px_0_rgba(0,0,0,0.15)]
              transition-all cursor-pointer
              disabled:opacity-50
              flex items-center justify-center
            `}
          >
            {choice.label}
          </motion.button>
        );
      })}
    </div>
  );
}

