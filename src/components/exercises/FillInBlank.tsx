import { useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "../../hooks/useSound";

interface FillInBlankProps {
  equation: string;
  options: (string | number)[];
  onAnswer: (value: string | number) => void;
  disabled?: boolean;
}

export function FillInBlank({ equation, options, onAnswer, disabled }: FillInBlankProps) {
  const [selected, setSelected] = useState<string | number | null>(null);
  const { play } = useSound();

  const parts = equation.split("___");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="font-display text-3xl font-bold text-kid-text flex items-center gap-2 flex-wrap justify-center">
        {parts.map((part, i) => (
          <span key={i} className="flex items-center gap-2">
            <span>{part}</span>
            {i < parts.length - 1 && (
              <motion.span
                className={`
                  inline-flex items-center justify-center
                  min-w-[60px] h-14 px-3
                  rounded-xl border-3 border-dashed
                  font-display text-2xl font-bold
                  ${selected !== null
                    ? "border-kid-purple bg-kid-purple/10 text-kid-purple"
                    : "border-kid-orange bg-kid-orange/10 text-kid-orange"
                  }
                `}
                animate={selected !== null ? { scale: [1.1, 1] } : undefined}
              >
                {selected !== null ? String(selected) : "?"}
              </motion.span>
            )}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {options.map((opt) => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (disabled) return;
              play("tap");
              setSelected(opt);
              onAnswer(opt);
            }}
            disabled={disabled}
            className={`
              w-14 h-14 rounded-xl
              font-display font-bold text-xl
              shadow-[0_3px_0_rgba(0,0,0,0.12)]
              cursor-pointer transition-all
              ${selected === opt
                ? "bg-kid-purple text-white"
                : "bg-white text-kid-text hover:bg-kid-purple/10"
              }
            `}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
